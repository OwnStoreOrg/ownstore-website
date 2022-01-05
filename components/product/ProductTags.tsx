import {
  BadgeCheckIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
} from '@heroicons/react/solid'
import React from 'react'
import { ProductTagIconType } from '../../contract/constants'
import { IProductTagInfo } from '../../contract/product'
import { filterInactiveItem } from '../../utils/common'

const ICON_MAP = {
  [ProductTagIconType.STAR]: StarIcon,
  [ProductTagIconType.TAG]: TagIcon,
  [ProductTagIconType.VERIFIED]: BadgeCheckIcon,
  [ProductTagIconType.SPARKLE]: SparklesIcon,
  [ProductTagIconType.LIGHTNING_BOLT]: LightningBoltIcon,
  [ProductTagIconType.GLOBE]: GlobeAltIcon,
  [ProductTagIconType.NONE]: null,
}

interface IProductTagsProps {
  productTags: IProductTagInfo[]
}

const ProductTags: React.FC<IProductTagsProps> = props => {
  const { productTags } = props

  const activeProductTags = filterInactiveItem<IProductTagInfo>(productTags)

  if (!activeProductTags.length) {
    return null
  }

  return (
    <div className="flex flex-wrap mb-4">
      {activeProductTags.map((productTag, index) => {
        const IconComponent = ICON_MAP[productTag.iconType]

        return (
          <div key={index} className="flex items-start font-medium font-primary-medium text-primary text-sm mr-4 mb-2">
            {IconComponent ? <IconComponent className="w-5" /> : null}
            <span className="ml-1">{productTag.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default ProductTags
