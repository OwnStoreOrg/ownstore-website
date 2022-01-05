import React, { useState, useEffect } from 'react'
import CoreImage from './core/CoreImage'
import throttle from 'lodash.throttle'
import appConfig from '../config/appConfig'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import { ChevronUpIcon } from '@heroicons/react/solid'

interface IScrollToTopProps {}

const ScrollToTop: React.FC<IScrollToTopProps> = props => {
  const [show, toggle] = useState(false)

  const onScroll = () => {
    if (
      (document.body.scrollTop || document.documentElement.scrollTop) > appConfig.global.scrollToTopDisplayThreshold
    ) {
      toggle(true)
    } else {
      toggle(false)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', throttle(onScroll, 150))
    return () => document.removeEventListener('scroll', throttle(onScroll, 150))
  }, [])

  if (!show) {
    return null
  }

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    appAnalytics.sendEvent({
      action: AnalyticsEventType.SCROLL_TO_TOP,
      extra: {
        scroll_position: document.body.scrollTop || document.documentElement.scrollTop,
      },
    })
  }

  return (
    <div
      className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 cursor-pointer transform scrollToTop w-12 h-12 flex bg-white justify-center items-center shadow-scrollToTop rounded-full"
      onClick={onClick}>
      <ChevronUpIcon className="w-8" />
    </div>
  )
}

export default ScrollToTop
