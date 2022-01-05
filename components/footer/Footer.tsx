import React from 'react'
import appConfig from '../../config/appConfig'
import CoreLink from '../core/CoreLink'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import EscapeHTML from '../EscapeHTML'
import { SOCIAL_ICONS_SRC_MAP } from '../../constants/constants'
import { prepareImageUrl } from '../../utils/image'

interface IFooterProps {}

const Footer: React.FC<IFooterProps> = props => {
  return (
    <footer>
      <div className="bg-white h-8 md:h-10"></div>

      <div className="bg-whisper px-4 py-6 lg:py-8 shadow-inner">
        <div className="container mx-auto">
          <div className="lg:flex justify-between items-start">
            <div className="flex flex-col">
              <div>
                <div className="text-mineShaft font-medium font-primary-medium mb-2">{appConfig.global.app.name}</div>
                <div className="flex flex-col lg:flex-row text-primaryText text-sm font-medium">
                  {appConfig.footer.links.map((link, index) => (
                    <CoreLink key={index} url={link.url} className="py-1 lg:py-0 lg:mr-2">
                      {link.label}
                    </CoreLink>
                  ))}
                </div>
              </div>

              {appConfig.features.enableAppPromotions ? (
                <div className="mt-4 lg:mt-6">
                  <div className="flex">
                    <CoreLink url={appConfig.app.android.storeUrl}>
                      <CoreImage
                        url={prepareImageUrl('/images/google-play-store.png', ImageSourceType.ASSET)}
                        alt={`${appConfig.global.app.name} Android app`}
                        className="h-11 mr-1"
                      />
                    </CoreLink>
                    <CoreLink url={appConfig.app.iOS.storeUrl}>
                      <CoreImage
                        url={prepareImageUrl('/images/apple-app-store.png', ImageSourceType.ASSET)}
                        alt={`${appConfig.global.app.name} iOS app`}
                        className="h-11"
                      />
                    </CoreLink>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6 lg:mt-0">
              <div className="text-mineShaft font-medium font-primary-medium mb-2">Stay in touch</div>
              <div className="flex">
                {appConfig.company.socialLinks.map((socialLink, index) => {
                  const socialIconSrc = SOCIAL_ICONS_SRC_MAP[socialLink.type] || SOCIAL_ICONS_SRC_MAP.GLOBE

                  return (
                    <CoreLink
                      key={index}
                      url={socialLink.url}
                      isExternal={socialLink.isExternal}
                      className="w-6 mr-5 transform transition-transform hover:scale-110"
                      title={`${socialLink.name}`}>
                      <CoreImage url={socialIconSrc} alt={socialLink.name} useTransparentPlaceholder />
                    </CoreLink>
                  )
                })}
              </div>
            </div>
          </div>

          {appConfig.footer.copyrightText ? (
            <div className="mt-10 text-sm lg:mt-8">
              <EscapeHTML html={appConfig.footer.copyrightText} element="span" />
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}

export default Footer
