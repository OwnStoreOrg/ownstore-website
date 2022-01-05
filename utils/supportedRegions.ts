import { ICoreSelectInputOption } from '../components/core/CoreSelectInput'
import appConfig from '../config/appConfig'
import { ISupportedRegionsInfo } from '../contract/supportedRegions'

const key = `${appConfig.global.app.key}-SUPPORTED-REGIONS_MODAL-SHOWN`

export const getSupportedRegionsShown = (): boolean => {
  const storageValue = localStorage.getItem(key)
  if (storageValue) {
    if (window.atob(storageValue) === 'true') return true
  }
  return false
}

export const setSupportedRegionsShown = (value: boolean): void => {
  localStorage.setItem(key, window.btoa(`${value}`))
}

export const hasNoSupportedRegions = (supportedRegions: ISupportedRegionsInfo): boolean => {
  if (!supportedRegions) {
    return false
  }
  if (supportedRegions.countries.length === 0 && supportedRegions.cities.length === 0) {
    return true
  }
  return false
}

export const isCountryRegionSupported = (country: string, supportedRegions: ISupportedRegionsInfo): boolean => {
  return !supportedRegions.countries.some(_country => _country.name.toLowerCase() === country.toLowerCase())
}

export const isCityRegionSupported = (city: string, supportedRegions: ISupportedRegionsInfo): boolean => {
  return !supportedRegions.cities.some(_city => _city.name.toLowerCase() === city.toLowerCase())
}

export const getCountrySelectOptions = (supportedRegions: ISupportedRegionsInfo): ICoreSelectInputOption[] => {
  return supportedRegions.countries.map(country => {
    return {
      id: country.id,
      label: country.name,
      value: country.name,
      selected: false,
    }
  })
}

export const getCitySelectOptions = (supportedRegions: ISupportedRegionsInfo): ICoreSelectInputOption[] => {
  return supportedRegions.cities.map(city => {
    return {
      id: city.id,
      label: city.name,
      value: city.name,
      selected: false,
    }
  })
}
