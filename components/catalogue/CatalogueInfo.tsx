import React from 'react'
import { ICatalogueInfo } from '../../contract/catalogue'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import { useRouter } from 'next/router'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { getCataloguePageUrl } from '../../utils/catalogue'
import { handleThumbnailImageError } from '../../utils/image'
import { prepareImageUrl } from '../../utils/image'

export enum CatalogueInfoLayoutType {
  INLINE = 'INLINE',
  BLOCK = 'BLOCK',
}

interface ICatalogueInfoProps {
  catalogue: ICatalogueInfo
  layout: CatalogueInfoLayoutType
}

const CatalogueInfoInline: React.FC<ICatalogueInfoProps> = props => {
  const { catalogue: catalogueInfo } = props
  return (
    <div className="w-full cursor-pointer flex items-center justify-between py-2 transition-all hover:bg-gray100 rounded-md group">
      <div className="flex items-center w-[90%]">
        <div className="overflow-hidden rounded-lg w-14">
          <CoreImage
            url={
              catalogueInfo.images[0]?.url
                ? prepareImageUrl(catalogueInfo.images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_150)
                : APP_LOGO.DEFAULT
            }
            alt={catalogueInfo.name}
            onError={handleThumbnailImageError}
            className="rounded-lg transform transition-transform group-hover:scale-105 min-h-14"
          />
        </div>
        <div className="text-primaryTextBold font-medium font-primary-medium ml-2 text-sm lg:text-base w-[80%]">
          {catalogueInfo.name}
        </div>
      </div>
      <div className="w-5">
        <ChevronRightIcon className="transform transition-transform group-hover:scale-110" />
      </div>
    </div>
  )
}

const CatalogueInfoBlock: React.FC<ICatalogueInfoProps> = props => {
  const { catalogue: catalogueInfo } = props
  return (
    <div className="flex flex-col justify-center items-center cursor-pointer group">
      <div className="overflow-hidden rounded-full">
        <CoreImage
          url={
            catalogueInfo.images[0]?.url
              ? prepareImageUrl(catalogueInfo.images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_300)
              : APP_LOGO.DEFAULT
          }
          alt={`${catalogueInfo.name}`}
          onError={handleThumbnailImageError}
          className="rounded-full transform transition-transform group-hover:scale-105"
        />
      </div>
      <div className="mt-2 text-primaryTextBold text-sm lg:text-base font-medium font-primary-medium">
        {catalogueInfo.name}
      </div>
    </div>
  )
}

const CatalogueInfo: React.FC<ICatalogueInfoProps> = props => {
  const { layout, catalogue: catalogueInfo } = props

  const router = useRouter()

  const handleCatalogueClick = () => {
    router.push(getCataloguePageUrl(catalogueInfo))
  }

  if (layout === CatalogueInfoLayoutType.INLINE) {
    return (
      <div onClick={handleCatalogueClick}>
        <CatalogueInfoInline {...props} />
      </div>
    )
  }

  if (layout === CatalogueInfoLayoutType.BLOCK) {
    return (
      <div onClick={handleCatalogueClick}>
        <CatalogueInfoBlock {...props} />
      </div>
    )
  }

  return null
}

export default CatalogueInfo
