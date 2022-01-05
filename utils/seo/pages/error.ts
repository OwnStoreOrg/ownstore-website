import { IAppSeoProps } from '../../../components/seo/AppSeo'

export const prepareErrorPageSeo = (): IAppSeoProps => {
  return {
    title: null,
    description: null,
    canonical: null,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}

export const prepareNotFoundPageSeo = (): IAppSeoProps => {
  return {
    title: null,
    description: null,
    canonical: null,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}
