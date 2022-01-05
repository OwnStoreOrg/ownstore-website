import React from 'react'
import appConfig from '../config/appConfig'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config'

const resolvedTailwindConfig = resolveConfig(tailwindConfig)
const theme = resolvedTailwindConfig.theme

const prepareAssetUrl = urlPath => {
  if (appConfig.global.assetBaseUrl) {
    return `${appConfig.global.assetBaseUrl}${urlPath || ''}`
  }
  return urlPath
}

const AppIcons: React.FC = () => {
  return (
    <>
      <link rel="apple-touch-icon" sizes="57x57" href={prepareAssetUrl('/images/logos/apple-icon-57x57.png')} />
      <link rel="apple-touch-icon" sizes="60x60" href={prepareAssetUrl('/images/logos/apple-icon-60x60.png')} />
      <link rel="apple-touch-icon" sizes="72x72" href={prepareAssetUrl('/images/logos/apple-icon-72x72.png')} />
      <link rel="apple-touch-icon" sizes="76x76" href={prepareAssetUrl('/images/logos/apple-icon-76x76.png')} />
      <link rel="apple-touch-icon" sizes="114x114" href={prepareAssetUrl('/images/logos/apple-icon-114x114.png')} />
      <link rel="apple-touch-icon" sizes="120x120" href={prepareAssetUrl('/images/logos/apple-icon-120x120.png')} />
      <link rel="apple-touch-icon" sizes="144x144" href={prepareAssetUrl('/images/logos/apple-icon-144x144.png')} />
      <link rel="apple-touch-icon" sizes="152x152" href={prepareAssetUrl('/images/logos/apple-icon-152x152.png')} />
      <link rel="apple-touch-icon" sizes="180x180" href={prepareAssetUrl('/images/logos/apple-icon-180x180.png')} />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href={prepareAssetUrl('/images/logos/android-icon-192x192.png')}
      />
      <link rel="icon" type="image/png" sizes="32x32" href={prepareAssetUrl('/images/logos/favicon-32x32.png')} />
      <link rel="icon" type="image/png" sizes="96x96" href={prepareAssetUrl('/images/logos/favicon-96x96.png')} />
      <link rel="icon" type="image/png" sizes="16x16" href={prepareAssetUrl('/images/logos/favicon-16x16.png')} />
      <meta name="msapplication-TileImage" content={prepareAssetUrl('/images/logos/ms-icon-144x144.png')} />
    </>
  )
}

const AppSplashScreens: React.FC = props => {
  return (
    <>
      <link
        href={prepareAssetUrl('/images/splashscreens/iphone5_splash.png')}
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href={prepareAssetUrl('/images/splashscreens/iphone6_splash.png')}
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href={prepareAssetUrl('/images/splashscreens/iphoneplus_splash.png')}
        media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href={prepareAssetUrl('/images/splashscreens/iphonex_splash.png')}
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href={prepareAssetUrl('/images/splashscreens/iphonexr_splash.png')}
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href={prepareAssetUrl('/images/splashscreens/iphonexsmax_splash.png')}
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href={prepareAssetUrl('/images/splashscreens/ipad_splash.png')}
        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href={prepareAssetUrl('/images/splashscreens/ipadpro1_splash.png')}
        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href={prepareAssetUrl('/images/splashscreens/ipadpro3_splash.png')}
        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href={prepareAssetUrl('/images/splashscreens/ipadpro2_splash.png')}
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
    </>
  )
}

interface IProps {}

const MetaTags: React.FC<IProps> = props => (
  <>
    {appConfig.integrations.googleSiteVerification.enabled ? (
      <meta name="google-site-verification" content={appConfig.integrations.googleSiteVerification.code} />
    ) : null}
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    />
    <link rel="manifest" href="/json/manifest.json" />

    <AppIcons />

    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content={`${appConfig.global.app.name}`} />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="theme-color" content={theme.colors.primary} />
    <meta name="msapplication-TileColor" content={theme.colors.primary} />

    <AppSplashScreens />
  </>
)

export default MetaTags
