import { IFindParams } from '../contract/common'
import {
  IUserRegisterationInfo,
  IUserRegisterationParams,
  IUserEmailLoginParams,
  IUserEmailLoginInfo,
  IUserDetail,
  IUserChangePasswordParams,
  IUserChangePasswordInfo,
  IUserGlobalDetail,
  IUserGlobalDetailParams,
  IUserLoginAttributesInfo,
  IUserResetPasswordInfo,
  IUserResetPasswordParams,
  IUserInfoUpdate,
  IUserInfoUpdateParams,
} from '../contract/user'
import { httpClient } from './httpClient'

export const registerUser = async (params: IUserRegisterationParams): Promise<IUserRegisterationInfo> => {
  const result = await httpClient.post<IUserRegisterationInfo>(`/user/register`, params)
  return result
}

export const emailLoginUser = async (params: IUserEmailLoginParams): Promise<IUserEmailLoginInfo> => {
  const result = await httpClient.post<IUserEmailLoginInfo>(`/user/login/email`, params)
  return result
}

export const changeSessionUserPassword = async (
  params: IUserChangePasswordParams
): Promise<IUserChangePasswordInfo> => {
  const result = await httpClient.put<IUserChangePasswordInfo>(`/user/session/change-password`, params)
  return result
}

export const resetUserPassword = async (params: IUserResetPasswordParams): Promise<IUserResetPasswordInfo> => {
  const result = await httpClient.post<IUserResetPasswordInfo>(`/user/reset-password`, params)
  return result
}

export const getSessionUserDetail = async (): Promise<IUserDetail> => {
  const result = await httpClient.get<IUserDetail>(`/user/session/detail`)
  return result
}

export const getSessionUserGlobalDetail = async (params: IUserGlobalDetailParams): Promise<IUserGlobalDetail> => {
  const result = await httpClient.get<IUserGlobalDetail>(`/user/session/detail/global`, params)
  return result
}

export const updateSessionUserInfo = async (params: IUserInfoUpdateParams): Promise<IUserInfoUpdate> => {
  const result = await httpClient.put<IUserInfoUpdate>(`/user/session/info`, params)
  return result
}

export const getSessionUserLoginHistory = async (findParams: IFindParams): Promise<IUserLoginAttributesInfo[]> => {
  const result = await httpClient.get<IUserLoginAttributesInfo[]>(`/user/session/login-history/info`, findParams)
  return result
}
