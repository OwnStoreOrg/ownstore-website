import React from 'react'
import {
  ISectionInfo,
  ISectionInfoCatalogues,
  ISectionInfoBlogs,
  ISectionInfoUSPs,
  ISectionInfoProcedures,
  ISectionInfoCustomerFeedbacks,
  ISectionInfoCustom,
  ISectionInfoFullWidthSlides,
  ISectionInfoStrictWidthSlides,
  ICatalogueSectionInfo,
  IBlogSectionInfo,
  ISectionInfoProducts,
  IProductSectionInfo,
} from '../../contract/section'
import { SectionType } from '../../contract/constants'
import { filterInactiveItem } from '../../utils/common'
import NoContent from '../NoContent'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { getHomePageUrl } from '../../utils/home'
import ProductInfo, { ProductInfoLayoutType } from '../product/ProductInfo'
import { ICatalogueInfo } from '../../contract/catalogue'
import CatalogueInfo, { CatalogueInfoLayoutType } from '../catalogue/CatalogueInfo'
import { IBlogInfo } from '../../contract/blog'
import BlogInfo from '../blog/BlogInfo'
import SectionUSP from './SectionUSP'
import SectionProcedures from './SectionProcedures'
import CoreDivider from '../core/CoreDivider'
import SectionCustomerFeedbacks from './SectionCustomerFeedbacks'
import SectionShare from './SectionShare'
import SectionCustom from './SectionCustom'
import SectionSlides from './SectionSlides'
import { IComboProductInfo, IIndividualProductInfo } from '../../contract/product'

interface IBlockSectionProps {
  section: ISectionInfo
  showNoContentWhenEmpty?: boolean
  noContentMessage?: string
  gridCols?: {
    mobile: number
    tablet: number
    desktop: number
  }
  renderTitle?: (section: ISectionInfo) => React.ReactNode
}

const BlockSection: React.FC<IBlockSectionProps> = props => {
  const {
    section,
    showNoContentWhenEmpty = false,
    noContentMessage = 'Looks like the section has no items.',
    gridCols,
    renderTitle: _renderTitle,
  } = props

  const { mobile = 2, tablet = 3, desktop = 5 } = gridCols || {}

  const renderNoContent = () => (
    <div className="flex justify-center">
      <div className="lg:w-1/2">
        <NoContent message={noContentMessage} />
        <div className="text-center">
          <CoreButton
            label="View products"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            url={getHomePageUrl()}
          />
        </div>
      </div>
    </div>
  )

  const renderTitle = () => {
    if (_renderTitle) {
      return _renderTitle(section)
    }
    return null
  }

  const renderProductSections = () => {
    const sectionProducts = section as ISectionInfoProducts
    const activeProductSections = filterInactiveItem<IProductSectionInfo>(sectionProducts.products).filter(
      catalogueSection => (catalogueSection.productInfo as IIndividualProductInfo | IComboProductInfo).isActive
    )

    if (!activeProductSections.length) {
      return showNoContentWhenEmpty ? renderNoContent() : null
    }

    const mappedProductSections = activeProductSections.map((activeSection, index) => {
      return <ProductInfo key={index} layout={ProductInfoLayoutType.BLOCK} product={activeSection.productInfo} />
    })

    return (
      <div>
        {renderTitle()}
        <div className={`grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} gap-4 gap-y-6`}>
          {mappedProductSections}
        </div>
      </div>
    )
  }

  const renderCatalogues = () => {
    const sectionCatalogues = section as ISectionInfoCatalogues

    const activeSectionCatalogues = filterInactiveItem<ICatalogueSectionInfo>(sectionCatalogues.catalogues).filter(
      catalogueSection => catalogueSection.catalogueInfo.isActive
    )

    if (!activeSectionCatalogues.length) {
      return showNoContentWhenEmpty ? renderNoContent() : null
    }

    const mappedCatalogues = activeSectionCatalogues.map(activeCatalogue => (
      <CatalogueInfo
        key={activeCatalogue.id}
        catalogue={activeCatalogue.catalogueInfo}
        layout={CatalogueInfoLayoutType.BLOCK}
      />
    ))

    return (
      <div>
        {renderTitle()}
        <div
          className={`grid grid-cols-${mobile + 1} md:grid-cols-${tablet + 2} lg:grid-cols-${
            desktop + 2
          } gap-4 gap-y-6`}>
          {mappedCatalogues}
        </div>
      </div>
    )
  }

  const renderBlogs = () => {
    const sectionBlogs = section as ISectionInfoBlogs
    const activeBlogs = filterInactiveItem<IBlogSectionInfo>(sectionBlogs.blogs).filter(
      blogSection => blogSection.blogInfo.isActive
    )

    if (!activeBlogs.length) {
      return showNoContentWhenEmpty ? renderNoContent() : null
    }

    const mappedBlogs = activeBlogs.map((activeBlog, index) => (
      <div key={index}>
        <BlogInfo blog={activeBlog.blogInfo} />
      </div>
    ))

    return (
      <div>
        {renderTitle()}
        <div className={`grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} gap-4 gap-y-6`}>
          {mappedBlogs}
        </div>
      </div>
    )
  }

  switch (section.type) {
    case SectionType.PRODUCTS:
      return (
        <div>
          {renderProductSections()}
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    case SectionType.CATALOGUES:
      return (
        <div>
          {renderCatalogues()}
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    case SectionType.BLOGS:
      return (
        <div>
          {renderBlogs()}
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    case SectionType.FULL_WIDTH_SLIDES:
    case SectionType.STRICT_WIDTH_SLIDES:
      const slidesSection = section as ISectionInfoFullWidthSlides | ISectionInfoStrictWidthSlides

      return (
        <div className="mt-2 mb-4">
          <SectionSlides section={slidesSection} isFullWidth={slidesSection.type === SectionType.FULL_WIDTH_SLIDES} />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    case SectionType.USPS:
      const uspSection = section as ISectionInfoUSPs
      return (
        <div className="my-4">
          <SectionUSP section={uspSection} />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    case SectionType.PROCEDURES:
      const proceduresSection = section as ISectionInfoProcedures
      return (
        <div className="">
          <SectionProcedures section={proceduresSection} />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    case SectionType.SHARE:
      return (
        <div className="">
          <SectionShare section={section} />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    case SectionType.CUSTOMER_FEEDBACKS:
      const customerFeedbackSection = section as ISectionInfoCustomerFeedbacks
      return (
        <div>
          <SectionCustomerFeedbacks section={customerFeedbackSection} />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    case SectionType.CUSTOM:
      const sectionCustom = section as ISectionInfoCustom
      return (
        <div>
          <SectionCustom section={sectionCustom} />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    default:
      return showNoContentWhenEmpty ? renderNoContent() : null
  }
}

export default BlockSection
