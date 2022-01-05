import React, { useContext } from 'react'
import DeviceSlider from '../DeviceSlider'
import { filterInactiveItem } from '../../utils/common'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import { ISectionInfoFullWidthSlides, ISectionInfoStrictWidthSlides, ISlideInfo } from '../../contract/section'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import ApplicationContext from '../ApplicationContext'
import { prepareImageUrl } from '../../utils/image'
import { SectionType } from '../../contract/constants'

interface ISectionSlidesProps {
  section: ISectionInfoFullWidthSlides | ISectionInfoStrictWidthSlides
  isFullWidth: boolean
}

const SectionSlides: React.FC<ISectionSlidesProps> = props => {
  const { section, isFullWidth } = props
  const { slides, type } = section

  const router = useRouter()

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isMobile },
  } = applicationContext

  let imageVariant = null
  if (type === SectionType.STRICT_WIDTH_SLIDES) {
    imageVariant = IMAGE_VARIANTS.WIDE_620
  } else {
    imageVariant = IMAGE_VARIANTS.FULL_1280
  }

  return (
    <div className={classnames(isFullWidth ? 'fullWidthSlidesSectionSlider' : 'strictWidthSlidesSectionSlider')}>
      <DeviceSlider
        forceShowSlider
        sliderConfig={{
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          autoPlay: true,
          infinite: true,
          autoPlaySpeed: 3500,
        }}>
        {filterInactiveItem<ISlideInfo>(slides).map(slide => {
          let imageUrl = prepareImageUrl(slide.image.url, ImageSourceType.CLOUD, imageVariant)

          if (isMobile && slide.mobileImage) {
            imageUrl = prepareImageUrl(slide.mobileImage.url, ImageSourceType.CLOUD, imageVariant)
          }

          return (
            <div
              key={slide.id}
              onClick={e => {
                if (slide.url) {
                  router.push(slide.url)
                }
              }}
              className={classnames('', { 'cursor-pointer': slide.url })}>
              <CoreImage
                url={imageUrl}
                alt={slide.url}
                className={classnames('rounded-md')}
                useTransparentPlaceholder
              />
            </div>
          )
        })}
      </DeviceSlider>
    </div>
  )
}

export default SectionSlides
