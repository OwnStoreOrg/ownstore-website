import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import BackTitle from '../../../components/BackTitle'
import Snackbar from '../../../components/header/Snackbar'
import PageContainer from '../../../components/PageContainer'
import { DesktopView, MobileView } from '../../../components/ResponsiveViews'
import { PAGE_REVALIDATE_TIME } from '../../../constants/constants'
import { IFAQTopicInfo } from '../../../contract/faq'
import { getFAQsByTopicId, getFAQTopic, getFAQTopics } from '../../../http/faq'
import { filterInactiveItem } from '../../../utils/common'
import { IGlobalLayoutProps } from '../../_app'
import classnames from 'classnames'
import { IFAQInfo } from '../../../contract/faq'
import { INITIAL_PAGE_BUILD_COUNT } from '../../../constants/constants'
import ApiError from '../../../error/ApiError'
import { get404PageUrl } from '../../../utils/error'
import { getFaqTopicPageUrl } from '../../../utils/faq'
import { useRouter } from 'next/router'
import PageLoader from '../../../components/loader/PageLoader'
import { ChevronDownIcon } from '@heroicons/react/solid'
import EscapeHTML from '../../../components/EscapeHTML'
import Collapsible from '../../../components/Collapsible'
import { prepareFAQTopicPageSeo } from '../../../utils/seo/pages/faq'
import NoContent from '../../../components/NoContent'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    faqs: IFAQInfo[]
    faqTopicInfo: IFAQTopicInfo
  }
}

const FAQTopicPage: NextPage<IProps> = props => {
  const { isFallback } = useRouter()

  if (isFallback || !props.pageData) {
    return <PageLoader />
  }

  const { faqTopicInfo, faqs } = props.pageData

  const activeFaqs = filterInactiveItem(faqs)

  const renderNoContent = () => {
    return (
      <div>
        <NoContent message="No questions found." />
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div className="mt-2">
        {activeFaqs.map((activeFaq, index) => {
          return (
            <div
              key={index}
              className={classnames('product-feature-section', {
                'border-b border-gray400': index + 1 !== activeFaqs.length,
              })}>
              <Collapsible
                trigger={
                  <div className={'flex items-start w-full p-4 lg:px-2 lg:py-5 transition-all bg-white cursor-pointer'}>
                    <div className="text-gray900 font-normal font-primary-medium flex-grow pr-2">
                      {activeFaq.question}
                    </div>
                    <ChevronDownIcon className="min-w-5 w-5 lg:min-w-6 lg:w-6 text-gray700 collapsible-chevron-icon" />
                  </div>
                }
                transitionTime={200}>
                <div className="product-feature-section-body px-4 lg:px-2 pt-1 pb-4">
                  <EscapeHTML html={activeFaq.answer} element="div" />
                </div>
              </Collapsible>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <MobileView>
        <Snackbar title={`${faqTopicInfo.name} FAQs`} />
      </MobileView>

      <PageContainer>
        <DesktopView>
          <BackTitle title={`${faqTopicInfo.name} FAQs`} />
        </DesktopView>

        {activeFaqs.length > 0 ? renderContent() : renderNoContent()}
      </PageContainer>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const faqTopics = await getFAQTopics({
    limit: INITIAL_PAGE_BUILD_COUNT.FAQ,
  })

  const paths: any = faqTopics.map(faqTopic => ({
    params: {
      faqTopicSlug: faqTopic.slug,
      faqTopicId: `${faqTopic.id}`,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any

  let faqTopicInfo: IFAQTopicInfo
  let invalidFaqTopic = false

  const faqs = await getFAQsByTopicId(params.faqTopicId)

  try {
    faqTopicInfo = await getFAQTopic(params.faqTopicId)
  } catch (e) {
    if ((e as ApiError).response.code === 'ENTITY_NOT_FOUND') {
      invalidFaqTopic = true
    }
  }

  if (invalidFaqTopic) {
    return {
      redirect: {
        destination: get404PageUrl(),
        permanent: false,
      },
    }
  }

  if (params.faqTopicSlug !== faqTopicInfo.slug) {
    return {
      redirect: {
        destination: getFaqTopicPageUrl(faqTopicInfo),
        permanent: true,
      },
    }
  }

  return {
    props: {
      pageData: {
        faqs: faqs,
        faqTopicInfo: faqTopicInfo,
      },
      seo: prepareFAQTopicPageSeo(faqTopicInfo, faqs),
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

export default FAQTopicPage
