import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getExplorePageUrl } from '../../explore'

// http://localhost:3000/explore
export const prepareExplorePageSeo = (): IAppSeoProps => {
  return {
    title: 'Explore',
    description: 'Explore description',
    canonical: `${appConfig.global.baseUrl}${getExplorePageUrl()}`,
    keywords: [],
  }
}
