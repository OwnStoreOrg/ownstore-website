import { IDeviceInfo, DEVICE_PROFILE } from '../components/ApplicationContext'
import { SCREEN_SIZE } from '../constants/constants'
import { PlatformType } from '../contract/constants'
import { matchMinMaxMediaQuery } from './common'
import { isPwa, isTouchDevice } from './deviceDetect'

export const getDeviceInfo = (): IDeviceInfo => {
  const isMobile = window.matchMedia(`(max-width: ${SCREEN_SIZE.LG - 1}px)`).matches
  const isDesktop = window.matchMedia(`(min-width: ${SCREEN_SIZE.LG}px)`).matches

  const landscapeMode = window.matchMedia('(orientation: landscape)').matches && isMobile

  let profile: DEVICE_PROFILE = null

  if (matchMinMaxMediaQuery(0, SCREEN_SIZE.SM - 1)) {
    profile = 'SM'
  } else if (matchMinMaxMediaQuery(SCREEN_SIZE.SM, SCREEN_SIZE.MD - 1)) {
    profile = 'MD'
  } else if (matchMinMaxMediaQuery(SCREEN_SIZE.MD, SCREEN_SIZE.LG - 1)) {
    profile = 'LG'
  } else if (matchMinMaxMediaQuery(SCREEN_SIZE.LG, SCREEN_SIZE.XL - 1)) {
    profile = 'XL'
  } else if (matchMinMaxMediaQuery(SCREEN_SIZE.XL, SCREEN_SIZE['2XL'] - 1)) {
    profile = '2XL'
  }

  const platform: PlatformType = PlatformType.WEB

  return {
    isDesktop: isDesktop,
    isMobile: isMobile,

    platform: platform,
    isApp: false,

    isPwa: isPwa(),

    isTouchDevice: isTouchDevice(),
    isLandscapeMode: landscapeMode,

    profile: profile,

    isSm: profile === 'SM',
    isMd: profile === 'MD',
    isLg: profile === 'LG',
    isXl: profile === 'XL',
    is2Xl: profile === '2XL',
  }
}
