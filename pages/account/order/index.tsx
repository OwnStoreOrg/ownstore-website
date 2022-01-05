import { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import ApplicationContext from '../../../components/ApplicationContext'
import BackTitle from '../../../components/BackTitle'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../components/core/CoreButton'
import Snackbar from '../../../components/header/Snackbar'
import InfiniteScroll from '../../../components/InfiniteScroll'
import AccountLayout from '../../../components/layout/AccountLayout'
import Loader, { LoaderType } from '../../../components/loader/Loader'
import NoContent, { NoContentType } from '../../../components/NoContent'
import OrderInfo from '../../../components/order/OrderInfo'
import PageContainer from '../../../components/PageContainer'
import { DesktopView, MobileView } from '../../../components/ResponsiveViews'
import { INFINITE_SCROLL_FETCH_LIMIT, QUERY_PARAM_MAP } from '../../../constants/constants'
import { IOrderInfo } from '../../../contract/order'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import { getSessionUserOrderInfos } from '../../../http/order'
import { getHomePageUrl } from '../../../utils/home'
import { getLoginPageUrl } from '../../../utils/login'
import { prepareAccountOrdersPageSeo } from '../../../utils/seo/pages/account'
import { IGlobalLayoutProps } from '../../_app'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const AccountOrdersPage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user, userGlobalDetailLoaded } = applicationContext

  const router = useRouter()

  const [dataFetched, toggleDataFetched] = useState(false)

  const { scrollState, scrollDispatch } = useInfiniteScroll({
    initialState: {
      data: [],
      offset: 0,
      hasMore: false,
    },
  })

  const { data: orders, offset, hasMore }: { data: IOrderInfo[]; offset: number; hasMore: boolean } = scrollState

  useEffect(() => {
    if (user) {
      toggleDataFetched(false)

      getSessionUserOrderInfos({
        offset: 0,
        limit: INFINITE_SCROLL_FETCH_LIMIT,
      })
        .then(resp => {
          if (resp) {
            scrollDispatch({
              type: 'success',
              payload: {
                data: resp,
                offset: 0,
                hasMore: true,
                shouldReplace: true,
              },
            })
          }
        })
        .catch(console.error)
        .finally(() => {
          toggleDataFetched(true)
        })
    }
  }, [user])

  const loadMore = () => {
    const nextOffset = offset + INFINITE_SCROLL_FETCH_LIMIT

    getSessionUserOrderInfos({
      offset: nextOffset,
      limit: INFINITE_SCROLL_FETCH_LIMIT,
    })
      .then(resp => {
        if (resp.length) {
          scrollDispatch({
            type: 'success',
            payload: {
              data: resp,
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

  const renderNoContent = () => {
    return (
      <div>
        <NoContent message="No past orders found. Try exploring few products!" />
        <div className="text-center">
          <CoreButton
            label="Start Shopping"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            url={getHomePageUrl()}
          />
        </div>
      </div>
    )
  }

  const renderLoader = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader type={LoaderType.ELLIPSIS} />
        <div>Fetching your orders...</div>
      </div>
    )
  }

  const renderLoginContent = () => {
    return (
      <div>
        <NoContent message="Please login to view your past orders." type={NoContentType.LOGIN} />
        <div className="text-center">
          <CoreButton
            label="Login to view"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            url={`${getLoginPageUrl()}?${QUERY_PARAM_MAP.BACK_PAGE_URL}=${router.asPath}`}
          />
        </div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <InfiniteScroll hasMore={hasMore} loadMore={loadMore}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map(order => (
            <OrderInfo key={order.id} orderInfo={order} />
          ))}
        </div>
      </InfiniteScroll>
    )
  }

  const ContentDecider = () => {
    if (!userGlobalDetailLoaded) {
      return renderLoader()
    }
    if (!user) {
      return renderLoginContent()
    } else {
      if (!dataFetched) {
        return renderLoader()
      } else if (!orders.length) {
        return renderNoContent()
      } else {
        return renderContent()
      }
    }
  }

  return (
    <div>
      <MobileView>
        <Snackbar title="Order History" />
      </MobileView>

      <PageContainer>
        <div className="">
          <DesktopView>
            <BackTitle title="Order History" />
          </DesktopView>

          <AccountLayout
            hideAccountLinks={{
              desktop: false,
              mobile: true,
            }}>
            <div className="px-3 lg:px-0 mt-4 lg:mt-0">{ContentDecider()}</div>
          </AccountLayout>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareAccountOrdersPageSeo(),
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

export default AccountOrdersPage
