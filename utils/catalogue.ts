import { ICatalogueMeta } from '../contract/catalogue'

export const getCatalogueIndexPageUrl = () => {
  return '/catalogue'
}

export const getCataloguePageUrl = (catalogueInfo: ICatalogueMeta) => {
  return `/catalogue/${catalogueInfo.slug}/${catalogueInfo.id}`
}
