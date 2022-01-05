import { IInitiatePayment, ISuccessfulPayment, ISuccessfulPaymentParams } from '../contract/payment'
import { httpClient } from './httpClient'

export const createPaymentIntent = async (): Promise<IInitiatePayment> => {
  const result = await httpClient.post<IInitiatePayment>(`/payment/user/session/initiate`)
  return result
}

export const successfulPayment = async (params: ISuccessfulPaymentParams): Promise<ISuccessfulPayment> => {
  const result = await httpClient.post<ISuccessfulPayment>(`/payment/user/session/successful`, params)
  return result
}
