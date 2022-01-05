import React, { useContext, useState } from 'react'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import { IComboProductDetail, IIndividualProductDetail } from '../../contract/product'
import { copyToClipboard, filterInactiveItem } from '../../utils/common'
import { getSocialShares } from '../../utils/share'
import ApplicationContext from '../ApplicationContext'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import { ClipboardIcon as ClipboardIconOutline } from '@heroicons/react/outline'
import { ClipboardIcon as ClipboardIconSolid } from '@heroicons/react/solid'
import Modal from '../modal/Modal'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { ProductType } from '../../contract/constants'
import { handleThumbnailImageError } from '../../utils/image'
import { prepareImageUrl } from '../../utils/image'
import FullWidthModal from '../modal/FullWidthModal'

interface IProductShareModalProps {
  productDetail: IIndividualProductDetail | IComboProductDetail
  shareUrl: string
  shareText: string
  toggleModal: (val: boolean) => void
}

const ProductShareModal: React.FC<IProductShareModalProps> = props => {
  const { productDetail, shareUrl, shareText, toggleModal } = props

  const { id, images, name, type } = productDetail

  const [linkCopied, toggleLinkCopied] = useState(false)

  const applicationContext = useContext(ApplicationContext)
  const { device } = applicationContext

  const socialShares = getSocialShares(device)
  const SHARE_TYPES = [socialShares.WHATSAPP, socialShares.FACEBOOK, socialShares.TWITTER, socialShares.MESSENGER]

  const handleSocialShareClick = (shareType: any) => {
    const finalUrl = shareType.url.replace(/{{URL}}/gi, shareUrl).replace(/{{TEXT}}/gi, shareText)
    window.open(finalUrl, shareType.name, 'height=500,width=500')
    appAnalytics.sendEvent({
      action: AnalyticsEventType.SHARE,
      extra: {
        content_type: `${type} PRODUCT`.toLowerCase(),
        item_id: id,
        method: shareType.name,
      },
    })
  }

  return (
    <Modal
      {...{
        dismissModal: () => toggleModal(false),
        title: 'Share',
      }}
      className="shareProductModalOverrides">
      <div className="p-4">
        <div className="flex flex-col items-center">
          <CoreImage
            url={
              images[0]?.url
                ? prepareImageUrl(images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_500)
                : APP_LOGO.DEFAULT
            }
            onError={handleThumbnailImageError}
            alt={name}
            className="rounded-lg shareProductModalImage shadow"
            disableLazyload
          />
          <div className="text-primaryTextBold font-medium font-primary-medium text-lg mt-6 lg:mt-2 text-center lg:text-left">
            {name}
          </div>
        </div>
        <div className="flex justify-center mt-8 pb-6">
          {SHARE_TYPES.map((shareType, index) => (
            <div
              key={index}
              className="w-8 cursor-pointer transform transition-transform hover:scale-105 mx-4"
              title={`Share on ${shareType.name}`}
              onClick={e => handleSocialShareClick(shareType)}>
              <CoreImage url={shareType.imageUrl} alt={shareType.name} />
            </div>
          ))}
          <div
            className="w-8 cursor-pointer transform transition-transform hover:scale-105 mx-4"
            title={linkCopied ? 'Link copied' : 'Copy link'}
            onClick={() => {
              copyToClipboard(shareUrl)
              toggleLinkCopied(true)
            }}>
            {linkCopied ? <ClipboardIconSolid /> : <ClipboardIconOutline />}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProductShareModal
