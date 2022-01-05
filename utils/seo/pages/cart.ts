import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getCartPageUrl } from '../../cart'

// http://localhost:3000/cart
export const prepareCartPageSeo = (): IAppSeoProps => {
  return {
    title: 'Cart',
    description: 'Cart description',
    canonical: `${appConfig.global.baseUrl}${getCartPageUrl()}`,
    keywords: [],
  }
}
