import React from 'react'
import SectionWrapper from './SectionWrapper'
import { ICatalogueInfo } from '../../contract/catalogue'
import { filterInactiveItem } from '../../utils/common'
import CatalogueInfo, { CatalogueInfoLayoutType } from '../catalogue/CatalogueInfo'
import { getSectionPageUrl } from '../../utils/section'
import { useRouter } from 'next/router'
import { ICatalogueSectionInfo, ISectionInfoCatalogues } from '../../contract/section'

interface ISectionCataloguesProps {
  sectionCatalogues: ISectionInfoCatalogues
}

const SectionCatalogues: React.FC<ISectionCataloguesProps> = props => {
  const { sectionCatalogues } = props
  const activeCatalogues = filterInactiveItem<ICatalogueSectionInfo>(sectionCatalogues.catalogues)

  const router = useRouter()

  const linkUrl = getSectionPageUrl(sectionCatalogues)

  return (
    <SectionWrapper
      title={sectionCatalogues.title}
      subTitle={sectionCatalogues.subTitle}
      linkUrl={sectionCatalogues.showMoreUrl ? linkUrl : undefined}>
      <div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 gap-y-6 px-3">
          {activeCatalogues.map(catalogue => (
            <CatalogueInfo
              key={catalogue.id}
              catalogue={catalogue.catalogueInfo}
              layout={CatalogueInfoLayoutType.BLOCK}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default SectionCatalogues
