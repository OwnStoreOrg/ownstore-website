export interface ICurrencyInfo {
  id: number
  name: string
  isoCode: string
  symbol: string
}

export interface ICurrencyInfoUpdateParams {
  name: string
  isoCode: string
  symbol: string
}

export interface ICurrencyInfoUpdate {
  success: boolean
}

export interface ICurrencyInfoDelete {
  success: boolean
}
