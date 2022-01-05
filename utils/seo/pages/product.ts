import { ImageSourceType } from '../../../components/core/CoreImage'
import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IMAGE_VARIANTS } from '../../../constants/constants'
import { IComboProductDetail, IIndividualProductDetail } from '../../../contract/product'
import { prepareImageUrl } from '../../image'
import { getComboPageUrl, getProductPageUrl } from '../../product'
import { prepareProductStructuredData } from '../structuredData'

// http://localhost:3000/product/chicken-keema-mince/1
export const prepareProductPageSeo = (product: IIndividualProductDetail): IAppSeoProps => {
  const imageUrl = product.images[0]?.url
    ? prepareImageUrl(product.images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.WIDE_620)
    : ''

  return {
    title: product.seo.title || `${product.name} product`,
    description: product.seo.description || `${product.name} product description`,
    canonical: `${appConfig.global.baseUrl}${getProductPageUrl(product)}`,
    imageUrl: imageUrl,
    keywords: [...product.seo.keywords],
    structuredData: {
      product: prepareProductStructuredData(product),
    },
  }
}

// http://localhost:3000/combo/chicken-mealbox-combo-chicken-curry-cut-chicken-lollipop-chicken-boneless-cut/1
export const prepareComboPageSeo = (combo: IComboProductDetail): IAppSeoProps => {
  const imageUrl = combo.images[0]?.url
    ? prepareImageUrl(combo.images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.WIDE_620)
    : ''

  return {
    title: combo.seo.title || `${combo.name} combo product`,
    description: combo.seo.description || `${combo.name} combo product description`,
    canonical: `${appConfig.global.baseUrl}${getComboPageUrl(combo)}`,
    imageUrl: imageUrl,
    keywords: [...combo.seo.keywords],
    structuredData: {
      product: prepareProductStructuredData(combo),
    },
  }
}
