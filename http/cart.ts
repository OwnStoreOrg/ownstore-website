import { ICartDetail, IUserCartItemAdd, IUserCartItemAddParams, IUserCartItemDelete } from '../contract/cart'
import { httpClient } from './httpClient'

export const getCartDetail = async (): Promise<ICartDetail> => {
  const result = await httpClient.get<ICartDetail>(`/cart/user/session/detail`)
  return result
}

export const addCartItemInfo = async (params: IUserCartItemAddParams): Promise<IUserCartItemAdd> => {
  const result = await httpClient.post<IUserCartItemAdd>(`/cart/user/session/info`, params)
  return result
}

export const deleteCartItemInfo = async (cartId: number): Promise<IUserCartItemDelete> => {
  const result = await httpClient.delete<IUserCartItemDelete>(`/cart/user/session/info/${cartId}`)
  return result
}
