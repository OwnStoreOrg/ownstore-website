import React, { useEffect, useState } from 'react'
import { isCookieBannerShown, setCookieBannerShown } from '../utils/cookieBanner'
import { getPrivacyPageUrl } from '../utils/privacyPolicy'
import CoreButton, { CoreButtonSize, CoreButtonType } from './core/CoreButton'
import CoreLink from './core/CoreLink'

interface ICookieBannerProps {}

const CookieBanner: React.FC<ICookieBannerProps> = props => {
  const [show, toggle] = useState(false)

  useEffect(() => {
    const bannerShown = isCookieBannerShown()
    if (!bannerShown) {
      toggle(true)
    }
  }, [])

  if (!show) {
    return null
  }

  return (
    <div className="fixed bottom-[74px] lg:bottom-4 left-[2%] md:left-0 right-[2%] md:right-0 md:mx-auto bg-white border border-gray300 w-[96%] md:w-[600px] lg:w-[900px] shadow-md md:shadow-headerUserAddress rounded-md p-4 md:p-5 flex flex-col justify-between lg:flex-row lg:items-center">
      <div>We use cookies to enhance the site experience and serve you well.</div>
      <div className="text-right mt-3 md:mt-0">
        <CoreButton
          label="Learn More"
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.OUTLINE_SECONDARY}
          onClick={() => {
            toggle(false)
          }}
          url={getPrivacyPageUrl()}
          className="mr-1"
        />
        <CoreButton
          label="Okay"
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.SOLID_PRIMARY}
          onClick={() => {
            setCookieBannerShown(true)
            toggle(false)
          }}
        />
      </div>
    </div>
  )
}

export default CookieBanner
