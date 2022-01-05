import appConfig from '../config/appConfig'

const key = `${appConfig.global.app.key}-COOKIE-BANNER-SHOWN`

export const isCookieBannerShown = (): boolean => {
  const storageValue = localStorage.getItem(key)
  if (storageValue) {
    if (window.atob(storageValue) === 'true') return true
  }
  return false
}

export const setCookieBannerShown = (value: boolean): void => {
  localStorage.setItem(key, window.btoa(`${value}`))
}
