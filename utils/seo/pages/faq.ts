import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IFAQInfo, IFAQTopicInfo } from '../../../contract/faq'
import { getFaqTopicPageUrl, getFaqTopicsIndexPageUrl } from '../../faq'
import { prepareBreadcrumbListStructuredData, prepareFAQStructuredData } from '../structuredData'

// http://localhost:3000/faq
export const prepareFAQTopicsIndexPageSeo = (): IAppSeoProps => {
  return {
    title: 'FAQ Topics',
    description: 'FAQ Topics',
    canonical: `${appConfig.global.baseUrl}${getFaqTopicsIndexPageUrl()}`,
    keywords: [],
  }
}

// http://localhost:3000/faq/general/1
export const prepareFAQTopicPageSeo = (faqTopic: IFAQTopicInfo, faqs: IFAQInfo[]): IAppSeoProps => {
  const breadcrumbList = [
    { position: 1, name: 'Home', url: appConfig.global.baseUrl },
    { position: 2, name: 'FAQs', url: `${appConfig.global.baseUrl}${getFaqTopicsIndexPageUrl()}` },
    { position: 3, name: faqTopic.name, url: `${appConfig.global.baseUrl}${getFaqTopicPageUrl(faqTopic)}` },
  ]

  return {
    title: `FAQ - ${faqTopic.name}`,
    description: `FAQ - ${faqTopic.name} description`,
    canonical: `${appConfig.global.baseUrl}${getFaqTopicPageUrl(faqTopic)}`,
    keywords: [],
    structuredData: {
      breadcrumbList: prepareBreadcrumbListStructuredData(breadcrumbList),
      FAQs: prepareFAQStructuredData(
        faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer,
        }))
      ),
    },
  }
}
