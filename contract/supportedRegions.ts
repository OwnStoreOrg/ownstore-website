export interface ISupportedCountryInfo {
  id: number
  name: string
  shortName: string
  flagUrl: string | null
}

export interface ISupportedCityInfo {
  id: number
  name: string
  shortName: string
  flagUrl: string | null
}

export type ISupportedRegionInfo = ISupportedCountryInfo | ISupportedCityInfo

export interface ISupportedRegionsInfo {
  cities: ISupportedCityInfo[]
  countries: ISupportedCountryInfo[]
}

export interface ISupportedRegionInfoUpdateParams {
  name: string
  shortName: string
  flagUrl: string | null
}

export interface ISupportedRegionInfoUpdate {
  success: boolean
}

export interface ISupportedRegionInfoDelete {
  success: boolean
}
