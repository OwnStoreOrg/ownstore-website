import { GetStaticProps, NextPage } from 'next'
import React, { useContext, useEffect, useRef, useState } from 'react'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../components/core/CoreButton'
import CoreTextInput, { CoreTextInputType } from '../components/core/CoreInput'
import CoreLink from '../components/core/CoreLink'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import { MobileView } from '../components/ResponsiveViews'
import { getLoginPageUrl, getUserLoginAttributes, onLoginSuccess } from '../utils/login'
import { IGlobalLayoutProps } from './_app'
import classnames from 'classnames'
import { registerUser } from '../http/user'
import ApplicationContext from '../components/ApplicationContext'
import { useRouter } from 'next/router'
import { getHomePageUrl } from '../utils/home'
import { setAuthToken, setAuthUserId } from '../utils/user'
import ApiError from '../error/ApiError'
import useOnEnter from '../hooks/useOnEnter'
import { QUERY_PARAM_MAP, REGEX_MAP } from '../constants/constants'
import { getPrivacyPageUrl } from '../utils/privacyPolicy'
import { getTnCPageUrl } from '../utils/tnc'
import appConfig from '../config/appConfig'
import { LoginSourceType, LoginType } from '../contract/constants'
import GoogleLoginButton from '../components/login/GoogleLoginButton'
import FacebookLoginButton from '../components/login/FacebookLoginButton'
import { toastError, toastSuccess } from '../components/Toaster'
import { prepareSignUpPageSeo } from '../utils/seo/pages/signup'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import { getSecurityPageUrl } from '../utils/account'
import Alert from '../components/modal/Alert'
import { vibrate } from '../utils/common'

