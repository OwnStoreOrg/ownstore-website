import { PaymentMethodType } from './constants'

export interface IInitiatePayment {
  clientSecret: string | null
}

export interface ISuccessfulPaymentParams {
  thirdPartyPaymentId: string
  addressId: number
  paymentMethod: PaymentMethodType
}

export interface ISuccessfulPayment {
  success: boolean
  orderId: number | null
}
