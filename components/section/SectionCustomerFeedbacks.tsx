import React, { useContext, useState } from 'react'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import { ICustomerFeedbackInfo, ISectionInfoCustomerFeedbacks } from '../../contract/section'
import { filterInactiveItem } from '../../utils/common'
import ApplicationContext from '../ApplicationContext'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import DeviceSlider from '../DeviceSlider'
import EscapeHTML from '../EscapeHTML'
import SectionWrapper from './SectionWrapper'
import classnames from 'classnames'
import { handleThumbnailImageError } from '../../utils/image'
import { prepareImageUrl } from '../../utils/image'

const CustomerFeedback: React.FC<{ feedback: ICustomerFeedbackInfo }> = props => {
  const { feedback } = props

  const [truncate, toggleTruncate] = useState(feedback.feedback.length > 150)

  return (
    <div className="flex px-4 pt-2">
      <div>
        <CoreImage
          url={
            feedback.image?.url
              ? prepareImageUrl(feedback.image.url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_150)
              : APP_LOGO.DEFAULT
          }
          alt={feedback.name}
          onError={handleThumbnailImageError}
          className="w-20 max-w-20 rounded-lg"
        />
      </div>
      <div className="ml-2">
        <div>
          <span className="text-lightprimary font-medium font-primary-medium">{feedback.name}</span>
          <span>{feedback.designation ? ` - (${feedback.designation})` : null}</span>
        </div>
        <div
          className={classnames({
            'overflow-hidden overflow-clip h-20': truncate,
          })}>
          <EscapeHTML html={`${feedback.feedback}-${feedback.feedback}`} element="span" />
        </div>
        {truncate ? (
          <div
            className="font-medium font-primary-medium text-sm cursor-pointer mt-1 text-primary"
            onClick={() => {
              toggleTruncate(false)
            }}>
            SEE MORE
          </div>
        ) : null}
      </div>
    </div>
  )
}

interface ISectionCustomerFeedbacksProps {
  section: ISectionInfoCustomerFeedbacks
}

const SectionCustomerFeedbacks: React.FC<ISectionCustomerFeedbacksProps> = props => {
  const { section } = props
  const { title, subTitle, customerFeedbacks } = section

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isMobile },
  } = applicationContext

  const activeFeedbacks = filterInactiveItem(customerFeedbacks)

  const siders = isMobile ? 1 : 2

  return (
    <SectionWrapper title={title} subTitle={subTitle} className="">
      <DeviceSlider
        forceShowSlider
        sliderConfig={{
          arrows: false,
          slidesToScroll: 1,
          slidesToShow: siders,
          autoPlay: true,
          dots: false,
          infinite: true,
          variableWidth: false,
          autoPlaySpeed: 5000,
        }}>
        {activeFeedbacks.map((feedback, index) => (
          <div key={index}>
            <CustomerFeedback feedback={feedback} />
          </div>
        ))}
      </DeviceSlider>
    </SectionWrapper>
  )
}

export default SectionCustomerFeedbacks
