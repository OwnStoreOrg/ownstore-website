import React from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import { MobileView, DesktopView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import { getSectionPageUrl } from '../utils/section'
import { ShoppingBagIcon } from '@heroicons/react/solid'
import { ChevronRightIcon } from '@heroicons/react/outline'
import CoreLink from '../components/core/CoreLink'
import BackTitle from '../components/BackTitle'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'
import { ISectionInfo } from '../contract/section'
import NoContent from '../components/NoContent'
import { prepareExplorePageSeo } from '../utils/seo/pages/explore'
import { getPageSections } from '../http/section'
import { PageSectionType } from '../contract/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    sections: ISectionInfo[]
  }
}

const ExplorePage: NextPage<IProps> = props => {
  const { pageData } = props
  const { sections } = pageData

  const renderNoContent = () => {
    return (
      <div>
        <NoContent message="Nothing to explore." />
      </div>
    )
  }

  const renderContent = () => {
    return sections.map((section, index) => {
      return (
        <CoreLink
          key={index}
          url={getSectionPageUrl(section)}
          className="w-full cursor-pointer flex items-center justify-between py-2 px-1 transition-all hover:bg-gray100 rounded-md group">
          <div className="flex items-center w-[90%]">
            <div className="overflow-hidden p-4 bg-gray100 rounded-lg">
              <ShoppingBagIcon className="w-5" />
            </div>
            <div className="ml-2 w-[80%]">
              <div className="text-primaryTextBold font-medium font-primary-medium text-base">{section.title}</div>
              <div className="text-sm truncate">{section.subTitle}</div>
            </div>
          </div>
          <div className="w-5">
            <ChevronRightIcon className="transform transition-transform group-hover:scale-125" />
          </div>
        </CoreLink>
      )
    })
  }

  return (
    <div>
      <MobileView>
        <Snackbar title="Explore" />
      </MobileView>

      <PageContainer>
        <div className="px-2">
          <DesktopView>
            <BackTitle title="Explore" />
          </DesktopView>

          <div className="mt-2">{sections.length ? renderContent() : renderNoContent()}</div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const exploreSections = await getPageSections(PageSectionType.EXPLORE)

  return {
    props: {
      pageData: {
        sections: exploreSections,
      },
      seo: prepareExplorePageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
    revalidate: PAGE_REVALIDATE_TIME.EXPLORE,
  }
}

export default ExplorePage
