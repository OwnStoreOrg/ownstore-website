import { Dispatch, useEffect, useReducer, useState } from 'react'
import {
  defaultApplicationContext,
  IApplicationContextProps,
  IAuthAttributes,
  IDeviceInfo,
} from '../components/ApplicationContext'
import { ICartDetail } from '../contract/cart'
import { ISettingInfo } from '../contract/setting'
import { ISupportedRegionsInfo } from '../contract/supportedRegions'
import { IUserDetail, IUserGlobalDetail } from '../contract/user'
import { IUserWishInfo } from '../contract/userWish'

export type ApplicationContextAction =
  | {
      type: 'INIT'
      payload: {
        authAttributes: IAuthAttributes | null
      }
    }
  | {
      type: 'UPDATE_DEVICE'
      payload: IDeviceInfo
    }
  | {
      type: 'UPDATE_USER_GLOBAL_DETAIL'
      payload: IUserGlobalDetail
    }
  | {
      type: 'UPDATE_USER'
      payload: IUserDetail
    }
  | {
      type: 'UPDATE_SETTING'
      payload: ISettingInfo
    }
  | {
      type: 'UPDATE_CART'
      payload: ICartDetail
    }
  | {
      type: 'UPDATE_WISHLIST'
      payload: IUserWishInfo[]
    }
  | {
      type: 'UPDATE_USER_GLOBAL_DETAIL_LOADED_STATE'
      payload: boolean
    }
  | {
      type: 'UPDATE_AUTH_ATTRIBUTES'
      payload: IAuthAttributes | null
    }
  | {
      type: 'UPDATE_SUPPORTED_REGIONS'
      payload: ISupportedRegionsInfo | null
    }
  | {
      type: 'RESET_USER'
    }
  | {
      type: 'RESET'
    }

const applicationReducer = (
  state: IApplicationContextProps,
  action: ApplicationContextAction
): IApplicationContextProps => {
  switch (action.type) {
    case 'INIT': {
      const { authAttributes } = action.payload

      return {
        ...state,
        authAttributes,
      }
    }

    case 'UPDATE_DEVICE': {
      return {
        ...state,
        device: action.payload,
      }
    }

    case 'UPDATE_USER_GLOBAL_DETAIL': {
      if (!action.payload) {
        return state
      }
      return {
        ...state,
        user: action.payload.userDetail,
        setting: action.payload.setting,
        cart: action.payload.cartDetail,
        wishlist: action.payload.wishlist,
        userGlobalDetailLoaded: true,
      }
    }

    case 'UPDATE_USER': {
      return {
        ...state,
        user: action.payload,
      }
    }

    case 'UPDATE_SETTING': {
      return {
        ...state,
        setting: action.payload,
      }
    }

    case 'UPDATE_CART': {
      return {
        ...state,
        cart: action.payload,
      }
    }

    case 'UPDATE_WISHLIST': {
      return {
        ...state,
        wishlist: action.payload,
      }
    }

    case 'UPDATE_USER_GLOBAL_DETAIL_LOADED_STATE': {
      return {
        ...state,
        userGlobalDetailLoaded: action.payload,
      }
    }

    case 'UPDATE_AUTH_ATTRIBUTES': {
      return {
        ...state,
        authAttributes: action.payload,
      }
    }

    case 'UPDATE_SUPPORTED_REGIONS': {
      return {
        ...state,
        supportedRegions: action.payload,
      }
    }

    case 'RESET_USER': {
      const { device, supportedRegions } = state
      return {
        ...defaultApplicationContext,
        supportedRegions: supportedRegions,
        device: device,
      }
    }

    case 'RESET': {
      const { device } = state
      return {
        ...defaultApplicationContext,
        device: device,
      }
    }

    default:
      return state
  }
}

const useApplicationContextReducer = (): {
  applicationContext: IApplicationContextProps
  dispatchApplicationContext: Dispatch<ApplicationContextAction>
} => {
  const [applicationContext, dispatchApplicationContext] = useReducer(applicationReducer, defaultApplicationContext)

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContextReducer
