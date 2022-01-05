export interface IFAQTopicInfo {
  id: number
  name: string
  slug: string
  position: number
  isActive: boolean
}

export interface IFAQTopicInfoUpdateParams {
  name: string
  position: number
  isActive: boolean
}

export interface IFAQTopicInfoUpdate {
  success: boolean
}

export interface IFAQTopicInfoDelete {
  success: boolean
}

export interface IFAQInfo {
  id: number
  question: string
  answer: string
  position: number
  isActive: boolean
}

export interface IFAQInfoUpdateParams {
  topicId: number
  question: string
  answer: string
  position: number
  isActive: boolean
}

export interface IFAQInfoUpdate {
  success: boolean
}

export interface IFAQInfoDelete {
  success: boolean
}
