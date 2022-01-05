import { CalculatorIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import EscapeHTML from '../EscapeHTML'
import classnames from 'classnames'
import { ICurrencyInfo } from '../../contract/currency'
import { DynamicCartTaxAndChargesModal } from '../dynamicComponents'

interface ICartSummaryProps {
  retailAmount: number
  saleAmount: number
  discountAmount: number
  deliveryAmount: number
  totalAmount: number
  extraChargesAmount: number | null
  extraChargesPercent: number | null
  taxAmount: number | null
  taxPercent: number | null
  currency: ICurrencyInfo
  title: string
}

const CartSummary: React.FC<ICartSummaryProps> = props => {
  const {
    retailAmount,
    saleAmount,
    discountAmount,
    deliveryAmount,
    totalAmount = 0,
    extraChargesAmount = 0,
    extraChargesPercent,
    taxAmount = 0,
    taxPercent,
    currency,
    title,
  } = props

  const [showChargesModal, toggleChargesModal] = useState(false)

  return (
    <div className="border border-gray300 rounded-lg">
      <div className="text-primaryTextBold font-medium font-primary-medium border-b border-gray300 p-3 py-4 flex items-center">
        <CalculatorIcon className="w-6 relative mr-1 text-gray700" />
        <span>{title}</span>
      </div>

      <div className="p-3">
        <div className="flex justify-between text-primaryTextBold py-2 text-sm">
          <div>Cart Total</div>
          <div>
            <EscapeHTML html={currency.symbol} element="span" />
            {retailAmount}
          </div>
        </div>

        {discountAmount ? (
          <div className="flex justify-between text-chateauGreen py-2 text-sm">
            <div>Cart Discount</div>
            <div>
              {'- '}
              <EscapeHTML html={currency.symbol} element="span" />
              {discountAmount}
            </div>
          </div>
        ) : null}

        {/* Only when there's discount, then show sale total. Else there will be 2 data points for the same amount (cart total, sale total) */}
        {discountAmount ? (
          <div className="flex justify-between text-primaryTextBold py-2 text-sm ">
            <div>Sale Total</div>
            <div>
              <EscapeHTML html={currency.symbol} element="span" />
              {saleAmount}
            </div>
          </div>
        ) : null}

        <div
          className={classnames('flex justify-between text-primaryTextBold py-2 text-sm', {
            'text-chateauGreen': deliveryAmount === 0,
          })}>
          <div>Delivery Charge</div>
          <div>
            {deliveryAmount === 0 ? (
              'FREE'
            ) : (
              <span>
                <EscapeHTML html={currency.symbol} element="span" />
                {deliveryAmount}
              </span>
            )}
          </div>
        </div>

        {extraChargesAmount || taxAmount ? (
          <div className="flex justify-between text-primaryTextBold py-2 text-sm">
            <div className="underline-dashed cursor-pointer" onClick={() => toggleChargesModal(true)}>
              Tax & Charges
            </div>
            <div>
              <EscapeHTML html={currency.symbol} element="span" />
              {extraChargesAmount + taxAmount}
            </div>
          </div>
        ) : null}

        <hr className="text-gray600 my-2" />

        <div className="flex justify-between text-primaryTextBold py-2 text-sm lg:text-base font-medium font-primary-medium">
          <div>Grand Total</div>
          <div>
            <EscapeHTML html={currency.symbol} element="span" />
            {totalAmount}
          </div>
        </div>
      </div>

      {showChargesModal ? (
        <DynamicCartTaxAndChargesModal
          extraChargesAmount={extraChargesAmount}
          extraChargesPercent={extraChargesPercent}
          taxAmount={taxAmount}
          taxPercent={taxPercent}
          currency={currency}
          dismissModal={() => toggleChargesModal(false)}
        />
      ) : null}
    </div>
  )
}

export default CartSummary
