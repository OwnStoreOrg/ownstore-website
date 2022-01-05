import { dynamicSentry, dynamicSentryTracingIntegrations } from '../../components/dynamicModules'
import appConfig from '../../config/appConfig'
import { IUserInfo } from '../../contract/user'
import { getAuthToken, getAuthUserId } from '../../utils/user'
import { ISentryErrorReporting } from './interface'
import { BrowserOptions } from '@sentry/browser'

class SentryErrorReporting implements ISentryErrorReporting {
  sentry = null

  private async _loadSentry(): Promise<any> {
    const sentry = await dynamicSentry()
    this.sentry = sentry
  }

  private async _loadTracingIntegrations(): Promise<any> {
    const integrations = await dynamicSentryTracingIntegrations()
    return integrations
  }

  public async init(): Promise<void> {
    await this._loadSentry()
    const integrations = await this._loadTracingIntegrations()

    const userId = getAuthUserId()

    const config: BrowserOptions = {
      dsn: appConfig.integrations.sentryErrorReporting.dsn,
      tracesSampleRate: 1.0,
      environment: appConfig.env,
      integrations: [new integrations.BrowserTracing()],
      initialScope: {
        user: {
          id: userId,
        },
        extra: {
          authToken: getAuthToken(),
        },
      },
    }

    await this.sentry.init(config)
  }

  public setUser(userInfo: IUserInfo | null): void {
    if (this.sentry) {
      if (userInfo) {
        this.sentry.setUser({
          id: userInfo.id,
          email: userInfo.email,
          ip: '{{auto}}',
        })
      } else {
        this.sentry.configureScope(scope => scope.setUser(null))
      }
    }
  }

  public captureException(error: any, info?: any): void {
    if (this.sentry) {
      this.sentry.captureException(error, info)
    }
  }
}

const sentryErrorReporting = new SentryErrorReporting()
export default sentryErrorReporting
