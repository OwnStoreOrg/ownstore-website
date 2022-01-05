import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IStaticPageDetail } from '../../../contract/staticPage'
import { getTnCPageUrl } from '../../tnc'

// http://localhost:3000/terms-conditions
export const prepareTnCPageSeo = (tnCDetail: IStaticPageDetail): IAppSeoProps => {
  return {
    title: 'Terms and Conditions',
    description: 'Terms and Conditions description',
    canonical: `${appConfig.global.baseUrl}${getTnCPageUrl()}`,
    keywords: ['tnc', 'terms and conditions'],
  }
}
