import { IFAQInfo, IFAQTopicInfo } from '../contract/faq'
import { httpClient } from './httpClient'

export interface IGetFAQTopicInfoParams {
  limit?: number
  offset?: number
}

export const getFAQTopics = async (params: IGetFAQTopicInfoParams): Promise<IFAQTopicInfo[]> => {
  const result = await httpClient.get<IFAQTopicInfo[]>(`/faq/topic/info`, params)
  return result
}

export const getFAQTopic = async (faqTopicId: number): Promise<IFAQTopicInfo> => {
  const result = await httpClient.get<IFAQTopicInfo>(`/faq/topic/info/${faqTopicId}`)
  return result
}

export const getFAQsByTopicId = async (faqTopicId: number): Promise<IFAQInfo[]> => {
  const result = await httpClient.get<IFAQInfo[]>(`/faq/topic/${faqTopicId}/info`)
  return result
}
