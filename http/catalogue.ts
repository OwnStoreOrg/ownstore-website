import { httpClient } from './httpClient'
import { ICatalogueInfo } from '../contract/catalogue'
import { IFindParams } from '../contract/common'

export const getCatalogueInfo = async (findParams: IFindParams): Promise<ICatalogueInfo[]> => {
  const result = await httpClient.get<ICatalogueInfo[]>('/catalogue/info', findParams)
  return result
}

export const getCatalogueInfoById = async (catalogueId: number): Promise<ICatalogueInfo> => {
  const result = await httpClient.get<ICatalogueInfo>(`/catalogue/info/${catalogueId}`)
  return result
}
