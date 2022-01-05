import React, { useContext, useEffect, useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline'
import CoreButton, { CoreButtonType, CoreButtonSize } from '../core/CoreButton'
import { LocationMarkerIcon } from '@heroicons/react/solid'
import { getAddressPageUrl, getUserAddressToShow } from '../../utils/account'
import { useRouter } from 'next/router'
import ApplicationContext from '../ApplicationContext'
import classnames from 'classnames'
import { ADDRESS_NAME_MAP } from '../../constants/constants'
import LoginPromptModal from '../login/LoginPromptModal'
import { filterInactiveItem } from '../../utils/common'

interface IHeaderUserAddressProps {}

const HeaderUserAddress: React.FC<IHeaderUserAddressProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  const router = useRouter()

  const [showAddAddressPopup, toggleAddAddressPopup] = useState(false)
  const [showLoginPrompt, toggleLoginPrompt] = useState(false)

  const activeAddresses = filterInactiveItem(user?.addresses || [])
  const addressToShow = getUserAddressToShow(activeAddresses || [])

  useEffect(() => {
    if (router.pathname === '/account/address') {
      toggleAddAddressPopup(false)
    } else {
      if (user) {
        if (!addressToShow) {
          toggleAddAddressPopup(true)
          setTimeout(() => {
            toggleAddAddressPopup(false)
          }, 5000)
        } else {
          toggleAddAddressPopup(false)
        }
      }
    }
  }, [user])

  const renderAskAddressPopup = () => {
    return (
      <div
        className={classnames(
          'fixed text-sm bg-white p-3 w-80 lg:w-96 rounded-md text-primaryTextBold shadow-headerUserAddress top-[72px] left-1 lg:top-[75px] lg:left-[auto]'
        )}>
        <div className="mb-3">Please add an address so we can serve you better.</div>
        <CoreButton
          type={CoreButtonType.SOLID_PRIMARY}
          size={CoreButtonSize.MEDIUM}
          icon={ChevronRightIcon}
          label="Add Address"
          onClick={() => {
            router.push(getAddressPageUrl())
            setTimeout(() => {
              toggleAddAddressPopup(false)
            }, 1500)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <div
        className="cursor-pointer flex items-start"
        onClick={() => {
          if (!user) {
            toggleLoginPrompt(true)
          } else {
            router.push(getAddressPageUrl())
          }
        }}>
        <div className="mr-2">
          <LocationMarkerIcon className="w-6 relative top-[2px]" />
        </div>
        <div className="w-[85%]">
          <div className="font-bold font-primary-bold text-mineShaft text-base truncate">
            {!activeAddresses.length ? 'Address' : addressToShow ? addressToShow.name : 'Home'}
          </div>
          <div className="flex items-end">
            <div className="text-primaryText text-sm truncate">
              {addressToShow
                ? `${ADDRESS_NAME_MAP[addressToShow.addressType]} - ${addressToShow.addressLine}`
                : 'Your current address'}
            </div>
            <ChevronDownIcon className="min-w-5 w-5 ml-1" />
          </div>
        </div>
      </div>

      {showAddAddressPopup ? renderAskAddressPopup() : null}

      {showLoginPrompt ? <LoginPromptModal toggleModal={toggleLoginPrompt} /> : null}
    </div>
  )
}

export default HeaderUserAddress
