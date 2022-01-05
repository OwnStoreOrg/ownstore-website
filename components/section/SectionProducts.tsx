import React from 'react'
import SectionWrapper from './SectionWrapper'
import DeviceSlider from '../DeviceSlider'
import ProductInfo, { ProductInfoLayoutType } from '../product/ProductInfo'
import { filterInactiveItem } from '../../utils/common'
import { getSectionPageUrl } from '../../utils/section'
import { useRouter } from 'next/router'
import { IProductSectionInfo, ISectionInfoProducts } from '../../contract/section'

interface ISectionProductsProps {
  sectionProducts: ISectionInfoProducts
}

const SectionProducts: React.FC<ISectionProductsProps> = props => {
  const { sectionProducts } = props
  const activeProductSections = filterInactiveItem<IProductSectionInfo>(sectionProducts.products)

  const router = useRouter()

  const linkUrl = getSectionPageUrl(sectionProducts)

  return (
    <SectionWrapper
      title={sectionProducts.title}
      subTitle={sectionProducts.subTitle}
      linkUrl={sectionProducts.showMoreUrl ? linkUrl : undefined}
      className="productSectionSlider">
      <DeviceSlider
        sliderConfig={{
          slidesToShow: 4,
          slidesToScroll: 3,
          arrows: true,
        }}>
        {activeProductSections.map((section, index) => {
          return (
            <div key={index} className="w-52 mx-2">
              <ProductInfo layout={ProductInfoLayoutType.BLOCK} product={section.productInfo} />
            </div>
          )
        })}
      </DeviceSlider>
    </SectionWrapper>
  )
}

export default SectionProducts
