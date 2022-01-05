import debug from 'debug'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef } from 'react'
import appConfig from '../../config/appConfig'
import { QUERY_PARAM_MAP } from '../../constants/constants'
import { GOOGLE_ONE_TAP_LOGIN_SCRIPTS } from '../../constants/scripts'
import { LoginSourceType } from '../../contract/constants'
import ApiError from '../../error/ApiError'
import { getUrlParams } from '../../utils/common'
import { getHomePageUrl } from '../../utils/home'
import { userLogin } from '../../utils/login'
import { loadAndExecuteScript } from '../../utils/script'
import { getSignupPageUrl } from '../../utils/signup'
import ApplicationContext from '../ApplicationContext'
import { dynamiJwtDecode } from '../dynamicModules'
import { toastDismiss, toastSuccess } from '../Toaster'

const logger = debug('google-one-tap-login')

declare let window: any

interface IGoogleOneTapLoginProps {}

const GoogleOneTapLogin: React.FC<IGoogleOneTapLoginProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const {
    user,
    device: { isMobile },
  } = applicationContext

  const router = useRouter()

  const timerRef = useRef(null)

  const injectScripts = async (): Promise<void> => {
    for (const script of GOOGLE_ONE_TAP_LOGIN_SCRIPTS.JS) {
      await loadAndExecuteScript(script.url, script.name)
    }
  }

  const lazyLoadScripts = (): Promise<void> => {
    return new Promise(resolve => {
      if (document.readyState === 'complete') {
        injectScripts().then(resolve)
        return
      }

      window.addEventListener('load', () => {
        injectScripts().then(resolve)
      })
    })
  }

  const onSuccess = (credential: any) => {
    dynamiJwtDecode().then(mod => {
      const decodedCredential = mod<any>(credential)
      userLogin({
        email: decodedCredential.email,
        password: undefined,
        passwordRequired: false,
        longSession: false,
        loginSource: LoginSourceType.GOOGLE_ONE_TAP,
        applicationContext: applicationContext,
        onError: err => {
          if (err instanceof ApiError) {
            if (err.response.code === 'INVALID_CREDENTIALS') {
              toastDismiss()
              toastSuccess('Please set a password to signup')
              router.push(
                `${getSignupPageUrl()}?${QUERY_PARAM_MAP.SIGNUP_NAME}=${decodedCredential.name}&${
                  QUERY_PARAM_MAP.SIGNUP_EMAIL
                }=${decodedCredential.email}&${QUERY_PARAM_MAP.SIGNUP_SOURCE}=got`
              )
            }
          }
        },
        onSuccess: () => {
          // next router doesn't return update routing info. Hence using native location api
          const { pathname, search } = window.location
          const backPageUrl = getUrlParams(search)[QUERY_PARAM_MAP.BACK_PAGE_URL] as string | undefined

          if (pathname === '/login' || pathname === '/signup') {
            if (backPageUrl) {
              router.push(backPageUrl)
            } else {
              router.push(getHomePageUrl())
            }
          }
        },
      })
    })
  }

  const hideLoginFrame = () => {
    const desktopLogin = document.getElementById('credential_picker_container')
    const mobileLogin = document.getElementById('credential_picker_iframe')

    const elements = [desktopLogin, mobileLogin]

    elements.filter(Boolean).forEach(element => {
      element.classList.add('hidden')
    })
  }

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!appConfig.integrations.googleOneTapLogIn.enabled) {
        return () => clearTimer()
      }

      if (user) {
        return () => clearTimer()
      }

      lazyLoadScripts().then(() => {
        if (window.google?.accounts) {
          window.google.accounts.id.initialize({
            client_id: appConfig.integrations.googleOneTapLogIn.code,
            callback: resp => {
              if (resp.credential) {
                onSuccess(resp.credential)
              } else {
                logger('Credential not found', resp)
              }
            },
          })
          window.google.accounts.id.prompt(notification => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              logger('Not displaying', notification)
              return
            }
          })
        }
      })
    }, 5000)

    return () => {
      clearTimer()
    }
  }, [user])

  return null
}

export default GoogleOneTapLogin
