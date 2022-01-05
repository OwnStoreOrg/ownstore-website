import React, { CSSProperties, useRef, useState, useEffect } from 'react'
import classnames from 'classnames'
import IObserver from '../../lib/IObserver'
import { LAZYIMAGE_PLACEHOLDER_TRANSPARENT, LAZYIMAGE_PLACEHOLDER } from '../../constants/constants'

export enum ImageSourceType {
  ASSET = 'asset', // assets stored locally such as logo, icons, etc.. which can be pushed to CDN
  CLOUD = 'cloud', // stored in cloud
  NONE = 'none', // for absolute urls
}

export interface ICoreImageProps {
  url: string
  alt: string
  className?: string
  style?: CSSProperties
  useTransparentPlaceholder?: boolean
  disableLazyload?: boolean
  onError?: (param: any) => void
}

declare let window: any

const CoreImage: React.FC<ICoreImageProps> = props => {
  const { url, alt, className, style, useTransparentPlaceholder, disableLazyload = false, onError } = props

  const imagePlaceholderUrl = useTransparentPlaceholder ? LAZYIMAGE_PLACEHOLDER_TRANSPARENT : LAZYIMAGE_PLACEHOLDER

  const ref = useRef(null)

  const [imgSrc, setImgSrc] = useState(disableLazyload ? url : imagePlaceholderUrl)

  useEffect(() => {
    if (!disableLazyload) {
      // We dont need separate Observer for each image
      if (!window.imgObserver) {
        window.imgObserver = new IObserver({
          options: { threshold: 0 },
          observeOnce: true,
        })
      }
      window.imgObserver.observe(ref.current, () => setImgSrc(url))
    }
  }, [url])

  const imgError = (image: any) => {
    image.onerror = null
    image.target.removeAttribute('src')
    image.target.removeAttribute('alt', '')
    onError && onError(image)
  }

  return (
    <img
      ref={ref}
      src={imgSrc}
      alt={alt || ''}
      style={style}
      className={classnames('img', className)}
      onError={imgError}
    />
  )
}

export default CoreImage
