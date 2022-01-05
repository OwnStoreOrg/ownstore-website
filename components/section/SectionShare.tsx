import React, { useContext, useState } from 'react'
import CoreImage from '../core/CoreImage'
import ApplicationContext from '../ApplicationContext'
import { getSocialShares } from '../../utils/share'
import { getHomePageUrl } from '../../utils/home'
import appConfig from '../../config/appConfig'
import { ClipboardIcon as ClipboardIconOutline } from '@heroicons/react/outline'
import { ClipboardIcon as ClipboardIconSolid, ShareIcon } from '@heroicons/react/solid'
import { copyToClipboard } from '../../utils/common'
import useNativeShare from '../../hooks/useNativeShare'
import { ISectionInfo } from '../../contract/section'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'

interface ISectionShare {
  section: ISectionInfo
}

const SectionShare: React.FC<ISectionShare> = props => {
  const { section } = props

  const applicationContext = useContext(ApplicationContext)
  const { device } = applicationContext

  const [copied, toggleCopied] = useState(false)
  const { showNativeShare, nativeShareUrl, nativeShareFailed } = useNativeShare()

  const socialShares = getSocialShares(device)

  const SOCIAL_SHARE_TYPES = [
    socialShares.WHATSAPP,
    socialShares.FACEBOOK,
    socialShares.TWITTER,
    socialShares.MESSENGER,
  ]

  const text = appConfig.share.section.title
  const url = `${appConfig.global.baseUrl}${getHomePageUrl()}`

  const handleSocialShareClick = (shareType: any) => {
    const finalUrl = shareType.url.replace(/{{URL}}/gi, url).replace(/{{TEXT}}/gi, text)
    window.open(finalUrl, shareType.name, 'height=500,width=500')
    appAnalytics.sendEvent({
      action: AnalyticsEventType.SHARE,
      extra: {
        content_type: 'Section',
        item_id: null,
        method: shareType.name,
      },
    })
  }

  const copyUrl = () => {
    toggleCopied(true)
    copyToClipboard(url)
  }

  const shareUrl = () => {
    nativeShareUrl({
      url: url,
      text: text,
    })
    appAnalytics.sendEvent({
      action: AnalyticsEventType.SHARE,
      extra: {
        content_type: 'Section',
        item_id: null,
        method: 'Native',
      },
    })
  }

  const renderCopyIcon = () => (
    <div
      className="w-7 cursor-pointer transform transition-transform hover:scale-105 lg:w-8 m-2 md:mx-5"
      title={`Copy`}
      onClick={copyUrl}>
      {copied ? <ClipboardIconSolid /> : <ClipboardIconOutline />}
    </div>
  )

  const renderNativeShareIcon = () => (
    <div
      className="w-7 cursor-pointer transform transition-transform hover:scale-105 lg:w-8 m-2 md:mx-5"
      title={`Share`}
      onClick={shareUrl}>
      <ShareIcon />
    </div>
  )

  return (
    <div className="bg-whisper py-6 px-3 md:py-6 md:px-6 lg:py-8 lg:px-8 lg:shadow lg:rounded">
      <div className="bg-white p-4 md:py-6 md:px-5 rounded-lg md:flex md:justify-between md:items-center">
        <div className="mx-2 mb-3">
          <div className="text-primaryTextBold font-medium font-primary-medium md:text-lg">Wanna share?</div>
          <div className="text-sm md:text-base">Tell your friends, family & neighbours</div>
        </div>
        <div className="flex justify-between">
          {SOCIAL_SHARE_TYPES.map((socialShareType, index) => (
            <div
              key={index}
              className="w-7 cursor-pointer transform transition-transform hover:scale-105 lg:w-8 m-2 md:mx-5"
              title={`Share on ${socialShareType.name}`}
              onClick={e => handleSocialShareClick(socialShareType)}>
              <CoreImage url={socialShareType.imageUrl} alt={socialShareType.name} />
            </div>
          ))}

          {showNativeShare ? (
            <React.Fragment>{nativeShareFailed ? renderCopyIcon() : renderNativeShareIcon()}</React.Fragment>
          ) : (
            renderCopyIcon()
          )}
        </div>
      </div>
    </div>
  )
}

export default SectionShare
