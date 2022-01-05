import { GetStaticProps, NextPage } from 'next'
import React, { useContext, useEffect, useRef, useState } from 'react'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../components/core/CoreButton'
import CoreTextInput, { CoreTextInputType } from '../components/core/CoreInput'
import CoreLink from '../components/core/CoreLink'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import { MobileView } from '../components/ResponsiveViews'
import { getHomePageUrl } from '../utils/home'
import { getSignupPageUrl } from '../utils/signup'
import { IGlobalLayoutProps } from './_app'
import classnames from 'classnames'
import ApplicationContext from '../components/ApplicationContext'
import { useRouter } from 'next/router'
import useOnEnter from '../hooks/useOnEnter'
import { QUERY_PARAM_MAP, REGEX_MAP } from '../constants/constants'
import appConfig from '../config/appConfig'
import { getPrivacyPageUrl } from '../utils/privacyPolicy'
import { getTnCPageUrl } from '../utils/tnc'
import CoreCheckbox from '../components/core/CoreCheckbox'
import GoogleLoginButton from '../components/login/GoogleLoginButton'
import FacebookLoginButton from '../components/login/FacebookLoginButton'
import { toastError } from '../components/Toaster'
import { LoginSourceType } from '../contract/constants'
import { userLogin } from '../utils/login'
import { prepareLogInPageSeo } from '../utils/seo/pages/login'
import { DynamicAnswerSecurityQuestionsModal } from '../components/dynamicComponents'

interface IHandleLoginParams {
  email: string
  password: string
  passwordRequired: boolean
  longSession: boolean
  loginSource: LoginSourceType
}

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const LoginPage: NextPage<IProps> = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [longSession, toggleLongSession] = useState(false)

  const [loading, toggleLoading] = useState(false)

  const [fieldsWithError, setFieldsWithError] = useState({
    EMAIL: false,
    PASSWORD: false,
  })

  const [showForgotPasswordModal, toggleForgotPasswordModal] = useState(false)

  const formRef = useRef(null)

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  const router = useRouter()
  const backPageUrl = router.query[QUERY_PARAM_MAP.BACK_PAGE_URL] as string | undefined

  const FIELD_VALIDATION_MAPPING = {
    EMAIL: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Email',
      value: email,
      key: 'EMAIL',
    },
    PASSWORD: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid password',
      value: password,
      key: 'PASSWORD',
    },
  }

  const handleLogin = (params: IHandleLoginParams) => {
    toggleLoading(true)

    userLogin({
      email: params.email,
      password: params.password,
      passwordRequired: params.passwordRequired,
      longSession: params.longSession,
      loginSource: params.loginSource,
      applicationContext: applicationContext,
      onFinished: () => {
        toggleLoading(false)
      },
      onSuccess: () => {
        if (backPageUrl) {
          router.push(backPageUrl)
        } else {
          router.push(getHomePageUrl())
        }
      },
    })
  }

  const handleSubmit = () => {
    if (loading || !!user) {
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
      handleLogin({
        email: email,
        password: password,
        passwordRequired: true,
        longSession: longSession,
        loginSource: LoginSourceType.MANUAL,
      })
    }
  }

  const onThirdPartyLogIn = (email: string, loginSource: LoginSourceType): void => {
    handleLogin({
      email: email,
      password: undefined,
      passwordRequired: false,
      longSession: false,
      loginSource: loginSource,
    })
  }

  const onForgotPasswordClick = e => {
    e.preventDefault()
    toggleForgotPasswordModal(true)
  }

  useOnEnter(formRef, handleSubmit)

  return (
    <div>
      <MobileView>
        <Snackbar title="Login" />
      </MobileView>

      <PageContainer>
        <div className="text-center md:text-right pt-6 px-3">
          <span className="">{`Don't have an account? `}</span>
          <CoreLink
            url={getSignupPageUrl()}
            className="text-moodyBlue hover:text-moodyBlue hover:underline font-medium font-primary-medium">
            Create Account
          </CoreLink>
        </div>

        <div className="w-full px-4 md:w-[400px] mx-auto mt-10 md:mt-20">
          <div className="text-primaryTextBold font-medium font-primary-medium text-xl text-center mb-8 md:mb-10">
            Login to sync your data
          </div>

          <div ref={formRef}>
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
                autoFocus
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
                autoComplete="current-password"
                inputClassName={classnames('user-input', {
                  'user-input-error': fieldsWithError.PASSWORD,
                })}
              />
            </div>
            <div className="user-input-group flex items-center justify-between text-sm -mt-2">
              <div>
                <CoreCheckbox
                  id="remember-login"
                  checked={longSession}
                  onChange={val => toggleLongSession(val)}
                  label="Keep me signed in"
                />
              </div>
              {!user ? (
                <CoreLink url={getHomePageUrl()} onClick={onForgotPasswordClick}>
                  Forgot Password?
                </CoreLink>
              ) : null}
            </div>
            <div className="user-input-group">
              <CoreButton
                label={user ? 'Logged In' : 'Login to Continue'}
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
                By logging in, you agree to {appConfig.global.app.name}&apos;s{' '}
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
                  onSuccess={resp => onThirdPartyLogIn(resp.profileObj.email, LoginSourceType.GOOGLE)}
                  onError={() => toastError('Failed to login with Google')}
                  disabled={loading}
                  className="flex-1 mr-2"
                />
                <FacebookLoginButton
                  label="Facebook"
                  onSuccess={resp => onThirdPartyLogIn(resp.email, LoginSourceType.FACEBOOK)}
                  onError={() => toastError('Failed to login with Facebook')}
                  disabled={loading}
                  className="flex-1"
                />
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      {showForgotPasswordModal ? (
        <DynamicAnswerSecurityQuestionsModal dismissModal={() => toggleForgotPasswordModal(false)} />
      ) : null}
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareLogInPageSeo(),
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

export default LoginPage
