import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getSignupPageUrl } from '../../signup'

// http://localhost:3000/signup
export const prepareSignUpPageSeo = (): IAppSeoProps => {
  return {
    title: 'Signup',
    description: 'Signup description',
    canonical: `${appConfig.global.baseUrl}${getSignupPageUrl()}`,
    keywords: [],
  }
}
