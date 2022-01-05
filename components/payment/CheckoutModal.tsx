import React, { useEffect, useState } from 'react'
import Modal from '../modal/Modal'
import CheckoutForm from './CheckoutForm'
import { IUserAddressInfo } from '../../contract/address'
import Loader, { LoaderType } from '../loader/Loader'
import classnames from 'classnames'

interface ICheckoutModalProps {
  selectedAddress: IUserAddressInfo
  toggleModal: (val: boolean) => void
}

const CheckoutModal: React.FC<ICheckoutModalProps> = props => {
  const { selectedAddress, toggleModal } = props

  const [showLoader, toggleLoader] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      toggleLoader(false)
    }, 1000)
  }, [])

  return (
    <Modal
      title="Checkout"
      dismissModal={() => toggleModal(false)}
      disableOutsideClick
      className="paymentCheckoutModalOverrides">
      {showLoader ? (
        <div className="p-4">
          <Loader type={LoaderType.ELLIPSIS} />
        </div>
      ) : null}

      <div className={classnames(showLoader ? 'opacity-0 h-0' : 'opacity-100 h-auto', 'transition-all')}>
        <CheckoutForm selectedAddress={selectedAddress} />
      </div>
    </Modal>
  )
}

export default CheckoutModal
