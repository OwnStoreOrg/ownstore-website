import { ISearchInfo } from '../contract/search'
import { httpClient } from './httpClient'

interface IGetSearchInfoParams {
  limit: number
}

export const getSearchInfo = async (query: string, params: IGetSearchInfoParams): Promise<ISearchInfo> => {
  const result = await httpClient.get<ISearchInfo>(`/search/info/${query}`, params)
  return result
}
