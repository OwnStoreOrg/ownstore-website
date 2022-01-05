import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getLoginPageUrl } from '../../login'

// http://localhost:3000/login
export const prepareLogInPageSeo = (): IAppSeoProps => {
  return {
    title: 'Login',
    description: 'Login description',
    canonical: `${appConfig.global.baseUrl}${getLoginPageUrl()}`,
    keywords: [],
  }
}
