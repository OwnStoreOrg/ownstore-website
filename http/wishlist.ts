import { IFindParams } from '../contract/common'
import { IUserWishInfo, IUserWishInfoAdd, IUserWishInfoAddParams, IUserWishInfoDelete } from '../contract/userWish'
import { httpClient } from './httpClient'

export const getSessionUserWishlist = async (findParams: IFindParams): Promise<IUserWishInfo[]> => {
  const result = await httpClient.get<IUserWishInfo[]>(`/wish/user/session/info`, findParams)
  return result
}

export const addSessionUserWishInfo = async (params: IUserWishInfoAddParams): Promise<IUserWishInfoAdd> => {
  const result = await httpClient.post<IUserWishInfoAdd>(`/wish/user/session/info`, params)
  return result
}

export const deleteSessionUserWishInfo = async (wishlistId: number): Promise<IUserWishInfoDelete> => {
  const result = await httpClient.delete<IUserWishInfoDelete>(`/wish/user/session/info/${wishlistId}`)
  return result
}
