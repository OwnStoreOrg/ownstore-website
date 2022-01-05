import appConfig from '../../config/appConfig'
import { AnalyticsEventType } from '../../constants/analytics'
import { IUserInfo } from '../../contract/user'
import googleAnalytics from './GoogleAnalytics'
import { IAnalyticsEventParams, IAnalyticsPageViewParams } from './interface'
import sentryErrorReporting from './SentryErrorReporting'

const init = async (): Promise<void> => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    await googleAnalytics.init()
  }
  if (appConfig.integrations.sentryErrorReporting.enabled) {
    await sentryErrorReporting.init()
  }
}

const sendPageView = (params: IAnalyticsPageViewParams) => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    googleAnalytics.pageView(params)
  }
}

const setUser = (user: IUserInfo | null) => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    googleAnalytics.setUser(user)
  }
  if (appConfig.integrations.sentryErrorReporting.enabled) {
    sentryErrorReporting.setUser(user)
  }
}

const sendEvent = (params: IAnalyticsEventParams) => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    googleAnalytics.event(params)
  }
}

const captureException = (error: any, info?: any) => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    googleAnalytics.event({
      action: AnalyticsEventType.EXCEPTION,
      extra: {
        description: error,
      },
    })
  }
  if (appConfig.integrations.sentryErrorReporting.enabled) {
    sentryErrorReporting.captureException(error, info)
  }
}

const appAnalytics = {
  init: init,
  sendPageView: sendPageView,
  setUser: setUser,
  sendEvent: sendEvent,
  captureException: captureException,
}

export default appAnalytics
