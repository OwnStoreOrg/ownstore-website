import { IFindParams } from '../contract/common'
import { IOrderDetail, IOrderInfo, IRefundOrderDetail, IRefundOrderDetailParams } from '../contract/order'
import { httpClient } from './httpClient'

export const getSessionUserOrderInfos = async (findParams: IFindParams): Promise<IOrderInfo[]> => {
  const result = await httpClient.get<IOrderInfo[]>(`/order/user/session/info`, findParams)
  return result
}

export const refundSessionUserOrderDetail = async (
  orderId: number,
  params: IRefundOrderDetailParams
): Promise<IRefundOrderDetail> => {
  const result = await httpClient.post<IRefundOrderDetail>(`/order/user/session/detail/${orderId}/refund`, params)
  return result
}

export const getSessionUserOrderDetail = async (orderId: number): Promise<IOrderDetail> => {
  const result = await httpClient.get<IOrderDetail>(`/order/user/session/detail/${orderId}`)
  return result
}
