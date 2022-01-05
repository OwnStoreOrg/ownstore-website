import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { IAuthAttributes } from '../components/ApplicationContext'
import { toastError } from '../components/Toaster'
import { AnalyticsEventType } from '../constants/analytics'
import { ICartDetail } from '../contract/cart'
import { ISettingInfo } from '../contract/setting'
import { IUserDetail } from '../contract/user'
import { IUserWishInfo } from '../contract/userWish'
import { getSupportedRegionsInfo } from '../http/supportedRegions'
import { getSessionUserGlobalDetail } from '../http/user'
import appAnalytics from '../lib/analytics/appAnalytics'
import { getDeviceInfo } from '../utils/applicationContext'
import { getLoginPageUrl } from '../utils/login'
import { deleteAuthToken, deleteAuthUserId, getAuthToken, getAuthUserId, isLoggedIn } from '../utils/user'
import useApplicationContextReducer from './useApplicationContextReducer'
import useOrientation from './useOrientation'
import useUpdateEffect from './useUpdateEffect'

const useApplicationContext = () => {
  const { applicationContext, dispatchApplicationContext } = useApplicationContextReducer()
  const router = useRouter()

  const updateUser = (userDetail: IUserDetail | null) => {
    dispatchApplicationContext({
      type: 'UPDATE_USER',
      payload: userDetail,
    })
  }

  const updateSetting = (setting: ISettingInfo) => {
    dispatchApplicationContext({
      type: 'UPDATE_SETTING',
      payload: setting,
    })
  }

  const updateCart = (cartDetail: ICartDetail | null) => {
    dispatchApplicationContext({
      type: 'UPDATE_CART',
      payload: cartDetail,
    })
  }

  const updateWishlist = (wishlist: IUserWishInfo[] | null) => {
    dispatchApplicationContext({
      type: 'UPDATE_WISHLIST',
      payload: wishlist,
    })
  }

  const updateAuthAttributes = (authAttributes: IAuthAttributes) => {
    dispatchApplicationContext({
      type: 'UPDATE_AUTH_ATTRIBUTES',
      payload: authAttributes,
    })
  }

  const { isLandscapeMode } = useOrientation()

  useEffect(() => {
    dispatchApplicationContext({
      type: 'UPDATE_DEVICE',
      payload: getDeviceInfo(),
    })
  }, [isLandscapeMode])

  useEffect(() => {
    if (isLoggedIn()) {
      dispatchApplicationContext({
        type: 'INIT',
        payload: {
          authAttributes: {
            authToken: getAuthToken(),
            authUserId: getAuthUserId(),
          },
        },
      })
    }
  }, [])

  useEffect(() => {
    getSupportedRegionsInfo()
      .then(resp => {
        dispatchApplicationContext({
          type: 'UPDATE_SUPPORTED_REGIONS',
          payload: resp,
        })
      })
      .catch(console.error)
  }, [])

  useUpdateEffect(() => {
    const isLoggedIn = applicationContext.authAttributes.authToken && applicationContext.authAttributes.authUserId

    if (isLoggedIn) {
      dispatchApplicationContext({
        type: 'UPDATE_USER_GLOBAL_DETAIL_LOADED_STATE',
        payload: false,
      })

      getSessionUserGlobalDetail({
        wishlist: true,
        cartDetail: true,
      })
        .then(resp => {
          dispatchApplicationContext({
            type: 'UPDATE_USER_GLOBAL_DETAIL',
            payload: resp,
          })
        })
        .catch(e => {
          dispatchApplicationContext({
            type: 'UPDATE_USER_GLOBAL_DETAIL_LOADED_STATE',
            payload: true,
          })
          toastError('Failed to fetch user details')
          console.error(e)
        })
    }
  }, [applicationContext.authAttributes.authToken])

  const logout = () => {
    deleteAuthToken()
    deleteAuthUserId()
    dispatchApplicationContext({
      type: 'RESET_USER',
    })
    appAnalytics.setUser(null)
    appAnalytics.sendEvent({
      action: AnalyticsEventType.LOGOUT,
    })
  }

  applicationContext.logout = logout

  applicationContext.updaters = {
    updateUser: updateUser,
    updateSetting: updateSetting,
    updateCart: updateCart,
    updateWishlist: updateWishlist,
    updateAuthAttributes: updateAuthAttributes,
  }

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContext
