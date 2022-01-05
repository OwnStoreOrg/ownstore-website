import { ISupportedRegionsInfo } from '../contract/supportedRegions'
import { httpClient } from './httpClient'

export const getSupportedRegionsInfo = async (): Promise<ISupportedRegionsInfo> => {
  const result = await httpClient.get<ISupportedRegionsInfo>('/supported-region/info')
  return result
}
