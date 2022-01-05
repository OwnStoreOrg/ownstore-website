import { IFAQTopicInfo } from '../contract/faq'

export const getFaqTopicsIndexPageUrl = () => {
  return '/faq'
}

export const getFaqTopicPageUrl = (faqTopicInfo: IFAQTopicInfo) => {
  return `/faq/${faqTopicInfo.slug}/${faqTopicInfo.id}`
}
