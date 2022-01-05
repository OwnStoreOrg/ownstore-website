import React, { useContext } from 'react'
import { getHomePageUrl } from '../../utils/home'
import CoreActiveLink from '../core/CoreActiveLink'
import classnames from 'classnames'
import {
  HomeIcon as HomeIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UserIcon as UserIconSolid,
  MenuIcon as MenuIconSolid,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/solid'
import {
  HomeIcon as HomeIconOutline,
  ShoppingCartIcon as ShoppingCartIconOutline,
  UserIcon as UserIconOutline,
  MenuIcon as MenuIconOutline,
  HeartIcon as HeartIconOutline,
} from '@heroicons/react/outline'
import { getWishlistPageUrl } from '../../utils/wishlist'
import { getMorePageUrl } from '../../utils/more'
import { getAccountDetailsPageUrl } from '../../utils/account'
import { getCartPageUrl, getProductsQuantityCount } from '../../utils/cart'
import ApplicationContext from '../ApplicationContext'
import { formatHeaderCount } from '../../utils/common'
import { useRouter } from 'next/router'
import CoreLink from '../core/CoreLink'
import appConfig from '../../config/appConfig'

interface IMobileNavbarProps {}

const MobileNavbar: React.FC<IMobileNavbarProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { cart, wishlist } = applicationContext

  const router = useRouter()

  const TABS = [
    {
      label: 'Home',
      url: getHomePageUrl(),
      iconComponent: HomeIconOutline,
      activeIconComponent: HomeIconSolid,
      isActive: router.pathname === getHomePageUrl(),
      count: null,
    },
    {
      label: 'Wishlist',
      url: getWishlistPageUrl(),
      iconComponent: HeartIconOutline,
      activeIconComponent: HeartIconSolid,
      isActive: router.pathname === getWishlistPageUrl(),
      count: wishlist ? formatHeaderCount(wishlist.length) : null,
    },
    {
      label: 'Cart',
      url: getCartPageUrl(),
      iconComponent: ShoppingCartIconOutline,
      activeIconComponent: ShoppingCartIconSolid,
      isActive: router.pathname === getCartPageUrl(),
      count: cart ? formatHeaderCount(getProductsQuantityCount(cart.cartItems)) : null,
    },
    {
      label: 'Account',
      url: getAccountDetailsPageUrl(),
      iconComponent: UserIconOutline,
      isActive: router.pathname.startsWith('/account'),
      activeIconComponent: UserIconSolid,
      count: null,
    },
    {
      label: 'More',
      url: getMorePageUrl(),
      iconComponent: MenuIconOutline,
      activeIconComponent: MenuIconSolid,
      isActive: router.pathname === getMorePageUrl(),
      count: null,
    },
  ]

  return (
    <div>
      <div className="mobile-nav fixed bg-white shadow-mobileNav w-full bottom-0 left-0 right-0 flex justify-between items-center rounded-t-lg z-10">
        {TABS.map((tab, index) => {
          const isActive = tab.isActive
          const IconComponent = isActive ? tab.activeIconComponent : tab.iconComponent

          return (
            <CoreLink key={tab.url} url={tab.url} className="w-full">
              <div
                className={classnames('flex flex-col items-center uppercase border-0 border-b-2 pt-3 pb-2 relative', {
                  'border-primary text-primaryTextBold': isActive,
                  'border-white': !isActive,
                })}>
                <IconComponent className="w-6 mb-1" />
                <div
                  className={classnames('font-medium font-primary-bold text-xxs', {
                    'text-primary': isActive,
                  })}>
                  {tab.label}
                </div>
                {tab.count && !isActive ? (
                  <span className="absolute right-2 md:right-10 top-1 bg-primary text-xxs text-white rounded-lg py-[1px] px-1 font-medium font-primary-medium">
                    {tab.count}
                  </span>
                ) : null}
              </div>
            </CoreLink>
          )
        })}
      </div>
    </div>
  )
}

export default MobileNavbar
