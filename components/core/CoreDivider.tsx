import React from 'react'
import classnames from 'classnames'

interface ICoreDividerProps {
  className?: string
}

const CoreDivider: React.FC<ICoreDividerProps> = props => {
  const { className } = props

  return <div className={classnames('bg-whisper h-2 mx-0', className)}></div>
}

export default CoreDivider
