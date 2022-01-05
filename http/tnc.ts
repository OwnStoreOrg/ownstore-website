import { IStaticPageDetail } from '../contract/staticPage'
import { httpClient } from './httpClient'

export const getTnCDetail = async (): Promise<IStaticPageDetail> => {
  const result = await httpClient.get<IStaticPageDetail>('/tnc/detail')
  return result
}
