import React, { useContext, useState } from 'react'
import { IComboProductDetail, IIndividualProductDetail } from '../../contract/product'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import EscapeHTML from '../EscapeHTML'
import ProductTags from './ProductTags'
import classnames from 'classnames'
import CoreLink from '../core/CoreLink'
import { getCataloguePageUrl } from '../../utils/catalogue'
import useNativeShare from '../../hooks/useNativeShare'
import { InboxInIcon, ShareIcon } from '@heroicons/react/outline'
import appConfig from '../../config/appConfig'
import ApplicationContext from '../ApplicationContext'
import { ProductType } from '../../contract/constants'
import ProductShareModal from './ProductShareModal'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { getCartItemFromProduct, getCartPageUrl } from '../../utils/cart'
import { useRouter } from 'next/router'
import { ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/react/solid'
import { prepareImageUrl } from '../../utils/image'

interface IProductNameAndPriceProps {
  productDetail: IIndividualProductDetail | IComboProductDetail
  urlPath: string
}

const ProductNameAndPrice: React.FC<IProductNameAndPriceProps> = props => {
  const { productDetail, urlPath } = props
  const { id, type, name, sku, tags } = productDetail

  const { showNativeShare, nativeShareUrl, nativeShareFailed, toggleNativeShareFailed } = useNativeShare()
  const [showShareModal, toggleShareModal] = useState(false)

  const applicationContext = useContext(ApplicationContext)
  const {
    cart,
    device: { isMobile },
  } = applicationContext

  const router = useRouter()

  const onDiscount = sku.onSale

  const isIndividualProduct = productDetail.type === ProductType.INDIVIDUAL

  const comboProductDetail = productDetail as IComboProductDetail
  const individualProductDetail = productDetail as IIndividualProductDetail

  const shareUrl = `${appConfig.global.baseUrl}${urlPath}`
  const shareText = appConfig.share.product.title
    .replace('{{PRODUCT_NAME}}', name)
    .replace('{{PRODUCT_URL}}', `${shareUrl}`)

  const productInCart = getCartItemFromProduct(cart?.cartItems || [], productDetail)

  const handleShareIconClick = () => {
    if (showNativeShare && isMobile) {
      nativeShareUrl({
        text: shareText,
        url: shareUrl,
      })
      appAnalytics.sendEvent({
        action: AnalyticsEventType.SHARE,
        extra: {
          method: 'Native',
          content_type: `${type} PRODUCT`.toLowerCase(),
          item_id: id,
        },
      })
      return
    } else {
      toggleShareModal(true)
    }
  }

  return (
    <React.Fragment>
      <div className="px-4">
        <ProductTags productTags={tags} />

        <div className="flex justify-between items-center">
          <div>
            {isIndividualProduct ? (
              <div className="text-gray font-medium font-primary-medium text-xs uppercase mb-1 transition-all">
                <CoreLink url={getCataloguePageUrl(individualProductDetail.catalogue)} className="hover:underline">
                  {individualProductDetail.catalogue.name}
                </CoreLink>
              </div>
            ) : (
              <div className="text-gray font-medium font-primary-medium text-xs uppercase mb-1 transition-all">
                <span>Combo</span>
              </div>
            )}
          </div>

          <div className="cursor-pointer" onClick={handleShareIconClick} title="Share">
            <ShareIcon className="w-6" />
          </div>
        </div>

        <div
          className={classnames('text-primaryTextBold text-lg font-primary-medium font-medium', [
            onDiscount ? 'mb-1' : 'mb-0',
          ])}>
          <span className="inline">{name}</span>
          {productInCart ? (
            <span title="This product is in your cart">
              <ShoppingCartIcon
                className="w-6 text-primaryText ml-1 cursor-pointer inline"
                onClick={() => router.push(getCartPageUrl())}
              />
            </span>
          ) : null}
        </div>

        <div className="flex items-center">
          <div className="text-lg text-primaryTextBold font-medium font-primary-medium mr-2">
            <EscapeHTML html={sku.currency.symbol} element="span" className="font-bold" />
            {sku.salePrice}
          </div>

          {onDiscount ? (
            <React.Fragment>
              <div className="text-sm line-through mr-2">
                <EscapeHTML html={sku.currency.symbol} element="span" />
                {sku.retailPrice}
              </div>

              <div className="flex items-center bg-whisper text-moodyBlue uppercase font-bold font-primary-medium px-1 py-1 rounded-md text-xs">
                <CoreImage
                  url={prepareImageUrl('/images/icons/sale-icon.svg', ImageSourceType.ASSET)}
                  alt="Sale"
                  className="relative w-5 top-[-3px]"
                />
                <div className="ml-1">
                  {sku.saleDiscountFlat ? (
                    <span>
                      <span className="">{sku.currency.symbol}</span>
                      {sku.saleDiscountFlat} off
                    </span>
                  ) : (
                    <span>{sku.saleDiscountPercentage}% off</span>
                  )}
                </div>
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </div>

      {showShareModal ? (
        <ProductShareModal
          productDetail={productDetail}
          shareUrl={shareUrl}
          shareText={shareText}
          toggleModal={toggleShareModal}
        />
      ) : null}

      {nativeShareFailed ? (
        <ProductShareModal
          productDetail={productDetail}
          shareUrl={shareUrl}
          shareText={shareText}
          toggleModal={toggleNativeShareFailed}
        />
      ) : null}
    </React.Fragment>
  )
}

export default ProductNameAndPrice
