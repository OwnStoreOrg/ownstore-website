import { IStaticPageDetail } from '../contract/staticPage'
import { httpClient } from './httpClient'

export const getRefundPolicyDetail = async (): Promise<IStaticPageDetail> => {
  const result = await httpClient.get<IStaticPageDetail>('/refund-policy/detail')
  return result
}
