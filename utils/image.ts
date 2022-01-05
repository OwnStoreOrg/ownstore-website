import { ImageSourceType } from '../components/core/CoreImage'
import appConfig from '../config/appConfig'
import { APP_LOGO } from '../constants/constants'

// Each image url should be wrapped with this function
export const prepareImageUrl = (urlPath: string, source: ImageSourceType, variant?: string): string => {
  if (source === ImageSourceType.CLOUD) {
    if (variant && appConfig.integrations.imageTransformation.enabled) {
      return `${appConfig.global.imageBaseUrl}/${variant}${urlPath || ''}`
    } else {
      return `${appConfig.global.imageBaseUrl}${urlPath || ''}`
    }
  }

  if (source === ImageSourceType.ASSET) {
    if (appConfig.global.assetBaseUrl) {
      return `${appConfig.global.assetBaseUrl}${urlPath || ''}`
    } else {
      return urlPath
    }
  }

  return urlPath
}

export const handleThumbnailImageError = (image: any) => {
  image.target.setAttribute('src', APP_LOGO.DEFAULT)
}
