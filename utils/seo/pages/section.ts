import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { ISectionInfo } from '../../../contract/section'
import { toPascalCase } from '../../common'
import { getSectionPageUrl } from '../../section'

// http://localhost:3000/section/deals-of-the-day/1
export const prepareSectionPageSeo = (sectionInfo: ISectionInfo): IAppSeoProps => {
  const sectionTitle = toPascalCase(sectionInfo.name)

  return {
    title: `${sectionTitle} Section`,
    description: `${sectionTitle} Section Description`,
    canonical: `${appConfig.global.baseUrl}${getSectionPageUrl(sectionInfo)}`,
    keywords: ['section', sectionTitle],
  }
}
