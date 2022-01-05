import React from 'react'
import { prepareImageUrl } from '../utils/image'
import CoreImage, { ImageSourceType } from './core/CoreImage'

interface IOrientationLockProps {}

const OrientationLock: React.FC<IOrientationLockProps> = props => {
  return (
    <div className="orientation-lock">
      <div className="content">
        <CoreImage
          url={prepareImageUrl('/images/landscape.png', ImageSourceType.ASSET)}
          alt="Landscape mode not supported"
        />
        <div className="text">
          <div className="text-1">Please rotate your device</div>
          <div className="text-2">{`We don't support landscape mode. Please go back to portrait mode for the best experience`}</div>
        </div>
      </div>
    </div>
  )
}

export default OrientationLock
