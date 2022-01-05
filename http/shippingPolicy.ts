import { IStaticPageDetail } from '../contract/staticPage'
import { httpClient } from './httpClient'

export const getShippingPolicyDetail = async (): Promise<IStaticPageDetail> => {
  const result = await httpClient.get<IStaticPageDetail>('/shipping-policy/detail')
  return result
}
