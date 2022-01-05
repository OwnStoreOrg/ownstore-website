import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from '../../_app'
import { DesktopView, MobileView } from '../../../components/ResponsiveViews'
import Snackbar from '../../../components/header/Snackbar'
import PageContainer from '../../../components/PageContainer'
import BackTitle from '../../../components/BackTitle'
import CoreTextInput, { CoreTextInputType } from '../../../components/core/CoreInput'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../components/core/CoreButton'
import NoContent, { NoContentType } from '../../../components/NoContent'
import { getLoginPageUrl } from '../../../utils/login'
import ApplicationContext from '../../../components/ApplicationContext'
import useOnEnter from '../../../hooks/useOnEnter'
import classnames from 'classnames'
import Loader, { LoaderType } from '../../../components/loader/Loader'
import { changeSessionUserPassword, updateSessionUserInfo } from '../../../http/user'
import { QUERY_PARAM_MAP, REGEX_MAP } from '../../../constants/constants'
import { useRouter } from 'next/router'
import ApiError from '../../../error/ApiError'
import { toastError, toastSuccess } from '../../../components/Toaster'
import { prepareAccountChangePasswordPageSeo } from '../../../utils/seo/pages/account'
import appAnalytics from '../../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../../constants/analytics'
import { vibrate } from '../../../utils/common'

interface IState {
  password: string
  confirmPassword: string
  newPassword: string
}

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ChangePasswordPage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user, userGlobalDetailLoaded } = applicationContext

  const router = useRouter()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [state, dispatch] = useState<IState>({
    password: '',
    confirmPassword: '',
    newPassword: '',
  })

  const [loading, toggleLoading] = useState(false)

  const formRef = useRef(null)

  const [fieldsWithError, setFieldsWithError] = useState({
    PASSWORD: false,
    CONFIRM_PASSWORD: false,
    NEW_PASSWORD: false,
  })

  const updateField = (key: keyof IState, value: string) => {
    dispatch({
      ...state,
      [key]: value,
    })
  }

  const FIELD_VALIDATION_MAPPING = {
    PASSWORD: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid password',
      value: state.password,
      key: 'PASSWORD',
    },
    CONFIRM_PASSWORD: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: `Invalid password`,
      value: state.confirmPassword,
      key: 'CONFIRM_PASSWORD',
    },
    NEW_PASSWORD: {
      regex: REGEX_MAP.PASSWORD,
      error: 'Invalid new password (must be between 3-30 letters)',
      value: state.newPassword,
      key: 'NEW_PASSWORD',
    },
  }

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const validatedFields = Object.values(FIELD_VALIDATION_MAPPING).map(field => {
      return {
        ...field,
        valid: field.regex.test(field.value),
      }
    })

    const updatedFieldsWithError = validatedFields.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.key]: !cur.valid,
      }
    }, fieldsWithError)

    setFieldsWithError(updatedFieldsWithError)

    const invalidFields = validatedFields.filter(field => !field.valid)

    if (invalidFields.length) {
      toastError(invalidFields[0].error)
    } else if (state.password !== state.confirmPassword) {
      toastError(`Existing passwords don't match`)
    } else {
      toggleLoading(true)

      changeSessionUserPassword({ password: state.confirmPassword, newPassword: state.newPassword })
        .then(resp => {
          if (resp.success) {
            toastSuccess('Password updated')
            router.back()
            updateField('password', '')
            updateField('confirmPassword', '')
            updateField('newPassword', '')
            appAnalytics.sendEvent({
              action: AnalyticsEventType.CHANGE_PASSWORD,
            })
          }
        })
        .catch(err => {
          if (err instanceof ApiError && err.response.code !== 'UNKNOWN') {
            toastError(err.response.message || 'Failed to update password')
          } else {
            toastError('Failed to update password')
          }
        })
        .finally(() => {
          toggleLoading(false)
        })
    }
  }

  useOnEnter(formRef, handleSubmit)

  const renderLoader = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader type={LoaderType.ELLIPSIS} />
        <div>Fetching your account details...</div>
      </div>
    )
  }

  const renderLoginContent = () => {
    return (
      <div>
        <NoContent message="Please login to view edit your account details." type={NoContentType.LOGIN} />
        <div className="text-center">
          <CoreButton
            label="Login to update"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            url={`${getLoginPageUrl()}?${QUERY_PARAM_MAP.BACK_PAGE_URL}=${router.asPath}`}
          />
        </div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div ref={formRef}>
        <div className="user-input-group">
          <div className="user-input-label">Existing Password *</div>
          <CoreTextInput
            type={CoreTextInputType.PASSWORD}
            placeholder="Password"
            value={state.password}
            setValue={value => updateField('password', value)}
            autoComplete="current-password"
            autoFocus
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.PASSWORD,
            })}
          />
        </div>
        <div className="user-input-group">
          <div className="user-input-label">Confirm Password *</div>
          <CoreTextInput
            type={CoreTextInputType.PASSWORD}
            placeholder="Password"
            value={state.confirmPassword}
            setValue={value => updateField('confirmPassword', value)}
            autoComplete="off"
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.CONFIRM_PASSWORD,
            })}
          />
        </div>
        <div className="user-input-group">
          <div className="user-input-label">New Password *</div>
          <CoreTextInput
            type={CoreTextInputType.PASSWORD}
            placeholder="Password"
            value={state.newPassword}
            setValue={value => updateField('newPassword', value)}
            autoComplete="new-password"
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.NEW_PASSWORD,
            })}
          />
        </div>
        <div className="user-input-group">
          <CoreButton
            label="Update Password"
            size={CoreButtonSize.LARGE}
            type={CoreButtonType.SOLID_PRIMARY}
            className="w-full"
            loading={loading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <MobileView>
        <Snackbar title="Change Password" />
      </MobileView>

      <PageContainer>
        <div className="">
          <DesktopView>
            <BackTitle title="Change Password" />
          </DesktopView>

          {/* <AccountLayout> */}
          <div className="px-3 mt-4 lg:mt-14 w-full md:w-[500px] mx-auto">
            {!userGlobalDetailLoaded ? renderLoader() : user ? renderContent() : renderLoginContent()}
          </div>
          {/* </AccountLayout> */}
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareAccountChangePasswordPageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
  }
}

export default ChangePasswordPage
