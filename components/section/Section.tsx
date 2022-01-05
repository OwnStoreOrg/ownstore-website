import React from 'react'
import { SectionType } from '../../contract/constants'
import SectionBlogs from './SectionBlogs'
import SectionProducts from './SectionProducts'
import SectionCatalogues from './SectionCatalogues'
import CoreDivider from '../core/CoreDivider'
import SectionUSP from './SectionUSP'
import SectionSlides from './SectionSlides'
import SectionShare from './SectionShare'
import {
  ISectionInfo,
  ISectionInfoUSPs,
  ISectionInfoCatalogues,
  ISectionInfoBlogs,
  ISectionInfoCustomerFeedbacks,
  ISectionInfoProcedures,
  ISectionInfoCustom,
  ISectionInfoFullWidthSlides,
  ISectionInfoStrictWidthSlides,
  ICatalogueSectionInfo,
  IBlogSectionInfo,
  ISectionInfoProducts,
  IProductSectionInfo,
} from '../../contract/section'
import { filterInactiveItem } from '../../utils/common'
import { ICatalogueInfo } from '../../contract/catalogue'
import { IBlogInfo } from '../../contract/blog'
import SectionCustomerFeedbacks from './SectionCustomerFeedbacks'
import SectionProcedures from './SectionProcedures'
import SectionCustom from './SectionCustom'
import { IComboProductInfo, IIndividualProductInfo } from '../../contract/product'

interface ISectionProps {
  section: ISectionInfo
}

const Section: React.FC<ISectionProps> = props => {
  const { section } = props

  switch (section.type) {
    case SectionType.PRODUCTS:
      const sectionProducts = section as ISectionInfoProducts
      const activeProductSections = filterInactiveItem<IProductSectionInfo>(sectionProducts.products).filter(
        catalogueSection => (catalogueSection.productInfo as IIndividualProductInfo | IComboProductInfo).isActive
      )

      if (!activeProductSections.length) {
        return null
      }

      return (
        <React.Fragment>
          <SectionProducts
            sectionProducts={{
              ...sectionProducts,
              products: activeProductSections,
            }}
          />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </React.Fragment>
      )

    case SectionType.CATALOGUES:
      const sectionCatalogues = section as ISectionInfoCatalogues
      const activeCatalogues = filterInactiveItem<ICatalogueSectionInfo>(sectionCatalogues.catalogues).filter(
        catalogueSection => catalogueSection.catalogueInfo.isActive
      )

      if (!activeCatalogues.length) {
        return null
      }

      return (
        <React.Fragment>
          <SectionCatalogues
            sectionCatalogues={{
              ...sectionCatalogues,
              catalogues: activeCatalogues,
            }}
          />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </React.Fragment>
      )

    case SectionType.BLOGS:
      const sectionBlogs = section as ISectionInfoBlogs
      const activeBlogs = filterInactiveItem<IBlogSectionInfo>(sectionBlogs.blogs).filter(
        blogSection => blogSection.blogInfo.isActive
      )

      if (!activeBlogs.length) {
        return null
      }

      return (
        <React.Fragment>
          <SectionBlogs
            sectionBlogs={{
              ...sectionBlogs,
              blogs: activeBlogs,
            }}
          />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </React.Fragment>
      )

    case SectionType.FULL_WIDTH_SLIDES:
    case SectionType.STRICT_WIDTH_SLIDES:
      const slidesSection = section as ISectionInfoFullWidthSlides | ISectionInfoStrictWidthSlides

      return (
        <div className="mt-2 mb-2 lg:mb-4">
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
        <div className="my-4 lg:my-6">
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

    case SectionType.OFFERS:
      return null

    case SectionType.CUSTOM:
      const sectionCustom = section as ISectionInfoCustom
      return (
        <div>
          <SectionCustom section={sectionCustom} />
          {section.showDivider ? <CoreDivider className="my-2 lg:my-6" /> : null}
        </div>
      )

    default:
      return null
  }
}

export default Section
