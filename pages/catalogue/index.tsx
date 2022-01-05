import React from 'react'
import { IGlobalLayoutProps } from '../_app'
import { ICatalogueInfo } from '../../contract/catalogue'
import { NextPage, GetStaticProps } from 'next'
import { getCatalogueInfo } from '../../http/catalogue'
import { filterInactiveItem } from '../../utils/common'
import CatalogueInfo, { CatalogueInfoLayoutType } from '../../components/catalogue/CatalogueInfo'
import Snackbar from '../../components/header/Snackbar'
import { MobileView, DesktopView } from '../../components/ResponsiveViews'
import PageContainer from '../../components/PageContainer'
import BackTitle from '../../components/BackTitle'
import { INFINITE_SCROLL_FETCH_LIMIT, PAGE_REVALIDATE_TIME } from '../../constants/constants'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import InfiniteScroll from '../../components/InfiniteScroll'
import { prepareCatalogueIndexPageSeo } from '../../utils/seo/pages/catalogue'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    catalogueInfos: ICatalogueInfo[]
  }
}

const CatalogueIndexPage: NextPage<IProps> = props => {
  const {
    pageData: { catalogueInfos },
  } = props

  const activeCatalogueInfos = filterInactiveItem<ICatalogueInfo>(catalogueInfos)

  const { scrollState, scrollDispatch } = useInfiniteScroll({
    initialState: {
      data: activeCatalogueInfos,
      offset: 0,
      hasMore: activeCatalogueInfos.length < INFINITE_SCROLL_FETCH_LIMIT ? false : true,
    },
  })

  const {
    data: cataloguesToShow,
    offset,
    hasMore,
  }: { data: ICatalogueInfo[]; offset: number; hasMore: boolean } = scrollState

  const loadMore = () => {
    const nextOffset = offset + INFINITE_SCROLL_FETCH_LIMIT

    getCatalogueInfo({
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

  return (
    <div>
      <MobileView>
        <Snackbar title="Catalogues" />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title="Catalogues" />
          </DesktopView>

          <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 gap-y-6 mt-4 lg:mt-0">
              {cataloguesToShow.map(catalogue => (
                <CatalogueInfo key={catalogue.id} catalogue={catalogue} layout={CatalogueInfoLayoutType.BLOCK} />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const catalogueInfos = await getCatalogueInfo({
    offset: 0,
    limit: INFINITE_SCROLL_FETCH_LIMIT,
  })

  return {
    props: {
      pageData: {
        catalogueInfos: catalogueInfos,
      },
      seo: prepareCatalogueIndexPageSeo(),
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

export default CatalogueIndexPage
