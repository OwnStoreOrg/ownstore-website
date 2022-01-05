import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { ISearchInfo } from '../../../contract/search'
import { getSearchPageUrl } from '../../search'

// http://localhost:3000/search
export const prepareSearchPageSeo = (searchTerm?: string, searchInfo?: ISearchInfo): IAppSeoProps => {
  let title = 'Search'
  let description = 'Search description'

  if (searchTerm) {
    title = `Search results for ${searchTerm}`
    description = `Search results for ${searchTerm}`
  }

  return {
    title: title,
    description: description,
    canonical: `${appConfig.global.baseUrl}${getSearchPageUrl()}`,
    keywords: [],
  }
}
