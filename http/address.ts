import { IUserAddressInfo, IUserAddressInfoUpdate, IUserAddressInfoUpdateParams } from '../contract/address'
import { httpClient } from './httpClient'

export const getSessionUserAddressInfo = async (): Promise<IUserAddressInfo[]> => {
  const result = await httpClient.get<IUserAddressInfo[]>(`/address/user/session/info`)
  return result
}

export const addSessionUserAddressInfo = async (
  params: IUserAddressInfoUpdateParams
): Promise<IUserAddressInfoUpdate> => {
  const result = await httpClient.post<IUserAddressInfoUpdate>(`/address/user/session/info`, params)
  return result
}

export const updateSessionUserAddressInfo = async (
  addressId: number,
  params: IUserAddressInfoUpdateParams
): Promise<IUserAddressInfoUpdate> => {
  const result = await httpClient.put<IUserAddressInfoUpdate>(`/address/user/session/info/${addressId}`, params)
  return result
}
