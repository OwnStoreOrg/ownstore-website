import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IStaticPageDetail } from '../../../contract/staticPage'
import { getPrivacyPageUrl } from '../../privacyPolicy'

// http://localhost:3000/privacy-policy
export const preparePrivacyPolicyPageSeo = (privacyPolicyDetail: IStaticPageDetail): IAppSeoProps => {
  return {
    title: 'Privacy Policy',
    description: 'Privacy Policy description',
    canonical: `${appConfig.global.baseUrl}${getPrivacyPageUrl()}`,
    keywords: [],
  }
}
