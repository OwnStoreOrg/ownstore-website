import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getHomePageUrl } from '../../home'

// http://localhost:3000/
export const prepareHomePageSeo = (): IAppSeoProps => {
  return {
    title: 'Home',
    description: 'Home',
    canonical: `${appConfig.global.baseUrl}${getHomePageUrl()}`,
    keywords: [''],
  }
}
