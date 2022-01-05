import { ProductType } from './constants'
import { IProductInfo } from './product'

export interface IUserWishInfo {
  id: number
  createdDateTime: Date
  product: IProductInfo
}

export interface IUserWishInfoAddParams {
  productId: number
  productType: ProductType
}

export interface IUserWishInfoAdd {
  success: boolean
  userWish: IUserWishInfo | null
}

export interface IUserWishInfoDelete {
  success: boolean
}
