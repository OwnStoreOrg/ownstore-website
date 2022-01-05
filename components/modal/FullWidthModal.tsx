import React from 'react'
import Modal, { IModalProps } from './Modal'
import classnames from 'classnames'
import CoreButton, { ICoreButtonProps } from '../core/CoreButton'

interface IFullWidthModalProps {
  modal: IModalProps
  className?: string
  contentClassName?: string
  footer?: {
    buttons: ICoreButtonProps[]
    className?: string
  }
}

const FullWidthModal: React.FC<IFullWidthModalProps> = props => {
  const { modal, className, contentClassName, footer, children } = props

  return (
    <Modal
      {...modal}
      className={classnames('fullWidthModalOverrides', className, {
        noFooter: !footer,
      })}>
      <div className="relative">
        <div className={classnames('content', contentClassName)}>{children}</div>

        {footer ? (
          <div
            className={classnames(
              'p-3 flex justify-end fixed lg:absolute bottom-0 left-0 right-0 w-full bg-white border-t border-gray400 lg:rounded-b-lg',
              footer.className
            )}>
            {footer.buttons.map((button, index) => (
              <CoreButton key={index} {...button} />
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

export default FullWidthModal
