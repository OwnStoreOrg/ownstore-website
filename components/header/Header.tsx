import React, { useContext, useEffect, useRef } from 'react'
import ApplicationContext from '../ApplicationContext'
import MobileNavbar from './MobileNavbar'
import CoreImage from '../core/CoreImage'
import CoreActiveLink from '../core/CoreActiveLink'
import {
  MenuIcon as MenuIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UserIcon as UserIconSolid,
  HeartIcon as HeartIconSolid,
  SearchIcon as SearchIconSolid,
  PlusIcon as PlusIconSolid,
} from '@heroicons/react/solid'
import {
  MenuIcon as MenuIconOutline,
  ShoppingCartIcon as ShoppingCartIconOutline,
  UserIcon as UserIconOutline,
  HeartIcon as HeartIconOutline,
  SearchIcon as SearchIconOutline,
  PlusIcon as PlusIconOutline,
} from '@heroicons/react/outline'
import HeaderSearch from './HeaderSearch'
import HeaderUserAddress from './HeaderUserAddress'
import CoreLink from '../core/CoreLink'
import { getHomePageUrl } from '../../utils/home'
import { getWishlistPageUrl } from '../../utils/wishlist'
import { getSearchPageUrl } from '../../utils/search'
import { getMorePageUrl } from '../../utils/more'
import { getAccountDetailsPageUrl } from '../../utils/account'
import { getCartPageUrl, getProductsQuantityCount } from '../../utils/cart'
import { formatHeaderCount } from '../../utils/common'
import usePWAInstall from '../../hooks/usePWAInstall'
import classnames from 'classnames'
import { APP_LOGO } from '../../constants/constants'
import HeaderLinks, { IHeaderLink } from './HeaderLinks'
import { DesktopView, MobileView } from '../ResponsiveViews'

interface INavbarProps {
  topNavVisibility: boolean
}

const Navbar: React.FC<INavbarProps> = props => {
  const { topNavVisibility } = props

  const applicationContext = useContext(ApplicationContext)
  const { cart, wishlist } = applicationContext

  const { showPWAInstall, showPWAInstallPrompt } = usePWAInstall()

  const pwaInstallLink: IHeaderLink = {
    label: 'Install',
    url: null,
    iconComponent: PlusIconOutline,
    activeIconComponent: PlusIconSolid,
    iconClassName: 'animation-shakeX w-[28px]',
    count: null,
    onClick: e => {
      e.preventDefault()
      showPWAInstallPrompt()
    },
  }

  const DESKTOP_NAV_LINKS: IHeaderLink[] = [
    {
      label: 'Account',
      url: getAccountDetailsPageUrl(),
      iconComponent: UserIconOutline,
      activeIconComponent: UserIconSolid,
      iconClassName: null,
      count: null,
      onClick: null,
    },
    {
      label: 'Wishlist',
      url: getWishlistPageUrl(),
      iconComponent: HeartIconOutline,
      activeIconComponent: HeartIconSolid,
      iconClassName: null,
      count: wishlist ? formatHeaderCount(wishlist.length) : null,
      onClick: null,
    },
    {
      label: 'Cart',
      url: getCartPageUrl(),
      iconComponent: ShoppingCartIconOutline,
      activeIconComponent: ShoppingCartIconSolid,
      iconClassName: null,
      count: cart ? formatHeaderCount(getProductsQuantityCount(cart.cartItems)) : null,
      onClick: null,
    },
    {
      label: 'Other Links',
      url: getMorePageUrl(),
      iconComponent: MenuIconOutline,
      activeIconComponent: MenuIconSolid,
      iconClassName: null,
      count: null,
      onClick: null,
    },
  ]

  const MOBILE_NAV_LINKS = [
    {
      label: 'Search',
      url: getSearchPageUrl(),
      iconComponent: SearchIconOutline,
      activeIconComponent: SearchIconSolid,
      iconClassName: null,
      count: null,
      onClick: null,
    },
  ]

  if (showPWAInstall) {
    DESKTOP_NAV_LINKS.unshift(pwaInstallLink)
    MOBILE_NAV_LINKS.unshift(pwaInstallLink)
  }

  const renderTopNav = () => {
    return (
      <div>
        <nav className="top-nav lg:flex fixed top-0 left-0 right-0 bg-white shadow-md px-3 lg:px-4 py-3 z-10">
          <div className="container mx-auto">
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center w-9/12 md:w-10/12 lg:w-auto">
                <DesktopView useCSS>
                  <CoreLink url={getHomePageUrl()} className="mr-6">
                    <CoreImage url={APP_LOGO.DEFAULT} alt="App Logo" disableLazyload className="h-12" />
                  </CoreLink>
                </DesktopView>

                <div className="mr-6 w-full lg:max-w-72 lg:w-auto">
                  <HeaderUserAddress />
                </div>

                <DesktopView useCSS>
                  <div className="w-96">
                    <HeaderSearch />
                  </div>
                </DesktopView>
              </div>

              <DesktopView useCSS>
                <HeaderLinks links={DESKTOP_NAV_LINKS} />
              </DesktopView>

              <MobileView useCSS>
                <HeaderLinks links={MOBILE_NAV_LINKS} />
              </MobileView>
            </div>
          </div>
        </nav>

        <div className="h-20" />
      </div>
    )
  }

  return (
    <div>
      {topNavVisibility ? renderTopNav() : null}

      <MobileView useCSS>
        <MobileNavbar />
      </MobileView>
    </div>
  )
}

export default Navbar
