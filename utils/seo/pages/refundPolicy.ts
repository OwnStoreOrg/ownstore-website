import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IStaticPageDetail } from '../../../contract/staticPage'
import { getRefundPolicyPageUrl } from '../../refundPolicy'

// http://localhost:3000/refund-policy
export const prepareRefundPolicyPageSeo = (refundPolicyDetail: IStaticPageDetail): IAppSeoProps => {
  return {
    title: 'Refund Policy',
    description: 'Refund Policy description',
    canonical: `${appConfig.global.baseUrl}${getRefundPolicyPageUrl()}`,
    keywords: [],
  }
}
