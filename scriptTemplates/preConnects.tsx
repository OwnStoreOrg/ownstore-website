import React from 'react'
import appConfig from '../config/appConfig'

const prepareAssetUrl = urlPath => {
  if (appConfig.global.assetBaseUrl) {
    return `${appConfig.global.assetBaseUrl}${urlPath || ''}`
  }
  return urlPath
}

const PreconnectUrls = () => (
  <>
    {/* Fonts preloading */}
    {/* Next.js has fonts optimization strategy built-in but only for Google web-fonts */}
    <link
      rel="preload"
      href={prepareAssetUrl(`/fonts/BentonSans/BentonSans-Bold/BentonSans-Bold.woff`)}
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />
    <link
      rel="preload"
      href={prepareAssetUrl(`/fonts/BentonSans/BentonSans-Regular/BentonSans-Regular.woff`)}
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
    />
    <link
      rel="preload"
      href={prepareAssetUrl(`/fonts/BentonSans/BentonSans-Medium/BentonSans-Medium.woff`)}
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
    />

    {/* <link rel="preconnect" href={appConfig.global.apiBaseUrl} crossOrigin="anonymous" /> */}
  </>
)

export default PreconnectUrls
