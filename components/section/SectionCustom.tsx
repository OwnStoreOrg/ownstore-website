import { useRouter } from 'next/router'
import React from 'react'
import { ISectionInfoCustom } from '../../contract/section'
import { getSectionPageUrl } from '../../utils/section'
import EscapeHTML from '../EscapeHTML'
import SectionWrapper from './SectionWrapper'

interface ISectionCustomProps {
  section: ISectionInfoCustom
}

const SectionCustom: React.FC<ISectionCustomProps> = props => {
  const { section } = props
  const { title, bodyList, subTitle, showMoreUrl } = section

  const router = useRouter()

  const linkUrl = getSectionPageUrl(section)

  return (
    <SectionWrapper title={title} subTitle={subTitle} linkUrl={showMoreUrl ? linkUrl : undefined}>
      <div className="px-3 html-body">
        {bodyList.map((body, index) => {
          return <EscapeHTML key={index} html={body.html} element="div" />
        })}
      </div>
    </SectionWrapper>
  )
}

export default SectionCustom
