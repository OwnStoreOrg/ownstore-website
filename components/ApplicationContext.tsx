import React from 'react'
import { SCREEN_SIZE } from '../constants/constants'
import { ICartDetail } from '../contract/cart'
import { PlatformType } from '../contract/constants'
import { ISettingInfo } from '../contract/setting'
import { ISupportedRegionsInfo } from '../contract/supportedRegions'
import { IUserDetail } from '../contract/user'
import { IUserWishInfo } from '../contract/userWish'

export type DEVICE_PROFILE = keyof typeof SCREEN_SIZE

export interface IDeviceInfo {
  isDesktop: boolean
  isMobile: boolean

  platform: PlatformType

  isApp: boolean
  isPwa: boolean

  isTouchDevice: boolean
  isLandscapeMode: boolean

  profile: DEVICE_PROFILE

  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  is2Xl: boolean
}

export interface IAuthAttributes {
  authToken: string | null
  authUserId: string | null
}

export interface IApplicationContextProps {
  device: IDeviceInfo
  user: IUserDetail | null
  setting: ISettingInfo
  cart: ICartDetail | null
  wishlist: IUserWishInfo[] | null
  userGlobalDetailLoaded: boolean
  authAttributes: IAuthAttributes
  supportedRegions: ISupportedRegionsInfo | null

  updaters: {
    updateUser: (userDetail: IUserDetail | null) => void
    updateSetting: (setting: ISettingInfo) => void
    updateCart: (cartDetail: ICartDetail | null) => void
    updateWishlist: (wishlist: IUserWishInfo[] | null) => void
    updateAuthAttributes: (authAttributes: IAuthAttributes) => void
  }

  logout: () => void
}

export const defaultApplicationContext: IApplicationContextProps = {
  device: {
    isDesktop: true,
    isMobile: true,

    platform: PlatformType.WEB,

    isApp: false,
    isPwa: false,

    isTouchDevice: false,
    isLandscapeMode: false,

    profile: 'XL',

    isSm: true,
    isMd: false,
    isLg: false,
    isXl: false,
    is2Xl: false,
  },
  user: null,
  setting: {
    securityQuestionsSet: false,
    allow: {
      newRegisterations: true,
      newOrders: true,
    },
  },
  cart: null,
  wishlist: null,
  userGlobalDetailLoaded: true,
  supportedRegions: null,

  authAttributes: {
    authToken: null,
    authUserId: null,
  },

  // updaters
  updaters: {
    updateUser: (userDetail: IUserDetail | null) => userDetail,
    updateSetting: (setting: ISettingInfo) => setting,
    updateCart: (cartDetail: ICartDetail | null) => cartDetail,
    updateWishlist: (wishlist: IUserWishInfo[] | null) => wishlist,
    updateAuthAttributes: (authAttributes: IAuthAttributes) => authAttributes,
  },

  logout: () => null,
}

const ApplicationContext = React.createContext<IApplicationContextProps>(defaultApplicationContext)

export default ApplicationContext
