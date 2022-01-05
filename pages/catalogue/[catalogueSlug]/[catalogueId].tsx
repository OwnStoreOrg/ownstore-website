import React from 'react'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import { IGlobalLayoutProps } from '../../_app'
import { getCatalogueInfo, getCatalogueInfoById } from '../../../http/catalogue'
import { getIndividualProductInfosByCatalogueId } from '../../../http/product'
import { ICatalogueInfo } from '../../../contract/catalogue'
import ProductInfo, { ProductInfoLayoutType } from '../../../components/product/ProductInfo'
import { filterInactiveItem } from '../../../utils/common'
import { MobileView, DesktopView } from '../../../components/ResponsiveViews'
import Snackbar from '../../../components/header/Snackbar'
import NoContent from '../../../components/NoContent'
import PageContainer from '../../../components/PageContainer'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../components/core/CoreButton'
import { getCatalogueIndexPageUrl, getCataloguePageUrl } from '../../../utils/catalogue'
import BackTitle from '../../../components/BackTitle'
import PageLoader from '../../../components/loader/PageLoader'
import {
  INFINITE_SCROLL_FETCH_LIMIT,
  INITIAL_PAGE_BUILD_COUNT,
  PAGE_REVALIDATE_TIME,
} from '../../../constants/constants'
import { useRouter } from 'next/router'
import ApiError from '../../../error/ApiError'
import { get404PageUrl } from '../../../utils/error'
import { IIndividualProductInfo } from '../../../contract/product'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import InfiniteScroll from '../../../components/InfiniteScroll'
import { prepareCataloguePageSeo } from '../../../utils/seo/pages/catalogue'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    individualProducts: IIndividualProductInfo[]
    catalogueInfo: ICatalogueInfo
  }
}

const CatalogueProducts: NextPage<IProps> = props => {
  const { isFallback } = useRouter()

  if (isFallback || !props.pageData) {
    return <PageLoader />
  }

  const {
    pageData: { individualProducts: productInfos, catalogueInfo },
  } = props

  const activeIndividualProducts = filterInactiveItem<IIndividualProductInfo>(productInfos)

  const { scrollState, scrollDispatch } = useInfiniteScroll({
    initialState: {
      data: activeIndividualProducts,
      offset: 0,
      hasMore: activeIndividualProducts.length < INFINITE_SCROLL_FETCH_LIMIT ? false : true,
    },
  })

  const {
    data: productsToShow,
    offset,
    hasMore,
  }: { data: IIndividualProductInfo[]; offset: number; hasMore: boolean } = scrollState

  const loadMore = () => {
    const nextOffset = offset + INFINITE_SCROLL_FETCH_LIMIT

    getIndividualProductInfosByCatalogueId(catalogueInfo.id, {
      offset: nextOffset,
      limit: INFINITE_SCROLL_FETCH_LIMIT,
    })
      .then(resp => {
        const filteredItems = filterInactiveItem(resp || [])

        if (filteredItems.length) {
          scrollDispatch({
            type: 'success',
            payload: {
              data: filteredItems,
              offset: nextOffset,
            },
          })
        } else {
          scrollDispatch({
            type: 'limit_reached',
          })
        }
      })
      .catch(() => {
        scrollDispatch({ type: 'error' })
      })
  }

  const renderContent = () => {
    if (!activeIndividualProducts.length) {
      return (
        <div className="flex justify-center">
          <div className="py-20 lg:w-1/2">
            <NoContent message="Currently the catalogue has no products. Try exploring other catalogues..." />
            <div className="text-center">
              <CoreButton
                label="Browse catalogues"
                size={CoreButtonSize.MEDIUM}
                type={CoreButtonType.SOLID_PRIMARY}
                url={getCatalogueIndexPageUrl()}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="px-2">
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6 mt-6 lg:mt-0">
            {productsToShow.map(product => (
              <ProductInfo key={product.id} layout={ProductInfoLayoutType.BLOCK} product={product} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    )
  }

  return (
    <div>
      <MobileView>
        <Snackbar title={catalogueInfo.name} />
      </MobileView>

      <PageContainer>
        <div>
          <DesktopView>
            <BackTitle title={catalogueInfo.name} />
          </DesktopView>

          {renderContent()}
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const catalogueInfos = await getCatalogueInfo({
    limit: INITIAL_PAGE_BUILD_COUNT.CATALOGUE,
  })

  const paths: any = catalogueInfos.map(catalogueInfo => ({
    params: {
      catalogueId: `${catalogueInfo.id}`,
      catalogueSlug: catalogueInfo.slug,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any

  let catalogueInfo: ICatalogueInfo
  let invalidCatalogue = false

  try {
    catalogueInfo = await getCatalogueInfoById(params.catalogueId)
  } catch (e) {
    if ((e as ApiError).response.code === 'ENTITY_NOT_FOUND') {
      invalidCatalogue = true
    }
  }

  if (invalidCatalogue) {
    return {
      redirect: {
        destination: get404PageUrl(),
        permanent: false,
      },
    }
  }

  if (params.catalogueSlug !== catalogueInfo.slug) {
    return {
      redirect: {
        destination: getCataloguePageUrl(catalogueInfo),
        permanent: true,
      },
    }
  }

  const productInfos = await getIndividualProductInfosByCatalogueId(params.catalogueId, {
    offset: 0,
    limit: INFINITE_SCROLL_FETCH_LIMIT,
  })

  return {
    props: {
      pageData: {
        individualProducts: productInfos,
        catalogueInfo: catalogueInfo,
      },
      seo: prepareCataloguePageSeo(catalogueInfo),
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
    revalidate: PAGE_REVALIDATE_TIME.CATALOGUE,
  }
}

export default CatalogueProducts
