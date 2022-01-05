import React from 'react'
import classnames from 'classnames'

// https://loading.io/css/
export enum LoaderType {
  ROLLER = 'ROLLER',
  RING = 'RING',
  ELLIPSIS = 'ELLIPSIS',
}

interface ILoaderProps {
  type: LoaderType
  className?: string
}

const Loader: React.FC<ILoaderProps> = props => {
  const { type, className } = props

  if (type === LoaderType.RING) {
    return (
      <div className={classnames('flex justify-center p-2', className)}>
        <div className="solid-loader">
          <div className="loader primary">
            <div></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === LoaderType.ROLLER) {
    return (
      <div className={classnames('dotted-loader flex justify-center p-2', className)}>
        <div className="sk-chase">
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
        </div>
      </div>
    )
  }

  if (type === LoaderType.ELLIPSIS) {
    return (
      <div className={classnames('flex justify-center p-2', className)}>
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  return null
}

export default Loader
