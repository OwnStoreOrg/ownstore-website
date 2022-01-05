import React from 'react'
import { filterInactiveItem } from '../../utils/common'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import { ISectionInfoUSPs, IUSPInfo } from '../../contract/section'
import { prepareImageUrl } from '../../utils/image'

interface ISectionUSPProps {
  section: ISectionInfoUSPs
}

const SectionUSP: React.FC<ISectionUSPProps> = props => {
  const { section } = props
  const { uspList } = section

  const router = useRouter()

  return (
    <div
      className={classnames(
        'bg-whisper py-5 md:py-6 px-2 md:px-4 lg:py-8 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3 md:gap-y-4'
      )}>
      {filterInactiveItem<IUSPInfo>(uspList).map(usp => (
        <div
          key={usp.id}
          className={classnames('flex text-left items-center', {
            'cursor-pointer': usp.url,
          })}
          onClick={e => {
            if (usp.url) {
              router.push(usp.url)
            }
          }}>
          <CoreImage
            url={prepareImageUrl(usp.image.url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_150)}
            alt={usp.name}
            className="w-14 h-14 lg:w-16 lg:h-16 mr-2 md:mr-3"
          />
          <div className="mt-2 font-medium font-primary-medium text-primaryText text-sm md:text-sm">{usp.name}</div>
        </div>
      ))}
    </div>
  )
}

export default SectionUSP
