import React, { useContext, useEffect, useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from '../_app'
import { DesktopView, MobileView } from '../../components/ResponsiveViews'
import Snackbar from '../../components/header/Snackbar'
import PageContainer from '../../components/PageContainer'
import BackTitle from '../../components/BackTitle'
import AccountLayout from '../../components/layout/AccountLayout'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import NoContent, { NoContentType } from '../../components/NoContent'
import { getLoginPageUrl } from '../../utils/login'
import ApplicationContext from '../../components/ApplicationContext'
import Loader, { LoaderType } from '../../components/loader/Loader'
import { useRouter } from 'next/router'
import { getSessionUserLoginHistory } from '../../http/user'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import { INFINITE_SCROLL_FETCH_LIMIT, QUERY_PARAM_MAP } from '../../constants/constants'
import { IUserLoginAttributesInfo } from '../../contract/user'
import InfiniteScroll from '../../components/InfiniteScroll'
import LoginAttributesInfo from '../../components/LoginAttributes/LoginAttributesInfo'
import classnames from 'classnames'
import { prepareAccountLoginHistoryPageSeo } from '../../utils/seo/pages/account'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const AccountLoginHistoryPage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user, userGlobalDetailLoaded } = applicationContext

  const router = useRouter()

  const { scrollState, scrollDispatch } = useInfiniteScroll({
    initialState: {
      data: [],
      offset: 0,
      hasMore: false,
    },
  })

  const [dataFetched, toggleDataFetched] = useState(false)

  const {
    data: loginHistory,
    offset,
    hasMore,
  }: { data: IUserLoginAttributesInfo[]; offset: number; hasMore: boolean } = scrollState

  useEffect(() => {
    if (user) {
      toggleDataFetched(false)

      getSessionUserLoginHistory({
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
        .finally(() => toggleDataFetched(true))
    }
  }, [user])

  const loadMore = () => {
    if (!dataFetched) {
      return
    }

    const nextOffset = offset + INFINITE_SCROLL_FETCH_LIMIT

    getSessionUserLoginHistory({
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

  const renderLoader = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader type={LoaderType.ELLIPSIS} />
        <div>Fetching your login history...</div>
      </div>
    )
  }

  const renderLoginContent = () => {
    return (
      <div>
        <NoContent message="Please login to view your login history." type={NoContentType.LOGIN} />
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
      <div>
        <InfiniteScroll hasMore={hasMore} loadMore={loadMore}>
          {loginHistory.map((attributes, index) => {
            return (
              <div key={index}>
                <div
                  className={classnames(
                    index !== loginHistory.length - 1 ? 'border-b border-gray300' : '',
                    index === 0 ? 'pb-3' : 'py-3'
                  )}>
                  <LoginAttributesInfo key={index} attributes={attributes} index={index} />
                </div>
              </div>
            )
          })}
        </InfiniteScroll>
      </div>
    )
  }

  const renderNoContent = () => {
    return (
      <div>
        <NoContent message="Login history not found." />
      </div>
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
      } else if (!loginHistory.length) {
        return renderNoContent()
      } else {
        return renderContent()
      }
    }
  }

  return (
    <div>
      <MobileView>
        <Snackbar title="Login History" />
      </MobileView>

      <PageContainer>
        <div className="">
          <DesktopView>
            <BackTitle title="Login History" />
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
      seo: prepareAccountLoginHistoryPageSeo(),
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

export default AccountLoginHistoryPage
