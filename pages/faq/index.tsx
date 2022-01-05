import { GetStaticProps, NextPage } from 'next'
import React from 'react'
import BackTitle from '../../components/BackTitle'
import CoreLink from '../../components/core/CoreLink'
import Snackbar from '../../components/header/Snackbar'
import PageContainer from '../../components/PageContainer'
import { DesktopView, MobileView } from '../../components/ResponsiveViews'
import { PAGE_REVALIDATE_TIME } from '../../constants/constants'
import { IFAQTopicInfo } from '../../contract/faq'
import { getFAQTopics } from '../../http/faq'
import { filterInactiveItem } from '../../utils/common'
import { IGlobalLayoutProps } from '../_app'
import classnames from 'classnames'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { getFaqTopicPageUrl } from '../../utils/faq'
import { prepareFAQTopicsIndexPageSeo } from '../../utils/seo/pages/faq'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    faqTopics: IFAQTopicInfo[]
  }
}

const FAQPage: NextPage<IProps> = props => {
  const { faqTopics } = props.pageData

  const activeFaqTopics = filterInactiveItem(faqTopics)

  return (
    <div>
      <MobileView>
        <Snackbar title="FAQ Topics" />
      </MobileView>

      <PageContainer>
        <DesktopView>
          <BackTitle title="FAQ Topics" />
        </DesktopView>

        <div className="mt-2">
          {activeFaqTopics.map((activeFaqTopic, index) => (
            <CoreLink
              key={activeFaqTopic.id}
              url={getFaqTopicPageUrl(activeFaqTopic)}
              className={classnames(
                'flex items-center w-full p-4 lg:px-2 lg:py-5 transition-all bg-white hover:bg-gray100 group',
                {
                  'border-b border-gray400': index + 1 !== activeFaqTopics.length,
                }
              )}>
              <div className="text-gray900 font-normal font-primary-medium flex-grow pr-2">{activeFaqTopic.name}</div>
              <ChevronRightIcon className="w-5 min-w-5 text-gray700 transform transition-transform group-hover:scale-125" />
            </CoreLink>
          ))}
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const faqTopics = await getFAQTopics({})

  return {
    props: {
      pageData: {
        faqTopics: faqTopics,
      },
      seo: prepareFAQTopicsIndexPageSeo(),
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
    revalidate: PAGE_REVALIDATE_TIME.FAQ,
  }
}

export default FAQPage
