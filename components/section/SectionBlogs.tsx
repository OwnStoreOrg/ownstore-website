import React from 'react'
import SectionWrapper from './SectionWrapper'
import DeviceSlider from '../DeviceSlider'
import BlogInfo from '../blog/BlogInfo'
import { filterInactiveItem } from '../../utils/common'
import { IBlogInfo } from '../../contract/blog'
import { getSectionPageUrl } from '../../utils/section'
import { useRouter } from 'next/router'
import { IBlogSectionInfo, ISectionInfoBlogs } from '../../contract/section'

interface ISectionBlogsProps {
  sectionBlogs: ISectionInfoBlogs
}

const SectionBlogs: React.FC<ISectionBlogsProps> = props => {
  const { sectionBlogs } = props
  const activeBlogs = filterInactiveItem<IBlogSectionInfo>(sectionBlogs.blogs)

  const router = useRouter()

  const linkUrl = getSectionPageUrl(sectionBlogs)

  return (
    <SectionWrapper
      title={sectionBlogs.title}
      subTitle={sectionBlogs.subTitle}
      linkUrl={sectionBlogs.showMoreUrl ? linkUrl : undefined}
      className="blogSectionSlider">
      <DeviceSlider
        sliderConfig={{
          slidesToShow: 4,
          slidesToScroll: 3,
          arrows: true,
        }}>
        {activeBlogs.map((blog, index) => (
          <div key={index} className="w-52 mx-2">
            <BlogInfo blog={blog.blogInfo} />
          </div>
        ))}
      </DeviceSlider>
    </SectionWrapper>
  )
}

export default SectionBlogs
