import React from 'react'
import { ICurrencyInfo } from '../../contract/currency'
import EscapeHTML from '../EscapeHTML'
import Modal from '../modal/Modal'

interface ICartTaxAndChargesModalProps {
  extraChargesAmount: number | null
  extraChargesPercent: number | null
  taxAmount: number | null
  taxPercent: number | null
  currency: ICurrencyInfo
  dismissModal: () => void
}

const CartTaxAndChargesModal: React.FC<ICartTaxAndChargesModalProps> = props => {
  const { dismissModal, extraChargesAmount, extraChargesPercent, taxAmount, taxPercent, currency } = props

  return (
    <Modal title="Tax and Charges" dismissModal={dismissModal}>
      <div className="px-3 py-0 pb-5">
        <div className="flex justify-between text-primaryTextBold">
          <div>Tax</div>
          <div>
            <EscapeHTML html={currency.symbol} element="span" />
            {taxAmount} {taxPercent ? <span className="text-sm text-primaryText">({taxPercent}%)</span> : null}
          </div>
        </div>

        <div className="flex justify-between text-primaryTextBold mt-2">
          <div>Extra Charges</div>
          <div>
            <EscapeHTML html={currency.symbol} element="span" />
            {extraChargesAmount}{' '}
            {extraChargesPercent ? <span className="text-sm text-primaryText">({extraChargesPercent}%)</span> : null}
          </div>
        </div>

        <hr className="text-gray300 my-3" />

        <div className="flex justify-between text-primaryTextBold mt-2 font-medium font-primary-medium">
          <div>Total</div>
          <div>
            <EscapeHTML html={currency.symbol} element="span" />
            {taxAmount + extraChargesAmount}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CartTaxAndChargesModal
