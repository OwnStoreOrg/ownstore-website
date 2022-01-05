import React, { useState } from 'react'
import {
  IComboProductDetail,
  IComboProductInfo,
  IIndividualProductDetail,
  IIndividualProductInfo,
  IProductsRelationInfo,
} from '../../contract/product'
import { filterInactiveItem } from '../../utils/common'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import CoreLink from '../core/CoreLink'
import classnames from 'classnames'
import { getProductPageUrl, getComboPageUrl } from '../../utils/product'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import { ProductType } from '../../contract/constants'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import Modal from '../modal/Modal'
import { handleThumbnailImageError, prepareImageUrl } from '../../utils/image'

interface IProductRelatedProductsProps {
  productsRelation: IProductsRelationInfo
  invidiualProductDetail?: IIndividualProductDetail
  comboProductDetail?: IComboProductDetail
}

const ProductRelatedProducts: React.FC<IProductRelatedProductsProps> = props => {
  const { productsRelation, invidiualProductDetail, comboProductDetail } = props
  const products = productsRelation.products

  const [showDescription, toggleDescription] = useState(false)

  const mappedRelatedProducts = products.map((product, index) => {
    const isCombo = product.type === ProductType.COMBO

    const pageUrl =
      product.type === ProductType.INDIVIDUAL
        ? getProductPageUrl(product as IIndividualProductInfo)
        : getComboPageUrl(product as IComboProductInfo)

    const productInfo = product as IIndividualProductInfo | IComboProductInfo

    return (
      <CoreLink key={index} url={pageUrl} className="">
        <CoreImage
          url={
            productInfo.images[0]?.url
              ? prepareImageUrl(productInfo.images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_150)
              : APP_LOGO.DEFAULT
          }
          alt={productInfo.name}
          onError={handleThumbnailImageError}
          className={classnames('rounded', {
            'ring-2 ring-primary border border-white': isCombo
              ? (product as IComboProductInfo).id === comboProductDetail?.id
              : (product as IIndividualProductInfo).id === invidiualProductDetail?.id,
          })}
        />
      </CoreLink>
    )
  })

  return (
    <div>
      <div className="px-4 py-2">
        <div className="font-medium mb-2">
          <span>{productsRelation.name}</span>
          {productsRelation.description ? (
            <ExclamationCircleIcon
              className="w-5 cursor-pointer ml-[2px] inline relative top-[-2px] transition-all hover:scale-105"
              onClick={() => toggleDescription(true)}
            />
          ) : null}
        </div>
        <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-5 gap-2">{mappedRelatedProducts}</div>
      </div>

      {showDescription ? (
        <Modal dismissModal={() => toggleDescription(false)} title="About this relation">
          <div className="px-3 pb-2">{productsRelation.description}</div>
        </Modal>
      ) : null}
    </div>
  )
}

export default ProductRelatedProducts
