import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import CoreButton, { CoreButtonSize, CoreButtonType } from './core/CoreButton'
import classnames from 'classnames'

interface IMoreContentProps {}

const MoreContent: React.FC<IMoreContentProps> = props => {
  const { children } = props

  const [showGradient, toggleGradient] = useState(true)

  return (
    <div>
      <div
        className={classnames({
          moreContent: showGradient,
        })}>
        {children}
      </div>
      <div
        className={classnames('relative text-center', {
          'mt-2': !showGradient,
        })}>
        <CoreButton
          label={
            <React.Fragment>
              <span>{showGradient ? 'View More' : 'Hide'}</span>
              {showGradient ? <ChevronDownIcon className="w-4 ml-1" /> : <ChevronUpIcon className="w-4 ml-1" />}
            </React.Fragment>
          }
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.OUTLINE_SECONDARY}
          onClick={() => toggleGradient(!showGradient)}
        />
      </div>
    </div>
  )
}

export default MoreContent
