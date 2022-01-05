import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IStaticPageDetail } from '../../../contract/staticPage'
import { getShippingPolicyPageUrl } from '../../shippingPolicy'

// http://localhost:3000/shipping-policy
export const prepareShippingPolicyPageSeo = (shippingPolicyDetail: IStaticPageDetail): IAppSeoProps => {
  return {
    title: 'Shipping Policy',
    description: 'Shipping Policy description',
    canonical: `${appConfig.global.baseUrl}${getShippingPolicyPageUrl()}`,
    keywords: [],
  }
}
