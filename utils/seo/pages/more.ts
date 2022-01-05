import { IAppSeoProps } from '../../../components/seo/AppSeo'
import { prepareHomePageSeo } from './home'

// http://localhost:3000/more
export const prepareMorePageSeo = (): IAppSeoProps => {
  return {
    ...prepareHomePageSeo(),
    noIndex: true,
    noFollow: true,
  }
}
