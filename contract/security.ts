export interface IUserSecurityPasswordHintInfo {
  hint: string | null
}

export interface IUserUpdateSecurityPasswordHintInfoParams {
  password: string
  hint: string
}

export interface IUserUpdateSecurityPasswordHintInfo {
  success: boolean
  message: string | null
}

export interface ISecurityQuestionInfo {
  id: number
  question: string
}

export interface IISecurityQuestionInfoUpdateParams {
  question: string
}

export interface IISecurityQuestionInfoUpdate {
  success: boolean
}

export interface IISecurityQuestionInfoDelete {
  success: boolean
}

export interface ISecurityAnswerInfo {
  questionId: number
  answer: string
}

export interface IUserSecurityQuestionAnswer {
  id: number
  question: ISecurityQuestionInfo
}

export interface IUserSecurityQuestionsDetail {
  allQuestions: ISecurityQuestionInfo[]
  answeredQuestions: IUserSecurityQuestionAnswer[]
}

export interface IUserUpdateSecurityQuestionAnswerParams {
  password: string
  securityAnswers: ISecurityAnswerInfo[]
}

export interface IUserUpdateSecurityQuestionAnswer {
  success: boolean
  message: string | null
}

export interface IUserVerifySecurityQuestionAnswerParams {
  email: string
  securityAnswers: ISecurityAnswerInfo[]
}

export interface IUserVerifySecurityQuestionAnswer {
  success: boolean
}
