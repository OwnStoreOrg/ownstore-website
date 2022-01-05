import { UserAddressType } from './constants'

export interface IUserAddressInfo {
  id: number
  name: string
  phoneNumber: string
  addressLine: string
  area: string
  areaCode: number | null
  city: string
  country: string
  isPrimary: boolean
  isActive: boolean
  addressType: UserAddressType
}

export interface IUserAddressInfoUpdateParams {
  name: string
  phoneNumber: string
  addressLine: string
  area: string
  areaCode: number | null
  city: string
  country: string
  isPrimary: boolean
  isActive: boolean
  addressType: UserAddressType
}

export interface IUserAddressInfoUpdate {
  userAddress: IUserAddressInfo | null
  success: boolean
}
