import { ImageSourceType } from '../components/core/CoreImage'
import appConfig from '../config/appConfig'
import { UserAddressType } from '../contract/constants'
import { prepareImageUrl } from '../utils/image'

// this map can have logos of multiple sizes
export const APP_LOGO = {
  DEFAULT: prepareImageUrl(`/images/logo.png`, ImageSourceType.ASSET),
  1920: prepareImageUrl(`/images/logo-1920.png`, ImageSourceType.ASSET),
}

export const SCREEN_SIZE = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}

export const LAZYIMAGE_PLACEHOLDER = prepareImageUrl('/images/lazyimage.png', ImageSourceType.ASSET)
export const LAZYIMAGE_PLACEHOLDER_TRANSPARENT = prepareImageUrl(
  '/images/lazyimage-transparent.png',
  ImageSourceType.ASSET
)

export const MAX_PRODUCTS_IN_CATALOGUE_SWITCHER = 12

export const INITIAL_PAGE_BUILD_COUNT = appConfig.build.initialPageBuildCount
export const PAGE_REVALIDATE_TIME = appConfig.build.pageRevalidateTimeInSec

export const INFINITE_SCROLL_FETCH_LIMIT = appConfig.global.infiniteScrollFetchLimit

export const SOCIAL_ICONS_SRC_MAP = {
  APPLE: prepareImageUrl('/images/icons/social/apple.svg', ImageSourceType.ASSET),
  ANDROID: prepareImageUrl('/images/icons/social/android.svg', ImageSourceType.ASSET),
  ALIBABA: prepareImageUrl('/images/icons/social/alibaba.svg', ImageSourceType.ASSET),
  AMAZON: prepareImageUrl('/images/icons/social/amazon.svg', ImageSourceType.ASSET),
  EMAIL: prepareImageUrl('/images/icons/social/email.svg', ImageSourceType.ASSET),
  APPSTORE: prepareImageUrl('/images/icons/social/appstore.svg', ImageSourceType.ASSET),
  BLOGGER: prepareImageUrl('/images/icons/social/blogger.svg', ImageSourceType.ASSET),
  DISCORD: prepareImageUrl('/images/icons/social/discord.svg', ImageSourceType.ASSET),
  DRIVE: prepareImageUrl('/images/icons/social/drive.svg', ImageSourceType.ASSET),
  EBAY: prepareImageUrl('/images/icons/social/ebay.svg', ImageSourceType.ASSET),
  FACEBOOK: prepareImageUrl('/images/icons/social/facebook.svg', ImageSourceType.ASSET),
  GITHUB: prepareImageUrl('/images/icons/social/github.svg', ImageSourceType.ASSET),
  GITLAB: prepareImageUrl('/images/icons/social/gitlab.svg', ImageSourceType.ASSET),
  MAIL: prepareImageUrl('/images/icons/social/mail.svg', ImageSourceType.ASSET),
  GOOGLE: prepareImageUrl('/images/icons/social/google.svg', ImageSourceType.ASSET),
  GOOGLE_PLAY: prepareImageUrl('/images/icons/social/googleplay.svg', ImageSourceType.ASSET),
  INSTAGRAM: prepareImageUrl('/images/icons/social/instagram.svg', ImageSourceType.ASSET),
  ITUNES: prepareImageUrl('/images/icons/social/itunes.svg', ImageSourceType.ASSET),
  LINKEDIN: prepareImageUrl('/images/icons/social/linkedin.svg', ImageSourceType.ASSET),
  MEDIUM: prepareImageUrl('/images/icons/social/medium.svg', ImageSourceType.ASSET),
  PAYPAL: prepareImageUrl('/images/icons/social/paypal.svg', ImageSourceType.ASSET),
  PHONE: prepareImageUrl('/images/icons/social/phone.svg', ImageSourceType.ASSET),
  PHOTOS: prepareImageUrl('/images/icons/social/photos.svg', ImageSourceType.ASSET),
  PINTEREST: prepareImageUrl('/images/icons/social/pinterest.svg', ImageSourceType.ASSET),
  QUORA: prepareImageUrl('/images/icons/social/quora.svg', ImageSourceType.ASSET),
  REDDIT: prepareImageUrl('/images/icons/social/reddit.svg', ImageSourceType.ASSET),
  RSS: prepareImageUrl('/images/icons/social/rss.svg', ImageSourceType.ASSET),
  SINA_WEIBO: prepareImageUrl('/images/icons/social/sinaweibo.svg', ImageSourceType.ASSET),
  SLACK: prepareImageUrl('/images/icons/social/slack.svg', ImageSourceType.ASSET),
  SNAPCHAT: prepareImageUrl('/images/icons/social/snapchat.svg', ImageSourceType.ASSET),
  SPOTIFY: prepareImageUrl('/images/icons/social/spotify.svg', ImageSourceType.ASSET),
  TELEGRAM: prepareImageUrl('/images/icons/social/telegram.svg', ImageSourceType.ASSET),
  TIKTOK: prepareImageUrl('/images/icons/social/tiktok.svg', ImageSourceType.ASSET),
  TUMBLR: prepareImageUrl('/images/icons/social/tumblr.svg', ImageSourceType.ASSET),
  TWITCH: prepareImageUrl('/images/icons/social/twitch.svg', ImageSourceType.ASSET),
  TWITTER: prepareImageUrl('/images/icons/social/twitter.svg', ImageSourceType.ASSET),
  VIMEO: prepareImageUrl('/images/icons/social/vimeo.svg', ImageSourceType.ASSET),
  WECHAT: prepareImageUrl('/images/icons/social/wechat.svg', ImageSourceType.ASSET),
  WHATSAPP: prepareImageUrl('/images/icons/social/whatsapp.svg', ImageSourceType.ASSET),
  WIKIPEDIA: prepareImageUrl('/images/icons/social/wikipedia.svg', ImageSourceType.ASSET),
  YELP: prepareImageUrl('/images/icons/social/yelp.svg', ImageSourceType.ASSET),
  YOUTUBE: prepareImageUrl('/images/icons/social/youtube.svg', ImageSourceType.ASSET),
  GLOBE: prepareImageUrl('/images/icons/social/globe.svg', ImageSourceType.ASSET),
  PWA: prepareImageUrl('/images/icons/social/pwa.svg', ImageSourceType.ASSET),
  FORM: prepareImageUrl('/images/icons/social/form.svg', ImageSourceType.ASSET),
  REFRESH: prepareImageUrl('/images/icons/social/refresh.svg', ImageSourceType.ASSET),
}

export const REGEX_MAP = {
  NAME: /^[^0-9]{3,50}$/,
  EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD: /^[a-zA-Z0-9]{3,30}$/,
  PHONE_NUMBER: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  ADDRESS_LINE: /^.{1,100}$/,
  NOT_EMPTY: /(.|\s)*\S(.|\s)*/,
  ADDRESS_TYPE: /(HOME|WORK|OTHER)/,
}

export const ADDRESS_NAME_MAP = {
  [UserAddressType.HOME]: 'Home',
  [UserAddressType.WORK]: 'Work',
  [UserAddressType.OTHER]: 'Other',
  [UserAddressType.NONE]: '',
}

export const QUERY_PARAM_MAP = {
  BACK_PAGE_URL: 'backPageUrl',

  // signup
  SIGNUP_NAME: 'signupName',
  SIGNUP_EMAIL: 'signupEmail',
  SIGNUP_SOURCE: 'signupSource',

  // address
  ADD_ADDRESS: 'addAddress',
}

export const IMAGE_VARIANTS = appConfig.integrations.imageTransformation.variants

export enum VibratePatternType {
  SHORT = 100,
  DEFAULT = 200,
  LONG = 500,
}
