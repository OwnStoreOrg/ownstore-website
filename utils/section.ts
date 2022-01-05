import { ISectionInfo } from '../contract/section'

export const getSectionPageUrl = (sectionInfo: ISectionInfo) => {
  return `/section/${sectionInfo.slug}/${sectionInfo.id}`
}
