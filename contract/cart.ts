import { ProductType } from './constants'
import { IProductInfo } from './product'

export interface ICartItem {
  id: number
  quantity: number
  createdDateTime: Date
  updatedDateTime: Date
  product: IProductInfo
}

export interface IPriceAndDeliveryChargeMapping {
  [amount: number]: number
}

export interface ICartExtraChargesInfo {
  percent: number | null
  flat: number | null
  decimalPrecision: number | null
}

export interface ICartTaxInfo {
  percent: number | null
  flat: number | null
  decimalPrecision: number | null
}

export interface ICartDetail {
  priceAndDeliveryChargeMapping: IPriceAndDeliveryChargeMapping
  cartItems: ICartItem[]
  extraCharges: ICartExtraChargesInfo
  tax: ICartTaxInfo
}

export interface IUserCartItemAddParams {
  productId: number
  productType: ProductType
  totalQuantity: number
}

export interface IUserCartItemAdd {
  success: boolean
  cartItem: ICartItem | null
}

export interface IUserCartItemDelete {
  success: boolean
}
