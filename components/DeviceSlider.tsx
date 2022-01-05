import React, { PropsWithChildren, useContext } from 'react'
import ApplicationContext from './ApplicationContext'
import Slider from './Slider'

interface IDeviceSliderProps {
  sliderConfig: {
    slidesToShow: number
    slidesToScroll: number
    arrows: boolean
    autoPlay?: boolean
    infinite?: boolean
    autoPlaySpeed?: number
    variableWidth?: boolean
    dots?: boolean
  }
  forceShowSlider?: boolean
}

const DeviceSlider: React.FC<PropsWithChildren<IDeviceSliderProps>> = props => {
  const { sliderConfig, forceShowSlider } = props
  const {
    slidesToShow,
    slidesToScroll,
    arrows,
    autoPlay,
    infinite,
    autoPlaySpeed,
    variableWidth = true,
    dots = false,
  } = sliderConfig

  const slider = React.createRef()

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isTouchDevice, isMobile },
  } = applicationContext

  const sliderSettings = {
    dots: dots,
    infinite: infinite || false,
    // speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    initialSlide: 0,
    variableWidth: variableWidth,
    swipeToSlide: true,
    arrows: arrows,
    autoplay: autoPlay || false,
    autoplaySpeed: autoPlaySpeed || 2000,
    // cssEase: 'linear',
  }

  const renderScreenSlider = () => (
    <div className="overflow-hidden flex overflow-x-scroll overflow-y-hidden hide-scrollbar">
      {React.Children.map(props.children, (child, index) => (
        <div key={index} className="inline-block flex-grow-0 flex-shrink-0">
          {child}
        </div>
      ))}
    </div>
  )

  const renderControlSlider = () => (
    <Slider ref={slider} {...sliderSettings}>
      {props.children}
    </Slider>
  )

  const showControlSlider = forceShowSlider ? true : !isMobile

  return showControlSlider ? renderControlSlider() : renderScreenSlider()
}

export default DeviceSlider
