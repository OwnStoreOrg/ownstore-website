import React from 'react'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import classnames from 'classnames'
import EscapeHTML from '../EscapeHTML'
import { useRouter } from 'next/router'
import { ProductType } from '../../contract/constants'
import { IComboProductInfo, IIndividualProductInfo, IProductInfo } from '../../contract/product'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { getProductPageUrl, getComboPageUrl, getProductHighlightText, shouldDisableProduct } from '../../utils/product'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { prepareProductAnalyticsParams } from '../../utils/analytics'
import { handleThumbnailImageError, prepareImageUrl } from '../../utils/image'

export enum ProductInfoLayoutType {
  INLINE = 'INLINE',
  BLOCK = 'BLOCK',
}

interface IProps {
  product: IProductInfo
  layout: ProductInfoLayoutType
}

const ProductInfoInline: React.FC<IProps> = props => {
  const { product } = props

  const isComboProduct = product.type === ProductType.COMBO

  const productInfo = isComboProduct ? (product as IComboProductInfo) : (product as IIndividualProductInfo)

  const onDiscount = productInfo.sku.onSale

  return (
    <div className="w-full cursor-pointer flex items-center justify-between py-2 transition-all hover:bg-gray100 rounded-md group relative select-none">
      <div className="flex items-center w-[95%]">
        <div className="overflow-hidden rounded-lg w-14">
          <CoreImage
            url={
              productInfo.images[0]?.url
                ? prepareImageUrl(productInfo.images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_150)
                : APP_LOGO.DEFAULT
            }
            onError={handleThumbnailImageError}
            alt={productInfo.name}
            className="rounded-lg min-h-14"
          />
        </div>
        <div className="w-[80%] ml-2">
          <div className="text-primaryTextBold font-medium font-primary-medium text-sm lg:text-base truncate">
            {productInfo.name}
          </div>

          <div className="flex items-center mt-1">
            {onDiscount ? (
              <span className="text-xxs md:text-xs mr-1 line-through">
                <EscapeHTML html={productInfo.sku.currency.symbol} element="span" />
                {productInfo.sku.salePrice}
              </span>
            ) : null}
            <span className="text-xs lg:text-sm text-primaryTextBold font-medium font-primary-medium">
              <EscapeHTML html={productInfo.sku.currency.symbol} element="span" />
              {productInfo.sku.retailPrice}
            </span>
            {onDiscount ? (
              <CoreImage
                url={prepareImageUrl('/images/icons/sale-icon.svg', ImageSourceType.ASSET)}
                alt="Sale"
                className="relative ml-1 top-[-2px] w-4 min-h-4"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="w-5 absolute right-0 top-1/2 transform -translate-y-1/2">
        <ChevronRightIcon className="transform transition-transform group-hover:scale-110" />
      </div>
    </div>
  )
}

const ProductInfoBlock: React.FC<IProps> = props => {
  const { product } = props

  const isComboProduct = product.type === ProductType.COMBO

  const productInfo = isComboProduct ? (product as IComboProductInfo) : (product as IIndividualProductInfo)

  const { name, sku, isActive, images } = productInfo
  const onDiscount = sku.onSale

  const showHighlight = shouldDisableProduct(product)

  return (
    <div className="w-full cursor-pointer group select-none">
      <div className="mb-3 relative">
        <div className="overflow-hidden rounded-lg">
          <CoreImage
            url={
              images[0]?.url
                ? prepareImageUrl(productInfo.images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_300)
                : APP_LOGO.DEFAULT
            }
            alt={name}
            className={classnames(
              'w-full min-h-36 md:min-h-40 xl:min-h-52 rounded-lg transform transition-all group-hover:scale-110',
              {
                'opacity-70': showHighlight,
              }
            )}
            onError={handleThumbnailImageError}
          />
        </div>

        {showHighlight ? (
          <div
            className={classnames(
              'bg-white text-primary uppercase py-2 px-2 text-xxs lg:text-xs absolute top-3 left-0 right-0 mx-auto text-center max-w-7/12 font-bold font-primary-bold rounded'
            )}>
            {getProductHighlightText(productInfo)}
          </div>
        ) : null}

        {onDiscount ? (
          <div className="text-moodyBlue bg-whisper text-xs uppercase flex justify-center py-2 rounded-b-lg lg:rounded-lg absolute bottom-0 w-full lg:w-auto lg:text-sm lg:p-2 lg:bottom-3 lg:left-3 font-primary-bold items-center">
            <CoreImage
              url={prepareImageUrl('/images/icons/sale-icon.svg', ImageSourceType.ASSET)}
              alt="Sale"
              className="relative w-5 min-h-5 top-[-2px] lg:top-[-3px] mr-[2px]"
            />
            <span>
              {sku.saleDiscountFlat ? (
                <span>
                  <span className="text-sm lg:text-base font-bold">{sku.currency.symbol}</span>
                  {sku.saleDiscountFlat} off
                </span>
              ) : (
                <span>{sku.saleDiscountPercentage}% off</span>
              )}
            </span>
          </div>
        ) : null}
      </div>

      <div>
        <div className="text-primaryTextBold text-sm lg:text-base font-medium font-primary-medium">{name}</div>

        <div className="flex justify-between items-center">
          <div>
            {onDiscount ? (
              <span className="text-xxs md:text-xs mr-1 line-through">
                <EscapeHTML html={sku.currency.symbol} element="span" />
                {sku.retailPrice}
              </span>
            ) : null}
            <span className="text-xs lg:text-sm text-primaryTextBold font-medium font-primary-medium">
              <EscapeHTML html={sku.currency.symbol} element="span" />
              {sku.salePrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductInfo: React.FC<IProps> = props => {
  const router = useRouter()

  const pageUrl =
    props.product.type === ProductType.INDIVIDUAL
      ? getProductPageUrl(props.product as IIndividualProductInfo)
      : getComboPageUrl(props.product as IComboProductInfo)

  const productInfo = props.product as IIndividualProductInfo | IComboProductInfo

  const handleProductClick = () => {
    appAnalytics.sendEvent({
      action: AnalyticsEventType.SELECT_PRODUCT,
      extra: {
        ...prepareProductAnalyticsParams({
          items: [{ product: props.product, quantity: 1 }],
          value: productInfo.sku.salePrice,
        }),
        content_type: 'product',
      },
    })
    router.push(pageUrl)
  }

  if (props.layout === ProductInfoLayoutType.BLOCK) {
    return (
      <div onClick={handleProductClick}>
        <ProductInfoBlock {...props} />
      </div>
    )
  }

  if (props.layout === ProductInfoLayoutType.INLINE) {
    return (
      <div onClick={handleProductClick}>
        <ProductInfoInline {...props} />
      </div>
    )
  }
  return null
}

export default ProductInfo
