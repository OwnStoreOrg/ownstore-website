import React, { ReactNode } from 'react'
import { IOrderInfo } from '../../contract/order'
import classnames from 'classnames'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import EscapeHTML from '../EscapeHTML'
import { getFormattedDateTime } from '../../utils/dates'
import { getOrderDetailPageUrl } from '../../utils/account'

interface IOrderInfoProps {
  orderInfo: IOrderInfo
}

const OrderInfo: React.FC<IOrderInfoProps> = props => {
  const { orderInfo: order } = props
  const { id, totalAmount, currency, createdDateTime, orderStatusHistory, cartItemsMeta } = order

  const recentOrderHistory = orderStatusHistory[0]

  const items = cartItemsMeta
    .map(cartItem => {
      return `${cartItem.quantity} x ${cartItem.productName}`
    })
    .join(', ')

  const renderItem = (title: ReactNode, subTitle: ReactNode, className?: string) => {
    return (
      <div className={classnames('mb-4', className)}>
        <div className="uppercase text-xs font-medium font-primary-medium">{title}</div>
        <div className="text-primaryTextBold text-sm font-medium font-primary-medium truncate">{subTitle}</div>
      </div>
    )
  }

  return (
    <div className={classnames('relative border border-gray300 rounded-lg p-4 w-full')}>
      <div className="absolute top-4 right-4 text-xs font-medium font-primary-medium text-primaryText bg-gray300 py-1 px-2 rounded-lg">
        {recentOrderHistory.status.name}
      </div>

      <div className="">
        {renderItem('Order Number', id)}
        {renderItem(
          'Total Amount',
          <div>
            <EscapeHTML html={currency.symbol} element="span" />
            {totalAmount}
          </div>
        )}
        {renderItem('Items', items)}
        {renderItem('Ordered On', getFormattedDateTime(createdDateTime))}
      </div>

      <div className="flex justify-end">
        <CoreButton
          label="View Details"
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.SOLID_SECONDARY}
          url={getOrderDetailPageUrl(id)}
          className="text-sm"
        />
      </div>
    </div>
  )
}

export default OrderInfo
