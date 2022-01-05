import { IUserAddressInfo } from './address'
import { ICartDetail } from './cart'
import { INetworkInformationInfo } from './common'
import { LoginSourceType, LoginType, PlatformType, UserAddressType } from './constants'
import { IOrderInfo } from './order'
import { ISecurityAnswerInfo } from './security'
import { ISettingInfo } from './setting'
import { IUserWishInfo } from './userWish'

export interface IUserInfo {
  id: number
  name: string
  email: string | null
  phoneNumber: string | null
  joinedDateTime: Date
  isActive: boolean
}

export interface IUserDetail extends IUserInfo {
  addresses: IUserAddressInfo[]
}

export interface IUserGlobalDetailParams {
  wishlist?: boolean
  cartDetail?: boolean
  orders?: boolean
}

export interface IUserGlobalDetail {
  userDetail: IUserDetail
  setting: ISettingInfo
  wishlist: IUserWishInfo[] | null
  cartDetail: ICartDetail | null
  orders: IOrderInfo[] | null
}

export interface IUserLoginAttributesInfoParams {
  userAgent: string
  dimension: {
    width: number
    height: number
  }
  ipAddress: string | null
  loginType: LoginType
  loginSource: LoginSourceType
  platform: PlatformType
  url: string
  networkInformation: INetworkInformationInfo | null
  // TODO: Faiyaz - add osVersion, buildNumber
}

export interface IUserLoginAttributesInfo {
  id: number
  userId: number
  userAgent: string
  ipAddress: string | null
  dimension: {
    width: number
    height: number
  }
  loginSource: LoginSourceType
  loginType: LoginType
  platform: PlatformType
  sessionExpiry: Date
  loginAt: Date
}

export interface IUserRegisterationParams {
  name: string
  email: string
  password: string
  loginAttributes: IUserLoginAttributesInfoParams
}

export interface IUserRegisterationInfo {
  success: boolean
  message: string | null
  token: string | null
  user: IUserDetail | null
}

export interface IUserEmailLoginParams {
  email: string
  password: string
  passwordRequired: boolean
  longSession: boolean
  loginAttributes: IUserLoginAttributesInfoParams
}

export interface IUserEmailLoginInfo {
  success: boolean
  message: string | null
  token: string | null
  user: IUserDetail | null
}

export interface IUserChangePasswordParams {
  password: string
  newPassword: string
}

export interface IUserChangePasswordInfo {
  success: boolean
  message: string | null
}

export interface IUserResetPasswordParams {
  email: string
  password: string
  loginAttributes: IUserLoginAttributesInfoParams
  securityAnswers: ISecurityAnswerInfo[]
}

export interface IUserResetPasswordInfo {
  success: boolean
  message: string | null
  token: string | null
  user: IUserDetail | null
}

export interface IUserInfoUpdateParams {
  name: string
  email: string
  phoneNumber: string | null
  isActive: boolean | null
}

export interface IUserInfoUpdate {
  success: boolean
}
