import { ICatalogueInfo, ICatalogueMeta } from './catalogue'
import { ICurrencyInfo } from './currency'
import { ProductTagIconType, ProductType } from './constants'
import { IImageInfo } from './image'

// sku
export interface IProductSKUInfo {
  id: number
  name: string
  retailPrice: number
  salePrice: number
  onSale: boolean
  currency: ICurrencyInfo
  saleDiscountPercentage: number | null
  saleDiscountFlat: number | null
  availableQuantity: number
  comingSoon: boolean
  createdDateTime: Date
}

export interface IProductSKUInfoUpdateParams {
  id: number | null
  name: string
  retailPrice: number
  salePrice: number
  onSale: boolean
  currencyId: number
  saleDiscountPercentage: number | null
  saleDiscountFlat: number | null
  availableQuantity: number
  comingSoon: boolean
}

// brand
export interface IProductBrandInfo {
  id: number | null
  slug: string
  name: string
  description: string | null
  createdDateTime: Date
}

export interface IProductBrandInfoUpdateParams {
  name: string
  description: string | null
}

export interface IProductBrandInfoUpdate {
  success: boolean
}

export interface IProductBrandInfoDelete {
  success: boolean
}

// attribute key
export interface IProductAttributeKeyInfo {
  id: number
  name: string
}

export interface IProductAttributeKeyInfoUpdateParams {
  name: string
}

export interface IProductAttributeKeyInfoUpdate {
  success: boolean
}

export interface IProductAttributeKeyInfoDelete {
  success: boolean
}

// attribute
export interface IProductAttributeInfo {
  id: number
  key: IProductAttributeKeyInfo | null
  value: string
  position: number
  isActive: boolean
}

export interface IProductAttributeInfoUpdateParams {
  id: number | null
  keyId: number | null
  value: string
  position: number
  isActive: boolean
}

// tag
export interface IProductTagInfo {
  id: number
  iconType: ProductTagIconType
  label: string
  position: number
  isActive: boolean
}

export interface IProductTagInfoUpdateParams {
  id: number | null
  iconType: ProductTagIconType
  label: string
  position: number
  isActive: boolean
}

// feature section
export interface IProductFeatureSectionInfo {
  id: number
  title: string
  body: string
  position: number
  isActive: boolean
}

export interface IProductFeatureSectionInfoUpdateParams {
  id: number | null
  title: string
  body: string
  position: number
  isActive: boolean
}

// relation
export interface IProductsRelationInfo {
  id: number
  name: string
  description: string | null
  products: IProductInfo[]
  productIds: string
}

export interface IProductsRelationInfoUpdateParams {
  name: string
  description: string | null
  productIds: string
}

export interface IProductsRelationInfoUpdate {
  success: boolean
}

export interface IProductsRelationInfoDelete {
  success: boolean
}

// individual product
export interface IProductInfo {
  type: ProductType
}

export interface IIndividualProductInfo extends IProductInfo {
  type: ProductType.INDIVIDUAL
  id: number
  name: string
  shortName: string | null
  slug: string
  position: number
  isActive: boolean
  catalogue: ICatalogueMeta
  sku: IProductSKUInfo
  images: IImageInfo[]
}

export interface IIndividualProductDetail extends IIndividualProductInfo {
  description: string
  seo: {
    title: string | null
    description: string | null
    keywords: string[]
  }
  createdDateTime: Date
  updatedDateTime: Date
  catalogue: ICatalogueInfo
  attributes: IProductAttributeInfo[]
  tags: IProductTagInfo[]
  productsRelation: IProductsRelationInfo | null
  featureSections: IProductFeatureSectionInfo[]
  brand: IProductBrandInfo | null
}

export interface IIndividualProductDetailUpdateParams {
  basic: {
    name: string
    shortName: string | null
    position: number
    isActive: boolean
    description: string
    seo: {
      title: string | null
      description: string | null
      keywords: string[]
    }
    catalogueId: number
    imageIds: string
  } | null
  brandId: number | null
  productsRelationId: number | null
  sku: IProductSKUInfoUpdateParams | null
  tags: IProductTagInfoUpdateParams[] | null
  attributes: IProductAttributeInfoUpdateParams[] | null
  featureSections: IProductFeatureSectionInfoUpdateParams[] | null
}

export interface IIndividualProductDetailUpdate {
  success: boolean
}

export interface IIndividualProductDetailDeleteParams {
  tags: number[] | null
  attributes: number[] | null
  featureSections: number[] | null
}

export interface IIndividualProductDetailDelete {
  success: boolean
}

// combo product
export interface IComboProductInfo extends IProductInfo {
  type: ProductType.COMBO
  id: number
  name: string
  shortName: string | null
  slug: string
  position: number
  isActive: boolean
  sku: IProductSKUInfo
  images: IImageInfo[]
}

export interface IComboProductDetail extends IComboProductInfo {
  description: string
  seo: {
    title: string | null
    description: string | null
    keywords: string[]
  }
  createdDateTime: Date
  updatedDateTime: Date
  attributes: IProductAttributeInfo[]
  products: IIndividualProductInfo[]
  tags: IProductTagInfo[]
  productsRelation: IProductsRelationInfo | null
  featureSections: IProductFeatureSectionInfo[]
}

export interface IComboProductDetailUpdateParams {
  basic: {
    name: string
    shortName: string | null
    position: number
    isActive: boolean
    description: string
    seo: {
      title: string | null
      description: string | null
      keywords: string[]
    }
    imageIds: string
  } | null
  productsRelationId: number | null
  sku: IProductSKUInfoUpdateParams | null
  tags: IProductTagInfoUpdateParams[] | null
  attributes: IProductAttributeInfoUpdateParams[] | null
  featureSections: IProductFeatureSectionInfoUpdateParams[] | null
}

export interface IComboProductDetailUpdate {
  success: boolean
}

export interface IComboProductDetailDeleteParams {
  tags: number[] | null
  attributes: number[] | null
  featureSections: number[] | null
}

export interface IComboProductDetailDelete {
  success: boolean
}
