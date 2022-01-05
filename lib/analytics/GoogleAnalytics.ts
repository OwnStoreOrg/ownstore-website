import appConfig from '../../config/appConfig'
import { IUserInfo } from '../../contract/user'
import { getAuthUserId } from '../../utils/user'
import { IGA, IGAEventParams, IGAPageViewParams } from './interface'

class GoogleAnalytics implements IGA {
  public async init(): Promise<void> {
    const userId = getAuthUserId()

    if (userId) {
      await ga('config', {
        user_id: userId,
      })
    }
  }

  public pageView(params: IGAPageViewParams): void {
    const options = {
      page_title: params.pageTitle,
      page_location: `${appConfig.global.baseUrl}${params.pagePath}`,
      page_path: params.pagePath,
    }

    ga('event', 'page_view', options)
    ga('set', options)
  }

  public setUser(userInfo: IUserInfo): void {
    ga('set', {
      user_id: userInfo?.id || '',
    })
  }

  public event(params: IGAEventParams): void {
    ga('event', params.action, {
      event_category: params.category || '',
      event_label: params.label || '',
      ...(params.extra || {}),
    })
  }
}

const googleAnalytics = new GoogleAnalytics()
export default googleAnalytics