interface IHandleSignUpParams {
  name: string
  email: string
  password: string
}

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const SignupPage: NextPage<IProps> = props => {
  const router = useRouter()
  const { query } = router

  const applicationContext = useContext(ApplicationContext)
  const { user, userGlobalDetailLoaded } = applicationContext

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginSource, setLoginSource] = useState<LoginSourceType | null>(null)

  const [loading, toggleLoading] = useState(false)

  const [fieldsWithError, setFieldsWithError] = useState({
    NAME: false,
    EMAIL: false,
    PASSWORD: false,
  })

  const [showNoRegisterationsAlert, toggleNoRegisterationsAlert] = useState(false)

  const formRef = useRef(null)

  const signupNameParam = query[QUERY_PARAM_MAP.SIGNUP_NAME]
  const signupEmailParam = query[QUERY_PARAM_MAP.SIGNUP_EMAIL]
  const signupSourceParam = query[QUERY_PARAM_MAP.SIGNUP_SOURCE]

  useEffect(() => {
    if (signupNameParam) {
      setName(signupNameParam as string)
    }
    if (signupEmailParam) {
      setEmail(signupEmailParam as string)
    }
    if (signupSourceParam === 'got') {
      setLoginSource(LoginSourceType.GOOGLE_ONE_TAP)
    }
  }, [signupNameParam, signupEmailParam, signupSourceParam])

  const FIELD_VALIDATION_MAPPING = {
    NAME: {
      regex: REGEX_MAP.NAME,
      error: 'Invalid name (must be between 3-50 letters)',
      value: name,
      key: 'NAME',
    },
    EMAIL: {
      regex: REGEX_MAP.EMAIL,
      error: 'Invalid Email',
      value: email,
      key: 'EMAIL',
    },
    PASSWORD: {
      regex: REGEX_MAP.PASSWORD,
      error: 'Invalid password (must be between 3-30 letters)',
      value: password,
      key: 'PASSWORD',
    },
  }

  const handleSignup = (params: IHandleSignUpParams) => {
    // if (!appConfig.allow.newRegisterations) {
    //   toggleNoRegisterationsAlert(true)
    //   return
    // }

    toggleLoading(true)

    applicationContext.updaters.updateUser(null)

    registerUser({
      name: params.name,
      email: params.email,
      password: params.password,
      loginAttributes: getUserLoginAttributes(
        LoginType.SIGNUP,
        loginSource || LoginSourceType.MANUAL,
        applicationContext
      ),
    })
      .then(resp => {
        if (resp.success) {
          onLoginSuccess(resp.token, resp.user, applicationContext)
          toastSuccess(resp.message)

          appAnalytics.sendEvent({
            action: AnalyticsEventType.SIGNUP,
            extra: {
              method: 'manual',
            },
          })

          vibrate()

          router.push(getSecurityPageUrl())
        }
      })
      .catch(err => {
        if (err instanceof ApiError && err.response.code !== 'UNKNOWN') {
          if ((err as ApiError).response.code === 'REGISTERATIONS_DISABLED') {
            toggleNoRegisterationsAlert(true)
          } else {
            toastError(err.response.message || 'Failed to register your account')
          }
        } else {
          toastError('Failed to register your account')
        }
        applicationContext.updaters.updateUser(null)
      })
      .finally(() => toggleLoading(false))
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
    } else {
      handleSignup({
        name: name,
        email: email,
        password: password,
      })
    }
  }

  const onThirdPartySignIn = (name: string, email: string, thirdPatyLoginSource: LoginSourceType): void => {
    setName(name)
    setEmail(email)
    setPassword('')
    setLoginSource(thirdPatyLoginSource)
    setFieldsWithError({
      ...fieldsWithError,
      PASSWORD: true,
    })
    toastSuccess('Please set a password to signup')
  }

  useOnEnter(formRef, handleSubmit)

  return (
    <div>
      <MobileView>
        <Snackbar title="Signup" />
      </MobileView>

      <PageContainer>
        <div className="text-center md:text-right pt-6 px-3">
          <span className="">{`Already have an account? `}</span>
          <CoreLink
            url={getLoginPageUrl()}
            className="text-moodyBlue hover:text-moodyBlue hover:underline font-medium font-primary-medium">
            Login
          </CoreLink>
        </div>

        <div className="w-full px-4 md:w-[400px] mx-auto mt-10 md:mt-20">
          <div className="text-primaryTextBold font-medium font-primary-medium text-xl text-center mb-8 md:mb-10">
            Register to sync your data across devices!
          </div>

          <div ref={formRef}>
            <div className="user-input-group">
              <div className="user-input-label">Name</div>
              <CoreTextInput
                type={CoreTextInputType.TEXT}
                placeholder="Name"
                value={name}
                setValue={setName}
                autoComplete="name"
                showClearIcon
                onClearClick={() => setName('')}
                autoFocus
                inputClassName={classnames('user-input', {
                  'user-input-error': fieldsWithError.NAME,
                })}
              />
            </div>
            <div className="user-input-group">
              <div className="user-input-label">Email Address</div>
              <CoreTextInput
                type={CoreTextInputType.TEXT}
                placeholder="Email"
                value={email}
                setValue={setEmail}
                autoComplete="email"
                showClearIcon
                onClearClick={() => setEmail('')}
                inputClassName={classnames('user-input', {
                  'user-input-error': fieldsWithError.EMAIL,
                })}
              />
            </div>
            <div className="user-input-group">
              <div className="user-input-label">Password</div>
              <CoreTextInput
                type={CoreTextInputType.PASSWORD}
                placeholder="Password"
                value={password}
                setValue={setPassword}
                autoComplete="new-password"
                inputClassName={classnames('user-input', {
                  'user-input-error': fieldsWithError.PASSWORD,
                })}
              />
            </div>
            <div className="user-input-group">
              <CoreButton
                label={user ? 'Logged In' : 'Signup to Continue'}
                size={CoreButtonSize.LARGE}
                type={CoreButtonType.SOLID_PRIMARY}
                className="w-full"
                onClick={() => handleSubmit()}
                loading={loading}
                disabled={!!user}
              />
            </div>

            <div className="user-input-group">
              <span className="text-sm">
                By creating an account, you agree to {appConfig.global.app.name}&apos;s{' '}
                <CoreLink url={getPrivacyPageUrl()} className="underline">
                  Privacy Policy
                </CoreLink>{' '}
                and{' '}
                <CoreLink url={getTnCPageUrl()} className="underline">
                  Terms of Use
                </CoreLink>{' '}
              </span>
            </div>

            {user ? null : (
              <div className="user-input-group flex justify-between">
                <GoogleLoginButton
                  label="Google"
                  onSuccess={resp =>
                    onThirdPartySignIn(resp.profileObj.name, resp.profileObj.email, LoginSourceType.GOOGLE)
                  }
                  disabled={loading}
                  className="flex-1 mr-2"
                />
                <FacebookLoginButton
                  label="Facebook"
                  onSuccess={resp => onThirdPartySignIn(resp.name, resp.email, LoginSourceType.FACEBOOK)}
                  disabled={loading}
                  className="flex-1"
                />
              </div>
            )}
          </div>
        </div>

        {showNoRegisterationsAlert ? (
          <Alert
            title="Registerations not allowed"
            subTitle="We're no longer accepting new users. Please contact us for any queries. Sorry for the inconvenience."
            cta={{
              primary: {
                show: true,
                label: 'Okay',
                onClick: () => {
                  toggleNoRegisterationsAlert(false)
                },
              },
              secondary: {
                show: false,
              },
            }}
            dismissModal={() => toggleNoRegisterationsAlert(false)}
          />
        ) : null}
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareSignUpPageSeo(),
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

export default SignupPage
