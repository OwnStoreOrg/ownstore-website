import { IApplicationContextProps } from '../components/ApplicationContext'
import { toastError, toastSuccess } from '../components/Toaster'
import { AnalyticsEventType } from '../constants/analytics'
import { INetworkInformationInfo } from '../contract/common'
import { LoginSourceType, LoginType, PlatformType } from '../contract/constants'
import { IUserDetail, IUserEmailLoginInfo, IUserInfo, IUserLoginAttributesInfoParams } from '../contract/user'
import ApiError from '../error/ApiError'
import { emailLoginUser } from '../http/user'
import appAnalytics from '../lib/analytics/appAnalytics'
import { getNetworkConnection, vibrate } from './common'
import { setAuthToken, setAuthUserId } from './user'

export const getLoginPageUrl = () => {
  return '/login'
}

export const getUserLoginAttributes = (
  loginType: LoginType,
  loginSource: LoginSourceType,
  applicationContext: IApplicationContextProps
): IUserLoginAttributesInfoParams => {
  const networkConnection = getNetworkConnection()

  const networkInformation: INetworkInformationInfo | null = {
    effectiveType: null,
    type: null,
  }

  if (networkConnection) {
    networkInformation.effectiveType = networkConnection.effectiveType || null
    networkInformation.type = networkConnection.type || null
  }

  return {
    userAgent: navigator.userAgent,
    ipAddress: null, // This is populated at BE
    dimension: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    loginType: loginType,
    loginSource: loginSource,
    platform: applicationContext.device.platform,
    url: window.location.href,
    networkInformation: networkInformation,
  }
}

export const onLoginSuccess = (token: string, user: IUserDetail, applicationContext: IApplicationContextProps) => {
  const authUserId = `${user.id}`

  vibrate()

  setAuthToken(token)
  setAuthUserId(authUserId)

  applicationContext.updaters.updateAuthAttributes({
    authToken: token,
    authUserId: authUserId,
  })
  applicationContext.updaters.updateUser(user)

  appAnalytics.setUser(user)
}

interface IUserLoginParams {
  email: string
  password: string
  passwordRequired: boolean
  longSession: boolean
  loginSource: LoginSourceType
  applicationContext: IApplicationContextProps
  onSuccess?: (resp: IUserEmailLoginInfo) => void
  onError?: (err: any) => void
  onFinished?: () => void
}

export const userLogin = (params: IUserLoginParams) => {
  emailLoginUser({
    email: params.email,
    password: params.password,
    passwordRequired: params.passwordRequired,
    longSession: params.longSession,
    loginAttributes: getUserLoginAttributes(LoginType.LOGIN, params.loginSource, params.applicationContext),
  })
    .then(resp => {
      if (resp.success) {
        onLoginSuccess(resp.token, resp.user, params.applicationContext)

        toastSuccess(resp.message)

        if (params.onSuccess) {
          params.onSuccess(resp)
        }

        appAnalytics.sendEvent({
          action: AnalyticsEventType.LOGIN,
          extra: {
            method: params.loginSource,
          },
        })
      }
    })
    .catch(err => {
      if (err instanceof ApiError && err.response.code !== 'UNKNOWN') {
        toastError(err.response.message || 'Failed to login')
      } else {
        toastError('Failed to login')
      }
      if (params.onError) {
        params.onError(err)
      }
      params.applicationContext.updaters.updateUser(null)
    })
    .finally(() => {
      if (params.onFinished) {
        params.onFinished()
      }
    })
}
