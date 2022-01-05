import React, { useContext } from 'react'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import { ISectionInfoProcedures } from '../../contract/section'
import { filterInactiveItem } from '../../utils/common'
import { prepareImageUrl } from '../../utils/image'
import { handleThumbnailImageError } from '../../utils/image'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import EscapeHTML from '../EscapeHTML'
import SectionWrapper from './SectionWrapper'

interface ISectionProceduresProps {
  section: ISectionInfoProcedures
}

const SectionProcedures: React.FC<ISectionProceduresProps> = props => {
  const { section } = props
  const { title, subTitle, procedures } = section

  const activeProcedures = filterInactiveItem(procedures)

  return (
    <SectionWrapper title={title} subTitle={subTitle} className="">
      <div className="grid lg:grid-cols-2 gap-x-2 gap-y-5 px-2 md:px-3 pt-2 lg:pt-0">
        {activeProcedures.map((procedure, index) => (
          <div key={index} className="flex">
            {procedure.image ? (
              <CoreImage
                url={prepareImageUrl(procedure.image.url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_150)}
                alt={procedure.title}
                onError={handleThumbnailImageError}
                className="w-16 h-16 mr-2 rounded-full"
              />
            ) : null}
            <div>
              <div className="font-medium font-primary-medium mb-1">
                <EscapeHTML html={procedure.title} element="span" />
              </div>
              <div>
                <EscapeHTML html={procedure.subTitle} element="span" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export default SectionProcedures
