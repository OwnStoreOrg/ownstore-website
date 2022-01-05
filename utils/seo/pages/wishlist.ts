import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getWishlistPageUrl } from '../../wishlist'

// http://localhost:3000/wishlist
export const prepareWishlistPageSeo = (): IAppSeoProps => {
  return {
    title: 'Wishlist',
    description: 'Wishlist description',
    canonical: `${appConfig.global.baseUrl}${getWishlistPageUrl()}`,
    keywords: [''],
  }
}
