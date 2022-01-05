import React, { useContext, useRef, useState } from 'react'
import appConfig from '../../config/appConfig'
import { IOrderDetail } from '../../contract/order'
import ApiError from '../../error/ApiError'
import useOnEnter from '../../hooks/useOnEnter'
import { refundSessionUserOrderDetail } from '../../http/order'
import { vibrate } from '../../utils/common'
import { getRefundPolicyPageUrl } from '../../utils/refundPolicy'
import ApplicationContext from '../ApplicationContext'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreDivider from '../core/CoreDivider'
import CoreLink from '../core/CoreLink'
import CoreRadio from '../core/CoreRadio'
import CoreTextarea from '../core/CoreTextarea'
import FullWidthModal from '../modal/FullWidthModal'
import Modal from '../modal/Modal'
import { toastError, toastSuccess } from '../Toaster'

interface ICancelOrderModalProps {
  orderDetail: IOrderDetail
  dismissModal: () => void
  updateOrder: (order: IOrderDetail) => void
}

const CancelOrderModal: React.FC<ICancelOrderModalProps> = props => {
  const { orderDetail, dismissModal, updateOrder } = props

  const { id, cancellationReasons } = orderDetail

  const applicationContext = useContext(ApplicationContext)

  const [loading, toggleLoading] = useState(false)
  const [radioAnswer, setRadioAnswer] = useState({
    id: null,
    label: '',
  })
  const [textValue, setTextValue] = useState('')

  const formRef = useRef(null)

  const RADIO_OPTIONS = cancellationReasons.map((reason, index) => ({
    id: index + 1,
    label: reason,
  }))

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const hasAnswered = !!(radioAnswer.id || textValue.trim())

    if (!hasAnswered) {
      toastError('Please add a reason')
    } else {
      toggleLoading(true)
      refundSessionUserOrderDetail(id, {
        reason: radioAnswer.label || textValue,
      })
        .then(resp => {
          if (resp.success) {
            toastSuccess('Order cancelled')
            vibrate()
            updateOrder(resp.orderDetail)
            dismissModal()
          }
        })
        .catch(err => {
          if (err instanceof ApiError && err.response.code !== 'UNKNOWN') {
            toastError(err.response.message || 'Failed to cancel order')
          } else {
            toastError('Failed to cancel order')
          }
        })
        .finally(() => toggleLoading(false))
    }
  }

  useOnEnter(formRef, handleSubmit)

  return (
    <FullWidthModal
      modal={{
        dismissModal: dismissModal,
        title: 'Cancel Order',
        disableOutsideClick: true,
      }}
      footer={{
        buttons: [
          {
            label: 'Cancel',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_SECONDARY,
            onClick: () => dismissModal(),
          },
          {
            label: 'Refund',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_PRIMARY,
            className: 'ml-1',
            loading: loading,
            onClick: handleSubmit,
          },
        ],
      }}>
      <div ref={formRef} className="px-3 pt-4">
        <div className="">
          Are you sure about this? This action cannot be reversed. Also please have a look at our refund policy before
          proceeding further.{' '}
          <CoreLink url={getRefundPolicyPageUrl()} className="underline">
            View Policy
          </CoreLink>
        </div>

        <hr className="text-gray300 my-4" />

        <div className="mt-2 mb-4">
          <div>
            <div className="font-medium font-primary-medium">Reason for cancellation*</div>
          </div>
          <div className="mt-2">
            {RADIO_OPTIONS.map(option => (
              <CoreRadio
                key={option.id}
                id={`answer-${option.id}`}
                onChange={value => {
                  setRadioAnswer({
                    id: Number(value),
                    label: option.label,
                  })
                }}
                value={`${option.id}`}
                label={option.label}
                checked={option.id === radioAnswer.id}
                className="my-3"
              />
            ))}

            <div className="mt-4">
              <CoreTextarea value={textValue} setValue={setTextValue} placeholder="Custom reason" className="h-24" />
            </div>
          </div>
        </div>
      </div>
    </FullWidthModal>
  )
}

export default CancelOrderModal
