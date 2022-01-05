import React from 'react'
import { IGlobalLayoutProps } from '../../_app'
import { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import PageContainer from '../../../components/PageContainer'
import { getSectionInfo, getSectionInfoById } from '../../../http/section'
import { MobileView, DesktopView } from '../../../components/ResponsiveViews'
import Snackbar from '../../../components/header/Snackbar'
import BackTitle from '../../../components/BackTitle'
import { PAGE_REVALIDATE_TIME, INITIAL_PAGE_BUILD_COUNT } from '../../../constants/constants'
import { ISectionInfo } from '../../../contract/section'
import PageLoader from '../../../components/loader/PageLoader'
import { useRouter } from 'next/router'
import ApiError from '../../../error/ApiError'
import { getSectionPageUrl } from '../../../utils/section'
import { get404PageUrl } from '../../../utils/error'
import BlockSection from '../../../components/section/BlockSection'
import { prepareSectionPageSeo } from '../../../utils/seo/pages/section'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    section: ISectionInfo
  }
}

const Section: NextPage<IProps> = props => {
  const { isFallback } = useRouter()

  if (isFallback || !props.pageData) {
    return <PageLoader />
  }

  const {
    pageData: { section },
  } = props

  return (
    <div>
      <MobileView>
        <Snackbar title={section.title} />
      </MobileView>

      <PageContainer>
        <DesktopView>
          <BackTitle title={section.title} />
        </DesktopView>

        <div className="px-2 mt-4">
          <BlockSection section={section} showNoContentWhenEmpty />
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sections = await getSectionInfo({ limit: INITIAL_PAGE_BUILD_COUNT.SECTION })

  const paths: any = sections.map(section => ({
    params: {
      sectionSlug: section.slug,
      sectionId: `${section.id}`,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any
  const { sectionSlug, sectionId } = params

  let sectionInfo: ISectionInfo
  let invalidSection = false

  try {
    sectionInfo = await getSectionInfoById(sectionId, {})
  } catch (e) {
    if ((e as ApiError).response.code === 'ENTITY_NOT_FOUND') {
      invalidSection = true
    }
  }

  if (invalidSection) {
    return {
      redirect: {
        destination: get404PageUrl(),
        permanent: false,
      },
    }
  }

  if (sectionSlug !== sectionInfo.slug) {
    return {
      redirect: {
        destination: getSectionPageUrl(sectionInfo),
        permanent: true,
      },
    }
  }

  return {
    props: {
      pageData: {
        section: sectionInfo,
      },
      seo: prepareSectionPageSeo(sectionInfo),
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
    revalidate: PAGE_REVALIDATE_TIME.SECTION,
  }
}

export default Section
