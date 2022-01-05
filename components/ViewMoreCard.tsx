import React from 'react'
import CoreButton, { CoreButtonSize, CoreButtonType } from './core/CoreButton'
import { ChevronRightIcon } from '@heroicons/react/outline'

interface IViewMoreCardProps {
  onClick?: (e: any) => void
}

const ViewMoreCard: React.FC<IViewMoreCardProps> = props => {
  const { onClick } = props

  return (
    <div
      className="flex items-center justify-center bg-whisper hover:bg-denim h-full rounded-lg cursor-pointer"
      onClick={onClick}>
      <CoreButton
        label="View More"
        icon={ChevronRightIcon}
        size={CoreButtonSize.MEDIUM}
        type={CoreButtonType.OUTLINE_SECONDARY}
      />
    </div>
  )
}

export default ViewMoreCard
