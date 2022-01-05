import { IComboProductInfo, IIndividualProductInfo, IProductInfo } from '../contract/product'

export const getProductPageUrl = (product: IIndividualProductInfo) => {
  return `/product/${product.slug}/${product.id}`
}

export const getComboPageUrl = (combo: IComboProductInfo) => {
  return `/combo/${combo.slug}/${combo.id}`
}

export const getProductAddLabel = (productInfo: IProductInfo) => {
  const product = productInfo as IIndividualProductInfo | IComboProductInfo
  const {
    sku: { availableQuantity, comingSoon },
  } = product

  let label = 'Add to Cart'
  if (availableQuantity < 1) {
    label = 'Out of Stock'
  } else if (comingSoon) {
    label = 'Coming Soon!'
  }
  return label
}

export const getProductHighlightText = (productInfo: IProductInfo) => {
  const product = productInfo as IIndividualProductInfo | IComboProductInfo

  if (!product.isActive) {
    return 'Removed'
  }
  if (product.sku.availableQuantity < 1) {
    return 'Out Of Stock'
  }
  if (product.sku.comingSoon) {
    return 'Coming soon!'
  }
}

export const shouldDisableProduct = (productInfo: IProductInfo) => {
  const product = productInfo as IIndividualProductInfo | IComboProductInfo
  return !product.isActive || product.sku.availableQuantity < 1 || product.sku.comingSoon
}
