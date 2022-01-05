import React, { ReactNode } from 'react'
import { ChevronRightIcon } from '@heroicons/react/outline'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import classnames from 'classnames'

interface ISectionWrapperProps {
  title: string
  subTitle?: string
  linkUrl?: string
  linkLabel?: string
  className?: string
  children: ReactNode
}

const SectionWrapper: React.FC<ISectionWrapperProps> = props => {
  const { title, subTitle, linkUrl, linkLabel, className, children } = props

  return (
    <div className={classnames('bg-white py-4', className)}>
      <div className="flex w-full justify-between px-3">
        <div>
          <div className="text-primaryTextBold font-bold font-primary-bold lg:text-lg ">{title}</div>
          {subTitle ? <div className="text-primaryText text-xs lg:text-sm">{subTitle}</div> : null}
        </div>
        <div>
          {linkUrl ? (
            <CoreButton
              label={linkLabel || 'View All'}
              icon={ChevronRightIcon}
              size={CoreButtonSize.SMALL}
              type={CoreButtonType.OUTLINE_SECONDARY}
              url={linkUrl}
            />
          ) : null}
        </div>
      </div>
      <div className="mt-3 lg:mt-4">{children}</div>
    </div>
  )
}

export default SectionWrapper
