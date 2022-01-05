import { ImageSourceType } from '../../../components/core/CoreImage'
import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IMAGE_VARIANTS } from '../../../constants/constants'
import { ICatalogueInfo } from '../../../contract/catalogue'
import { getCatalogueIndexPageUrl, getCataloguePageUrl } from '../../catalogue'
import { prepareImageUrl } from '../../image'
import { prepareBreadcrumbListStructuredData } from '../structuredData'

// http://localhost:3000/catalogue
export const prepareCatalogueIndexPageSeo = (): IAppSeoProps => {
  return {
    title: 'Catalogues',
    description: 'Catalogues description',
    canonical: `${appConfig.global.baseUrl}${getCatalogueIndexPageUrl()}`,
    keywords: [],
  }
}

// http://localhost:3000/catalogue/chicken/1
export const prepareCataloguePageSeo = (catalogue: ICatalogueInfo): IAppSeoProps => {
  const breadcrumbList = [
    { position: 1, name: 'Home', url: appConfig.global.baseUrl },
    { position: 2, name: 'Catalogues', url: `${appConfig.global.baseUrl}${getCatalogueIndexPageUrl()}` },
    { position: 3, name: catalogue.name, url: `${appConfig.global.baseUrl}${getCataloguePageUrl(catalogue)}` },
  ]

  return {
    title: `${catalogue.name} catalogue`,
    description: `${catalogue.name} catalogue description`,
    canonical: `${appConfig.global.baseUrl}${getCataloguePageUrl(catalogue)}`,
    imageUrl: catalogue.images[0]?.url
      ? prepareImageUrl(catalogue.images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_300)
      : '',
    keywords: [],
    twitter: {
      card: 'summary',
    },
    structuredData: {
      breadcrumbList: prepareBreadcrumbListStructuredData(breadcrumbList),
    },
  }
}
