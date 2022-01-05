import React from 'react'
import { IProductFeatureSectionInfo } from '../../contract/product'
import { filterInactiveItem } from '../../utils/common'
import classnames from 'classnames'
import { ChevronDownIcon } from '@heroicons/react/solid'
import EscapeHTML from '../EscapeHTML'
import Collapsible from '../Collapsible'

interface IProductFeatureSectionsProps {
  productFeatureSections: IProductFeatureSectionInfo[]
}

const ProductFeatureSections: React.FC<IProductFeatureSectionsProps> = props => {
  const { productFeatureSections } = props

  const activeFeatureSections = filterInactiveItem<IProductFeatureSectionInfo>(productFeatureSections)

  if (!activeFeatureSections.length) {
    return null
  }

  const mappedFeatureSections = activeFeatureSections.map((activeFeatureSection, index) => {
    return (
      <div
        key={index}
        className={classnames('product-feature-section border-b border-gray400', {
          'border-t': index === 0,
        })}>
        <Collapsible
          trigger={
            <div
              className={classnames(
                'flex justify-between items-start font-medium font-primary-medium text-lg text-primaryTextBold py-4 cursor-pointer'
              )}>
              <div className="flex-grow pr-2">{activeFeatureSection.title}</div>
              <ChevronDownIcon className="max-w-6 w-6 text-primaryTextBold collapsible-chevron-icon" />
            </div>
          }
          transitionTime={300}>
          <div className="html-body pb-4">
            <EscapeHTML html={activeFeatureSection.body} element="div" />
          </div>
        </Collapsible>
      </div>
    )
  })

  return <div className="p-4">{mappedFeatureSections}</div>
}

export default ProductFeatureSections
