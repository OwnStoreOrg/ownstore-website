import appConfig from '../../config/appConfig'
import { APP_LOGO } from '../../constants/constants'
import { ProductType } from '../../contract/constants'
import { IComboProductDetail, IIndividualProductDetail } from '../../contract/product'
import { getComboPageUrl, getProductPageUrl } from '../product'

export const prepareOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: appConfig.company.name,
    url: appConfig.global.baseUrl,
    logo: APP_LOGO.DEFAULT,
    address: {
      '@type': 'PostalAddress',
      streetAddress: appConfig.company.address.streetAddress,
      addressLocality: appConfig.company.address.addressLocality,
      addressRegion: appConfig.company.address.addressRegion,
      postalCode: appConfig.company.address.postalCode,
      Telephone: appConfig.company.contactNumber,
    },
    sameAs: appConfig.company.socialLinks
      .filter(socialLink => socialLink.url.startsWith('https://'))
      .map(socialLink => socialLink.url),
  }
}

export const prepareWebsiteStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: appConfig.global.baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${appConfig.global.baseUrl}/search?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export const prepareWebpageStructuredData = ({ title, description, url }) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: appConfig.global.app.name.toUpperCase(),
      url: appConfig.global.baseUrl,
      logo: {
        '@type': 'ImageObject',
        contentUrl: APP_LOGO.DEFAULT,
      },
    },
  }
}

export const prepareBreadcrumbListStructuredData = (
  list: {
    position: number
    name: string
    url: string
  }[]
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      item: {
        '@id': item.url,
        name: item.name,
      },
    })),
  }
}

export const prepareImageObjectStructuredData = (url: string, caption: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: url,
    caption: caption,
    license: appConfig.global.baseUrl,
  }
}

export const prepareFAQStructuredData = (entities: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entities.map(entitiy => ({
      '@type': 'Question',
      name: entitiy.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entitiy.answer,
      },
    })),
  }
}

export const prepareProductStructuredData = (productDetail: IIndividualProductDetail | IComboProductDetail) => {
  const url =
    productDetail.type === ProductType.COMBO ? getComboPageUrl(productDetail) : getProductPageUrl(productDetail)

  let availability = undefined

  if (productDetail.sku.availableQuantity < 1) {
    availability = 'https://schema.org/OutOfStock'
  } else if (productDetail.sku.availableQuantity > 1 && productDetail.sku.availableQuantity <= 20) {
    availability = 'https://schema.org/LimitedAvailability'
  } else if (!productDetail.isActive) {
    availability = 'https://schema.org/Discontinued'
  } else {
    availability = 'https://schema.org/InStock'
  }

  const result: Record<string, any> = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productDetail.name,
    image: productDetail.images.map(image => `${appConfig.global.imageBaseUrl}${image.url}`),
    description: productDetail.description,
    sku: productDetail.sku.name,
    mpn: `${productDetail.slug}-${productDetail.id}`,

    // TODO: Faiyaz
    // review: {
    //   '@type': 'Review',
    //   reviewRating: {
    //     '@type': 'Rating',
    //     ratingValue: '4',
    //     bestRating: '5',
    //   },
    //   author: {
    //     '@type': 'Person',
    //     name: 'Fred Benson',
    //   },
    // },
    // aggregateRating: {
    //   '@type': 'AggregateRating',
    //   ratingValue: '4.4',
    //   reviewCount: '89',
    // },
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: productDetail.sku.currency.isoCode.toUpperCase(),
      price: productDetail.sku.salePrice,
      ...(availability && { availability }),
    },
  }

  if (productDetail.type === ProductType.INDIVIDUAL && productDetail.brand) {
    result.brand = {
      '@type': 'Brand',
      name: productDetail.brand.name,
    }
  }

  return result
}

/**
 * TODO: Faiyaz - Add
 *  - ViewAction: https://github.com/JayHoltslander/Structured-Data-JSON-LD#viewaction
 */
