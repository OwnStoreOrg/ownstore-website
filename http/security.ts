import {
  IUserUpdateSecurityPasswordHintInfoParams,
  IUserUpdateSecurityPasswordHintInfo,
  IUserSecurityQuestionsDetail,
  IUserUpdateSecurityQuestionAnswerParams,
  IUserUpdateSecurityQuestionAnswer,
  IUserVerifySecurityQuestionAnswerParams,
  IUserVerifySecurityQuestionAnswer,
  ISecurityQuestionInfo,
} from '../contract/security'
import { httpClient } from './httpClient'

export const updateSessionUserPasswordHintInfo = async (
  params: IUserUpdateSecurityPasswordHintInfoParams
): Promise<IUserUpdateSecurityPasswordHintInfo> => {
  const result = await httpClient.post<IUserUpdateSecurityPasswordHintInfo>(
    `/security/user/session/password-hint/info`,
    params
  )
  return result
}

export const getSessionSecurityQuestionsDetail = async (): Promise<IUserSecurityQuestionsDetail> => {
  const result = await httpClient.get<IUserSecurityQuestionsDetail>(`/security/user/session/security-questions/detail`)
  return result
}

export const getAllSecurityQuestions = async (): Promise<ISecurityQuestionInfo[]> => {
  const result = await httpClient.get<ISecurityQuestionInfo[]>(`/security/security-question/info`)
  return result
}

export const updateUserSecurityQuestionAnswers = async (
  params: IUserUpdateSecurityQuestionAnswerParams
): Promise<IUserUpdateSecurityQuestionAnswer> => {
  const result = await httpClient.post<IUserUpdateSecurityQuestionAnswer>(
    `/security/user/session/security-questions/info`,
    params
  )
  return result
}

export const verifyUserSecurityQuestionAnswers = async (
  params: IUserVerifySecurityQuestionAnswerParams
): Promise<IUserVerifySecurityQuestionAnswer> => {
  const result = await httpClient.post<IUserVerifySecurityQuestionAnswer>(`/security/security-questions/verify`, params)
  return result
}
