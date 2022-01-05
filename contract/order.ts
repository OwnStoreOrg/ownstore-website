import { ICartDetail, ICartItem } from './cart'
import { ICurrencyInfo } from './currency'
import { IUserInfo } from './user'
import { IUserAddressInfo } from './address'
import { PaymentMethodType } from './constants'

export interface IOrderStatusHistoryInfo {
  id: number
  status: IOrderStatusInfo
  createdDateTime: Date
}

export interface IOrderStatusInfo {
  id: number
  name: string
  createdDateTime: Date
}

export interface IOrderStatusInfoUpdateParams {
  name: string
}

export interface IOrderStatusInfoUpdate {
  success: boolean
}

export interface IOrderStatusInfoDelete {
  success: boolean
}

export interface IOrderCancellationInfo {
  id: number
  reason: string
  createdDateTime: Date
}

export interface IOrderCartItemMeta {
  id: number
  quantity: number
  productName: string
}

export interface IOrderInfo {
  id: number
  currency: ICurrencyInfo
  totalAmount: number
  cartItemsMeta: IOrderCartItemMeta[]
  orderStatusHistory: IOrderStatusHistoryInfo[]
  userId: number
  updatedDateTime: Date
  createdDateTime: Date
}

export interface IOrderDetail extends IOrderInfo {
  retailAmount: number
  saleAmount: number
  discountAmount: number
  deliveryAmount: number
  extraChargesAmount: number | null
  taxAmount: number | null
  cart: ICartDetail
  user: IUserInfo
  address: IUserAddressInfo
  statusText: string | null
  orderCancellation: IOrderCancellationInfo | null
  paymentMethod: PaymentMethodType
  thirdPartyPaymentId: string
  cancellationReasons: string[]
}

export interface IOrderAddParams {
  addressId: number
  currencyId: number
  retailAmount: number
  saleAmount: number
  discountAmount: number
  deliveryAmount: number
  totalAmount: number
  extraChargesAmount: number | null
  taxAmount: number | null
  cart: ICartDetail
  thirdPartyPaymentId: string
  paymentMethod: PaymentMethodType
}

export interface IUpdateOrderInfoParams {
  statusText: string | null
  orderStatusId: number | null
  cancellationReason: string | null
}

export interface IUpdateOrderInfo {
  success: boolean
}

export interface IRefundOrderDetailParams {
  reason: string
}

export interface IRefundOrderDetail {
  success: boolean
  orderDetail: IOrderDetail | null
}
