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
import { updateSessionUserInfo } from '../../../http/user'
import { QUERY_PARAM_MAP, REGEX_MAP } from '../../../constants/constants'
import { useRouter } from 'next/router'
import { toastError, toastSuccess } from '../../../components/Toaster'
import { prepareAccountDetailsEditPageSeo } from '../../../utils/seo/pages/account'
import appAnalytics from '../../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../../constants/analytics'
import { getAccountDetailsPageUrl } from '../../../utils/account'
import { vibrate } from '../../../utils/common'

interface IState {
  name: string
  email: string
  phoneNumber: string
}

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const EditAccountPage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user, userGlobalDetailLoaded } = applicationContext

  const router = useRouter()

  const [state, dispatch] = useState<IState>({
    name: '',
    email: '',
    phoneNumber: '',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (user) {
      dispatch({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      })
    }
  }, [user])

  const [loading, toggleLoading] = useState(false)

  const formRef = useRef(null)

  const [fieldsWithError, setFieldsWithError] = useState({
    NAME: false,
    EMAIL: false,
    PHONE_NUMBER: false,
  })

  const updateField = (key: keyof IState, value: string) => {
    dispatch({
      ...state,
      [key]: value,
    })
  }

  const FIELD_VALIDATION_MAPPING = {
    NAME: {
      regex: REGEX_MAP.NAME,
      error: 'Invalid name (must be between 3-50 letters)',
      value: state.name,
      key: 'NAME',
      optional: false,
    },
    EMAIL: {
      regex: REGEX_MAP.EMAIL,
      error: 'Invalid Email',
      value: state.email,
      key: 'EMAIL',
      optional: false,
    },
    PHONE_NUMBER: {
      regex: REGEX_MAP.PHONE_NUMBER,
      error: 'Invalid phone number',
      value: state.phoneNumber,
      key: 'PHONE_NUMBER',
      optional: true,
    },
  }

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const validatedFields = Object.values(FIELD_VALIDATION_MAPPING).map(field => {
      let valid = false

      if (!field.optional) {
        valid = field.regex.test(field.value)
      } else {
        if (field.value) {
          valid = field.regex.test(field.value)
        } else {
          valid = true
        }
      }

      return {
        ...field,
        valid: valid,
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
    } else {
      toggleLoading(true)
      updateSessionUserInfo({
        name: state.name,
        email: state.email,
        phoneNumber: state.phoneNumber || null,
        isActive: null,
      })
        .then(resp => {
          if (resp.success) {
            toastSuccess('Updated successfully')
            applicationContext.updaters.updateUser({
              ...user,
              name: state.name,
              email: state.email,
              phoneNumber: state.phoneNumber,
            })
            appAnalytics.sendEvent({
              action: AnalyticsEventType.EDIT_PROFILE,
            })
            router.back()
          }
        })
        .catch(err => {
          toastError('Failed to update')
        })
        .finally(() => toggleLoading(false))
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
            label="Login to edit"
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
          <div className="user-input-label">Full Name *</div>
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Name"
            value={state.name}
            setValue={value => updateField('name', value)}
            autoComplete="name"
            autoFocus
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.NAME,
            })}
          />
        </div>
        <div className="user-input-group">
          <div className="user-input-label">Email Address *</div>
          <div className="text-sm relative -top-2">Cannot be modified</div>
          <CoreTextInput
            type={CoreTextInputType.EMAIL}
            placeholder="Email"
            value={state.email}
            setValue={value => updateField('email', value)}
            autoComplete="email"
            disabled
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.EMAIL,
            })}
          />
        </div>
        <div className="user-input-group">
          <div className="user-input-label">Phone Number</div>
          <div className="text-sm relative -top-2">Along with country code</div>
          <CoreTextInput
            type={CoreTextInputType.TEL}
            placeholder="Phone"
            value={state.phoneNumber}
            setValue={value => updateField('phoneNumber', value)}
            autoComplete="tel"
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.PHONE_NUMBER,
            })}
          />
        </div>
        <div className="user-input-group">
          <CoreButton
            label="Save Details"
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
        <Snackbar title="Edit Account Details" />
      </MobileView>

      <PageContainer>
        <div className="">
          <DesktopView>
            <BackTitle title="Edit Account Details" />
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
      seo: prepareAccountDetailsEditPageSeo(),
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

export default EditAccountPage
