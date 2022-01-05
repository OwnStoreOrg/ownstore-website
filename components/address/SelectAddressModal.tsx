import { ChevronDoubleRightIcon, PlusIcon } from '@heroicons/react/outline'
import React, { useContext } from 'react'
import { IUserAddressInfo } from '../../contract/address'
import { getAddressPageUrl } from '../../utils/account'
import ApplicationContext from '../ApplicationContext'
import CoreLink from '../core/CoreLink'
import Modal from '../modal/Modal'
import AddressInfo, { AddressInfoSize } from './AddressInfo'
import classnames from 'classnames'
import { filterInactiveItem } from '../../utils/common'
import FullWidthModal from '../modal/FullWidthModal'
import { CoreButtonSize, CoreButtonType } from '../core/CoreButton'

interface ISelectAddressModalProps {
  dismissModal: () => void
  onAddressSelect: (address: IUserAddressInfo) => void
  selectedAddress: IUserAddressInfo
}

const SelectAddressModal: React.FC<ISelectAddressModalProps> = props => {
  const { dismissModal, onAddressSelect, selectedAddress } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  return (
    <FullWidthModal
      modal={{
        dismissModal: dismissModal,
        title: 'Select Address',
      }}
      footer={{
        buttons: [
          {
            label: 'Close',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_PRIMARY,
            onClick: () => dismissModal(),
          },
        ],
      }}>
      <CoreLink
        url={`${getAddressPageUrl()}?addAddress=true`}
        className="flex p-3 mb-1 shadow items-center font-medium font-primary-medium text-primaryTextBold bg-white transition-all hover:bg-gray100 cursor-pointer right-0">
        <PlusIcon className="w-5 mr-1" />
        <span className="text-base">Add New Address</span>
      </CoreLink>

      {filterInactiveItem(user.addresses).map((address, index) => (
        <div
          key={index}
          className={classnames(
            'border-b border-gray300 py-2 lg:px-1 bg-white transition-all hover:bg-gray100',
            address.id !== selectedAddress.id ? 'cursor-pointer' : ''
          )}
          onClick={() => onAddressSelect(address)}>
          <AddressInfo address={address} size={AddressInfoSize.MEDIUM} showCTA={false} />
          {address.id === selectedAddress.id ? (
            <div className="text-sm mx-3 text-primaryTextBold inline-flex items-center border-b border-primatext-primaryText font-medium font-primary-medium">
              <span>Selected Address for Delivery</span>
            </div>
          ) : (
            <div className="text-sm mx-3 text-moodyBlue inline-flex items-center border-b border-moodyBlue">
              <span>Deliver Here</span>
              <ChevronDoubleRightIcon className="w-4" />
            </div>
          )}
        </div>
      ))}
    </FullWidthModal>
  )
}

export default SelectAddressModal
