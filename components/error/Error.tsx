import React from 'react'
import { ISectionInfo } from '../../contract/section'
import { prepareImageUrl } from '../../utils/image'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import Section from '../section/Section'

interface IErrorProps {
  sections?: ISectionInfo[]
}

const Error: React.FC<IErrorProps> = props => {
  const { sections } = props

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-20">
        <CoreImage
          url={prepareImageUrl('/images/empty/empty-glass.svg', ImageSourceType.ASSET)}
          alt="Page not found"
          className="w-52 min-h-52 lg:w-60"
          useTransparentPlaceholder
        />
        <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto font-medium font-primary-medium text-primaryTextBold">
          Site under maintenance.
        </div>
        <div className="text-center mt-1 w-[320px] md:w-auto">{`We're working on a few fixes and updates. Sorry for the Inconvenience.`}</div>
      </div>

      {sections ? (
        <div className="mt-8">
          {sections.map((section, index) => (
            <Section key={index} section={section} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default Error
