import { httpClient } from './httpClient'
import { ISectionInfo } from '../contract/section'
import { IFindParams } from '../contract/common'
import { PageSectionType } from '../contract/constants'

export interface IGetSectionInfoParams {
  limit?: number
}

export const getSectionInfo = async (params: IGetSectionInfoParams): Promise<ISectionInfo[]> => {
  const result = await httpClient.get<ISectionInfo[]>(`/section/info`, params)
  return result
}

export const getSectionInfoById = async (sectionId: number, findParams: IFindParams): Promise<ISectionInfo> => {
  const result = await httpClient.get<ISectionInfo>(`/section/info/${sectionId}`, findParams)
  return result
}

export const getPageSections = async (pageType: PageSectionType): Promise<ISectionInfo[]> => {
  const result = await httpClient.get<ISectionInfo[]>(`/section/page/${pageType}/info`)
  return result
}
