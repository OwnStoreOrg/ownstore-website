import React, { useContext, useState } from 'react'
import Alert from '../modal/Alert'
import classnames from 'classnames'
import { IUserAddressInfo } from '../../contract/address'
import { updateSessionUserAddressInfo } from '../../http/address'
import ApplicationContext from '../ApplicationContext'
import { updateUserAddress } from '../../utils/account'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { toastError, toastSuccess } from '../Toaster'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { DynamicAddAddressInfoModal } from '../dynamicComponents'

export enum AddressInfoSize {
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

interface IAddressInfo {
  size: AddressInfoSize
  address: IUserAddressInfo
  showCTA?: boolean
  showContactNumber?: boolean
  className?: string
}

const AddressInfo: React.FC<IAddressInfo> = props => {
  const { size, address, showCTA = true, showContactNumber = true, className } = props

  const [showDeactivateConfirmModal, toggleDeactivateConfirmModal] = useState(false)
  const [showEditModal, toggleEditModal] = useState(false)

  const [deactivateLoading, toggleDeactivateLoading] = useState(false)
  const [editLoading, toggleEditLoading] = useState(false)

  const applicationContext = useContext(ApplicationContext)
  const {
    user,
    updaters,
    device: { isDesktop, isMobile },
  } = applicationContext

  const deactivateAddress = () => {
    toggleDeactivateLoading(true)
    updateSessionUserAddressInfo(address.id, {
      ...address,
      isActive: false,
    })
      .then(resp => {
        if (resp.success) {
          updaters.updateUser({
            ...user,
            addresses: updateUserAddress(user.addresses, {
              ...address,
              isActive: false,
            }),
          })
          toastSuccess('Address deactivated')
          toggleDeactivateConfirmModal(false)
          appAnalytics.sendEvent({
            action: AnalyticsEventType.DEACTIVATE_ADDRESS,
            extra: {
              address: address,
            },
          })
        }
      })
      .catch(e => {
        toastError('Failed to deactivate')
        toggleDeactivateConfirmModal(false)
      })
      .finally(() => {
        toggleDeactivateLoading(false)
      })
  }

  const updateAddress = (address: IUserAddressInfo) => {
    const { id, ...restAddress } = address
    toggleEditLoading(true)
    updateSessionUserAddressInfo(id, restAddress)
      .then(resp => {
        if (resp.success) {
          updaters.updateUser({
            ...user,
            addresses: updateUserAddress(user.addresses, address),
          })
          toastSuccess('Updated addresss')
          appAnalytics.sendEvent({
            action: AnalyticsEventType.EDIT_ADDRESS,
            extra: {
              address: address,
            },
          })
        }
      })
      .catch(e => {
        toastError('Failed to update')
      })
      .finally(() => {
        toggleEditModal(false)
        toggleEditLoading(false)
      })
  }

  let addressTypeAbsolute = true

  if (isMobile) {
    addressTypeAbsolute = false
  } else if (size === AddressInfoSize.MEDIUM) {
    addressTypeAbsolute = false
  }

  return (
    <React.Fragment>
      <div className={classnames('py-2 px-3', className)}>
        <div className="relative">
          {true ? (
            <div
              className={classnames(
                'absolute mb-1 text-primaryText right-0 font-medium font-primary-medium bg-gray300 text-xs py-1 px-2 rounded-lg uppercase',
                addressTypeAbsolute ? 'top-0' : 'bottom-0'
              )}>
              {address.addressType}
            </div>
          ) : null}

          <div className="inline-flex items-center relative">
            <span
              className={classnames('text-primaryTextBold font-medium font-primary-medium text-base', {
                'lg:text-lg': size === AddressInfoSize.LARGE,
              })}>
              {address.name}
            </span>{' '}
            {address.isPrimary ? (
              <span className="ml-1" title="Primary Address">
                <BadgeCheckIcon className="w-5" />
              </span>
            ) : null}
          </div>

          <div
            className={classnames('text-sm mt-2', {
              'lg:text-base': size === AddressInfoSize.LARGE,
            })}>
            <div>{address.addressLine}</div>
            <div>
              {address.area}
              {address.areaCode ? ` - ${address.areaCode}` : ''}
            </div>
            <div>
              {address.city} - {address.country}
            </div>
          </div>

          {/* {!addressTypeAbsolute ? (
            <div
              className={classnames('text-sm', {
                'lg:text-base': size === AddressInfoSize.LARGE,
                'mt-2': !addressTypeAbsolute,
              })}>
              Address Type: <span>{address.addressType}</span>
            </div>
          ) : null} */}

          {showContactNumber ? (
            <div
              className={classnames('text-sm', {
                'lg:text-base': size === AddressInfoSize.LARGE,
                'mt-2': addressTypeAbsolute,
                'mt-1': !addressTypeAbsolute,
              })}>
              Phone: <span>{address.phoneNumber}</span>
            </div>
          ) : null}
        </div>

        {showCTA ? (
          <div className="flex mt-4 border-t border-gray400">
            <div
              className="w-1/2 text-center px-4 py-2 lg:py-3 font-medium font-primary-medium border-r border-gray400 transition-all bg-white hover:bg-gray100 cursor-pointer"
              onClick={() => toggleEditModal(true)}>
              Edit
            </div>
            <div
              className="w-1/2 text-center px-4 py-2 lg:py-3 font-medium font-primary-medium transition-all bg-white hover:bg-gray100 cursor-pointer"
              onClick={() => toggleDeactivateConfirmModal(true)}>
              Deactivate
            </div>
          </div>
        ) : null}
      </div>

      {showDeactivateConfirmModal ? (
        <Alert
          dismissModal={() => toggleDeactivateConfirmModal(false)}
          title="Deactivate Confirmation"
          subTitle="Are you sure you want to do this? You cannot undo this."
          cta={{
            primary: {
              show: true,
              label: 'Deactivate',
              loading: deactivateLoading,
              onClick: deactivateAddress,
            },
            secondary: {
              show: true,
              label: 'Cancel',
              onClick: () => toggleDeactivateConfirmModal(false),
            },
          }}
        />
      ) : null}

      {showEditModal ? (
        <DynamicAddAddressInfoModal
          dismiss={() => toggleEditModal(false)}
          address={address}
          title="Edit Address"
          cta={{
            primary: {
              show: true,
              label: 'Update',
              loading: editLoading,
              onClick: updateAddress,
            },
            secondary: {
              show: true,
              label: 'Cancel',
              onClick: () => toggleEditModal(false),
            },
          }}
        />
      ) : null}
    </React.Fragment>
  )
}

export default AddressInfo
