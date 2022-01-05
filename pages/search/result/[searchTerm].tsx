import React, { useState, useRef, useEffect } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { IGlobalLayoutProps } from '../../_app'
import PageContainer from '../../../components/PageContainer'
import { useRouter } from 'next/router'
import { ISearchInfo } from '../../../contract/search'
import { getSearchInfo } from '../../../http/search'
import ProductInfo, { ProductInfoLayoutType } from '../../../components/product/ProductInfo'
import CatalogueInfo, { CatalogueInfoLayoutType } from '../../../components/catalogue/CatalogueInfo'
import NoContent from '../../../components/NoContent'
import { getHomePageUrl } from '../../../utils/home'
import appConfig from '../../../config/appConfig'
import { prepareSearchPageSeo } from '../../../utils/seo/pages/search'
import appAnalytics from '../../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../../constants/analytics'
import { PAGE_REVALIDATE_TIME } from '../../../constants/constants'
import { filterInactiveItem } from '../../../utils/common'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    searchInfo: ISearchInfo
  }
}

const SearchResultsPage: NextPage<IProps> = props => {
  const {
    pageData: { searchInfo },
  } = props

  const router = useRouter()

  const hasData = [searchInfo.catalogues, searchInfo.individualProducts, searchInfo.comboProducts].some(
    info => info.length > 0
  )

  useEffect(() => {
    appAnalytics.sendEvent({
      action: AnalyticsEventType.VIEW_SEARCH_RESULTS,
      extra: {
        extra: {
          search_term: router.query.searchTerm,
        },
      },
    })
  }, [])

  const renderNoContent = () => {
    return (
      <div>
        <NoContent message="No result found!" />
      </div>
    )
  }

  const renderSearchIndividualProducts = () => {
    return (
      <div>
        <div className="font-medium font-primary-medium text-primaryTextBold mt-3 lg:mt-4 lg:mb-1 ml-1">Products</div>
        <div>
          {searchInfo.individualProducts
            .filter(product => product.isActive)
            .map(individualProduct => (
              <ProductInfo
                key={individualProduct.id}
                layout={ProductInfoLayoutType.INLINE}
                product={individualProduct}
              />
            ))}
        </div>
      </div>
    )
  }

  const renderSearchComboProducts = () => {
    return (
      <div>
        <div className="font-medium font-primary-medium text-primaryTextBold mt-3 lg:mt-4 lg:mb-1 ml-1">Combos</div>
        <div>
          {searchInfo.comboProducts
            .filter(comboProduct => comboProduct.isActive)
            .map(comboProduct => (
              <ProductInfo key={comboProduct.id} layout={ProductInfoLayoutType.INLINE} product={comboProduct} />
            ))}
        </div>
      </div>
    )
  }

  const renderSearchCatalogues = () => {
    return (
      <div>
        <div className="font-medium font-primary-medium text-primaryTextBold mt-3 lg:mt-4 lg:mb-1 ml-1">Catalogues</div>
        <div>
          {searchInfo.catalogues
            .filter(catalogue => catalogue.isActive)
            .map(catalogue => (
              <CatalogueInfo key={catalogue.id} layout={CatalogueInfoLayoutType.INLINE} catalogue={catalogue} />
            ))}
        </div>
      </div>
    )
  }

  const renderResult = () => {
    return (
      <div>
        {filterInactiveItem(searchInfo.individualProducts).length ? renderSearchIndividualProducts() : null}
        {filterInactiveItem(searchInfo.comboProducts).length ? renderSearchComboProducts() : null}
        {filterInactiveItem(searchInfo.catalogues).length ? renderSearchCatalogues() : null}
      </div>
    )
  }

  return (
    <div>
      <PageContainer>
        <div className="">
          <div className="sticky lg:relative top-0 lg:top-18 bg-white lg:bg-none z-10 lg:z-0 px-2 py-4 shadow-sm lg:shadow-none">
            <div className="flex items-center">
              <div title="Go Back">
                {/* <ArrowLeftIcon
                  className="w-6 lg:w-7 mr-3 ml-1 text-mineShaft cursor-pointer transform transition-transform hover:scale-110"
                  onClick={onBackIconClick}
                /> */}
              </div>
              <div className="font-medium font-primary-medium text-mineShaft text-base lg:text-lg">
                Search results for &quot;{router.query.searchTerm}&quot;
              </div>
            </div>
          </div>

          <div className="px-2 mt-3 ">{hasData ? renderResult() : renderNoContent()}</div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IProps> = async context => {
  const searchTerm = context.params.searchTerm as string | undefined

  const searchInfo = await getSearchInfo(searchTerm as string, {
    limit: appConfig.search.sectionFetchLimit,
  })

  context.res.setHeader('Cache-Control', `public, max-age=${PAGE_REVALIDATE_TIME.SEARCH_RESULTS}`)

  return {
    props: {
      pageData: {
        searchInfo: searchInfo,
      },
      seo: prepareSearchPageSeo(searchTerm, searchInfo),
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
  }
}

export default SearchResultsPage
