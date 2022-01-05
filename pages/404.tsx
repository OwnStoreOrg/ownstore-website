import React, { useContext } from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import ApplicationContext from '../components/ApplicationContext'
import PageContainer from '../components/PageContainer'
import CoreImage, { ImageSourceType } from '../components/core/CoreImage'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../components/core/CoreButton'
import Section from '../components/section/Section'
import { getHomePageUrl } from '../utils/home'
import { ISectionInfo } from '../contract/section'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'
import { getCatalogueIndexPageUrl } from '../utils/catalogue'
import { prepareNotFoundPageSeo } from '../utils/seo/pages/error'
import { getPageSections } from '../http/section'
import { PageSectionType } from '../contract/constants'
import { prepareImageUrl } from '../utils/image'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    sections: ISectionInfo[]
  }
}

const NotFoundPage: NextPage<IProps> = props => {
  const { pageData } = props
  const { sections } = pageData

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isMobile },
  } = applicationContext

  return (
    <div>
      <PageContainer>
        <div className="flex flex-col items-center justify-center mt-20">
          <CoreImage
            url={prepareImageUrl('/images/empty/empty-glass.svg', ImageSourceType.ASSET)}
            alt="Page not found"
            useTransparentPlaceholder
            className="w-52 min-h-52 lg:w-60"
          />
          <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto">{`We couldn't find the page you were looking for.`}</div>
          <div className="text-center mt-2 lg:mt-3">
            <CoreButton
              label="View products"
              size={isMobile ? CoreButtonSize.MEDIUM : CoreButtonSize.LARGE}
              type={CoreButtonType.OUTLINE_SECONDARY}
              url={getHomePageUrl()}
            />
            <CoreButton
              label="Catalogues"
              size={isMobile ? CoreButtonSize.MEDIUM : CoreButtonSize.LARGE}
              type={CoreButtonType.OUTLINE_SECONDARY}
              url={getCatalogueIndexPageUrl()}
            />
          </div>
        </div>

        <div className="mt-8">
          {sections.map((section, index) => (
            <Section key={index} section={section} />
          ))}
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const sections = await getPageSections(PageSectionType.ERROR)

  return {
    props: {
      pageData: {
        sections: sections,
      },
      seo: prepareNotFoundPageSeo(),
      layoutData: {
        header: {},
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
    revalidate: PAGE_REVALIDATE_TIME[404],
  }
}

export default NotFoundPage
