import React from 'react'
import classnames from 'classnames'
import CoreImage, { ImageSourceType } from './core/CoreImage'
import { prepareImageUrl } from '../utils/image'

export enum NoContentType {
  DEFAULT = 'DEFAULT',
  LOGIN = 'LOGIN',
}

interface INoContentProps {
  type?: NoContentType
  message?: string
  className?: string
}

const NoContent: React.FC<INoContentProps> = props => {
  const { className, message = 'No content available' } = props

  return (
    <div className={classnames('p-5 flex flex-col items-center justify-center', className)}>
      {/* <div className="w-20 h-20 bg-gray300 mb-4"></div> */}
      <div>
        <CoreImage
          url={prepareImageUrl('/images/empty/empty-cart-basket.webp', ImageSourceType.ASSET)}
          className="w-80 min-h-52"
          alt="No content found"
          disableLazyload
        />
      </div>
      <div className="text-center mt-2">{message}</div>
    </div>
  )
}

export default NoContent
