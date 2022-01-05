import React from 'react'
import Modal from './Modal'
import classnames from 'classnames'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'

interface IAlertProps {
  dismissModal: () => void
  title?: string
  subTitle?: string
  cta: {
    primary: {
      show: boolean
      label?: string
      loading?: boolean
      onClick?: () => void
    }
    secondary: {
      show: boolean
      label?: string
      onClick?: () => void
    }
  }
  className?: string
}

const Alert: React.FC<IAlertProps> = props => {
  const { dismissModal, title, subTitle, cta, className } = props

  return (
    <Modal
      title={title}
      subTitle={subTitle}
      dismissModal={dismissModal}
      className={classnames('alertModalOverrides', className)}
      showCrossIcon={false}>
      <div className="p-3 flex justify-end">
        {cta.secondary.show ? (
          <CoreButton
            label={cta.secondary.label}
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_SECONDARY}
            onClick={cta.secondary.onClick}
          />
        ) : null}
        {cta.primary.show ? (
          <CoreButton
            label={cta.primary.label}
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            loading={cta.primary.loading}
            onClick={cta.primary.onClick}
            className="ml-1"
          />
        ) : null}
      </div>
    </Modal>
  )
}

export default Alert
