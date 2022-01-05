import { IDeviceInfo } from '../components/ApplicationContext'
import { ImageSourceType } from '../components/core/CoreImage'
import appConfig from '../config/appConfig'
import { prepareImageUrl } from './image'

export enum SOCIAL_SHARE_TYPE {
  FACEBOOK = 'FACEBOOK',
  WHATSAPP = 'WHATSAPP',
  TWITTER = 'TWITTER',
  MESSENGER = 'MESSENGER',
}

export interface ISocialShare {
  [type: string]: {
    name: string
    imageUrl: string
    url: string
  }
}

export const getSocialShares = (device: IDeviceInfo): ISocialShare => {
  const whatsAppUrlMobile = `whatsapp://send?text={{TEXT}}%20{{URL}}`
  const whatsAppUrlDesktop = `https://api.whatsapp.com/send?text={{TEXT}}%20%{{URL}}`

  const fbAppId = appConfig.integrations.facebookLogIn.code

  const WHATSAPP = {
    name: 'WhatsApp',
    imageUrl: prepareImageUrl('/images/icons/share/whatsapp.svg', ImageSourceType.ASSET),
    url: device.isMobile ? whatsAppUrlMobile : whatsAppUrlDesktop,
  }

  const FACEBOOK = {
    name: 'Facebook',
    imageUrl: prepareImageUrl('/images/icons/share/facebook.svg', ImageSourceType.ASSET),
    url: `https://www.facebook.com/dialog/share?href={{URL}}&app_id=${fbAppId}&display=${
      device.isMobile ? 'popup' : 'page'
    }&redirect_uri={{URL}}`,
  }

  const TWITTER = {
    name: 'Twitter',
    imageUrl: prepareImageUrl('/images/icons/share/twitter.svg', ImageSourceType.ASSET),
    url: `https://twitter.com/intent/tweet?lang=en&url={{URL}}&text={{TEXT}}`,
  }

  const messengerUrlMobile = `fb-messenger://share?link={{URL}}&app_id=${fbAppId}`
  const messengerUrlDesktop = `https://facebook.com/dialog/send?link={{URL}}&redirect_uri={{URL}}&app_id=${fbAppId}`

  const MESSENGER = {
    name: 'Messenger',
    imageUrl: prepareImageUrl('/images/icons/share/facebook-messenger.svg', ImageSourceType.ASSET),
    url: device.isMobile ? messengerUrlMobile : messengerUrlDesktop,
  }

  return {
    WHATSAPP: WHATSAPP,
    FACEBOOK: FACEBOOK,
    TWITTER: TWITTER,
    MESSENGER: MESSENGER,
  }
}
