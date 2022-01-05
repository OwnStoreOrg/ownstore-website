import React, { useEffect, useRef } from 'react'
import useEscape from '../../hooks/useEscape'
import useOutsideClick from '../../hooks/useOutsideClick'
import usePortal from '../../hooks/usePortal'
import { XIcon } from '@heroicons/react/solid'
import { addBlur, removeBlur } from '../../utils/common'
import classnames from 'classnames'
import useDisablePageScrolling from '../../hooks/useDisablePageScrolling'

export interface IModalProps {
  dismissModal: () => void
  title?: string
  subTitle?: string
  className?: string
  showCrossIcon?: boolean
  disableOutsideClick?: boolean
}

const Modal: React.FC<IModalProps> = props => {
  const {
    dismissModal,
    title,
    subTitle,
    className,
    showCrossIcon = true,
    children,
    disableOutsideClick = false,
  } = props

  const ref = useRef()

  const Portal = usePortal()

  useEffect(() => {
    addBlur()
    return () => {
      removeBlur()
    }
  }, [])

  useDisablePageScrolling()
  useEscape(() => dismissModal())
  useOutsideClick({
    ref,
    onOutsideClick: () => {
      if (!disableOutsideClick) {
        dismissModal()
      }
    },
  })

  return (
    <Portal>
      <div id="Modal" className="fixed z-20 left-0 top-0 w-full h-full bg-blackHalfLight overflow-hidden">
        <div
          className={classnames(
            'z-20 bg-white w-auto md:w-[600px] md:mx-auto mx-3 mt-14 rounded-lg shadow-shareSection',
            className
          )}
          ref={ref}>
          <div className="flex justify-between items-start p-3 modal-header">
            <div>
              <div className="font-medium font-primary-medium text-primaryTextBold">{title}</div>
              <div className="text-sm mt-1">{subTitle}</div>
            </div>
            {showCrossIcon ? (
              <XIcon
                className="w-6 text-gray700 font-medium font-primary-medium cursor-pointer"
                onClick={() => dismissModal()}
              />
            ) : null}
          </div>
          <div>{children}</div>
        </div>
      </div>
    </Portal>
  )
}

export default Modal
