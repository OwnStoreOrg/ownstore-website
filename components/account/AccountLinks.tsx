import React from 'react'
import CoreActiveLink from '../core/CoreActiveLink'
import {
  KeyIcon as KeyIconIcon,
  LocationMarkerIcon as LocationMarkerIconOutline,
  PencilAltIcon as PencilAltIconOutline,
  ShoppingBagIcon as ShoppingBagIconOutline,
  UserIcon as UserIconOutline,
  TableIcon as TableIconOutline,
  LockClosedIcon as LockClosedIconOutline,
} from '@heroicons/react/outline'
import {
  ChevronRightIcon,
  LocationMarkerIcon as LocationMarkerIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserIcon as UserIconSolid,
  TableIcon as TableIconSolid,
  LockClosedIcon as LockClosedIconSolid,
} from '@heroicons/react/solid'
import {
  getAddressPageUrl,
  getAccountDetailsPageUrl,
  getLoginHistoryPageUrl,
  getOrdersPageUrl,
  getChangePasswordPageUrl,
  getEditAccountPageUrl,
  getSecurityPageUrl,
} from '../../utils/account'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import CoreLink from '../core/CoreLink'

interface IAccountLinksProps {}

const AccountLinks: React.FC<IAccountLinksProps> = props => {
  const router = useRouter()

  const LINKS = [
    {
      label: 'Account Details',
      url: getAccountDetailsPageUrl(),
      icon: UserIconOutline,
      activeIcon: UserIconSolid,
      isActive: router.pathname === getAccountDetailsPageUrl(),
    },
    {
      label: 'Edit Account Details',
      url: getEditAccountPageUrl(),
      icon: PencilAltIconOutline,
      activeIcon: PencilAltIconOutline,
      isActive: router.pathname === getEditAccountPageUrl(),
    },
    {
      label: 'Change Password',
      url: getChangePasswordPageUrl(),
      icon: KeyIconIcon,
      activeIcon: KeyIconIcon,
      isActive: router.pathname === getChangePasswordPageUrl(),
    },
    {
      label: 'Addresses',
      url: getAddressPageUrl(),
      icon: LocationMarkerIconOutline,
      activeIcon: LocationMarkerIconSolid,
      isActive: router.pathname === getAddressPageUrl(),
    },
    {
      label: 'Orders',
      url: getOrdersPageUrl(),
      icon: ShoppingBagIconOutline,
      activeIcon: ShoppingBagIconSolid,
      isActive: router.pathname.startsWith('/account/order'),
    },
    {
      label: 'Login History',
      url: getLoginHistoryPageUrl(),
      icon: TableIconOutline,
      activeIcon: TableIconSolid,
      isActive: router.pathname === getLoginHistoryPageUrl(),
    },
    {
      label: 'Security',
      url: getSecurityPageUrl(),
      icon: LockClosedIconOutline,
      activeIcon: LockClosedIconSolid,
      isActive: router.pathname === getSecurityPageUrl(),
    },
  ]

  const mappedLinks = LINKS.map((link, index) => {
    const IconComponent = link.isActive ? link.activeIcon : link.icon

    return (
      <CoreLink
        key={index}
        url={link.url}
        className={classnames(
          'flex items-center w-full px-2 py-3 lg:px-3 lg:py-3 transition-all bg-white hover:bg-gray100 group rounded',
          {
            'bg-gray100': link.isActive,
          }
        )}>
        <React.Fragment>
          <div className="mr-2">
            <IconComponent className="w-6" />
          </div>

          <div className="flex flex-grow justify-between items-center">
            <div className="text-gray900 font-normal font-primary-medium">{link.label}</div>
            <ChevronRightIcon className="w-5 text-gray700 transform transition-transform group-hover:scale-125" />
          </div>
        </React.Fragment>
      </CoreLink>
    )
  })

  return <>{mappedLinks}</>
}

export default AccountLinks
