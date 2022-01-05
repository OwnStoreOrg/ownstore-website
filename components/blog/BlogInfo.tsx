import React from 'react'
import { IBlogInfo } from '../../contract/blog'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import CoreLink from '../core/CoreLink'
import appConfig from '../../config/appConfig'
import { handleThumbnailImageError } from '../../utils/image'
import { prepareImageUrl } from '../../utils/image'

interface IBlogInfoProps {
  blog: IBlogInfo
}

const BlogInfo: React.FC<IBlogInfoProps> = props => {
  const { blog } = props

  const router = useRouter()

  return (
    <CoreLink className="w-full cursor-pointer group" url={blog.url} isExternal={appConfig.global.openBlogsInNewTab}>
      <div className="overflow-hidden rounded-lg mb-3">
        <CoreImage
          url={
            blog.image?.url
              ? prepareImageUrl(blog.image.url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_300)
              : APP_LOGO.DEFAULT
          }
          alt={blog.title}
          onError={handleThumbnailImageError}
          className="w-full rounded-lg transform transition-transform group-hover:scale-110  min-h-36 md:min-h-40 xl:min-h-52"
        />
      </div>
      <div className="">
        <div className="text-primaryTextBold text-sm lg:text-base font-medium font-primary-medium mb-1">
          {blog.title}
        </div>
        <div className="text-sm truncate">{blog.description}</div>
      </div>
      {/* <div className="mt-2">
        <div className="flex items-center text-xs font-medium font-primary-medium">
          <span>Read More</span>
          <ChevronRightIcon className="w-3 lg:w-4" />
        </div>
      </div> */}
    </CoreLink>
  )
}

export default BlogInfo
