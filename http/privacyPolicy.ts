import { IStaticPageDetail } from '../contract/staticPage'
import { httpClient } from './httpClient'

export const getPrivacyPolicyDetail = async (): Promise<IStaticPageDetail> => {
  const result = await httpClient.get<IStaticPageDetail>('/privacy-policy/detail')
  return result
}
