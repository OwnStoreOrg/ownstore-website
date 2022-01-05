import React from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import ReactSlick, { Settings } from 'react-slick'

export interface SliderProps extends Settings {}

const Slider = React.forwardRef<any, SliderProps & { children: any }>((props, ref) => {
  return (
    <ReactSlick {...props} ref={ref}>
      {props.children}
    </ReactSlick>
  )
})

Slider.displayName = 'Slider'

export default Slider
