import React, { useContext } from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import ApplicationContext from '../components/ApplicationContext'
import PageContainer from '../components/PageContainer'
import { ISectionInfo } from '../contract/section'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'
import Error from '../components/error/Error'
import { prepareErrorPageSeo } from '../utils/seo/pages/error'
import { getPageSections } from '../http/section'
import { PageSectionType } from '../contract/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    sections: ISectionInfo[]
  }
}

const ErrorPage: NextPage<IProps> = props => {
  const { pageData } = props
  const { sections } = pageData

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isMobile },
  } = applicationContext

  return (
    <div>
      <PageContainer>
        <Error sections={sections} />
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
      seo: prepareErrorPageSeo(),
      layoutData: {
        header: {},
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
    revalidate: PAGE_REVALIDATE_TIME.ERROR,
  }
}

export default ErrorPage
