import React from 'react'
import { IGlobalLayoutProps } from './_app'
import { NextPage, GetStaticProps } from 'next'
import Section from '../components/section/Section'
import PageContainer from '../components/PageContainer'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'
import { ISectionInfo } from '../contract/section'
import { prepareHomePageSeo } from '../utils/seo/pages/home'
import { getPageSections } from '../http/section'
import { PageSectionType } from '../contract/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    sections: ISectionInfo[]
  }
}

const Home: NextPage<IProps> = props => {
  const { pageData } = props
  const { sections } = pageData

  return (
    <PageContainer>
      {sections.map((section, index) => (
        <Section key={index} section={section} />
      ))}
    </PageContainer>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const homeSections = await getPageSections(PageSectionType.HOME)

  return {
    props: {
      pageData: {
        sections: homeSections,
      },
      seo: prepareHomePageSeo(),
      layoutData: {
        header: {},
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
    revalidate: PAGE_REVALIDATE_TIME.HOME,
  }
}

export default Home
