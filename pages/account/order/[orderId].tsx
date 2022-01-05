import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import { IGlobalLayoutProps } from '../../_app'
import { MobileView, DesktopView } from '../../../components/ResponsiveViews'
import Snackbar from '../../../components/header/Snackbar'
import NoContent, { NoContentType } from '../../../components/NoContent'
import PageContainer from '../../../components/PageContainer'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../components/core/CoreButton'
import BackTitle from '../../../components/BackTitle'
import Loader, { LoaderType } from '../../../components/loader/Loader'
import { getLoginPageUrl } from '../../../utils/login'
import ApplicationContext from '../../../components/ApplicationContext'
import { getSessionUserOrderDetail } from '../../../http/order'
import { IOrderDetail } from '../../../contract/order'
import AccountLayout from '../../../components/layout/AccountLayout'
import { useRouter } from 'next/router'
import PageLoader from '../../../components/loader/PageLoader'
import { getFormattedDateTime } from '../../../utils/dates'
import ProductInfo, { ProductInfoLayoutType } from '../../../components/product/ProductInfo'
import CounterButton from '../../../components/CounterButton'
import { prependZero } from '../../../utils/common'
import CartSummary from '../../../components/cart/CartSummary'
import classnames from 'classnames'
import { QUERY_PARAM_MAP } from '../../../constants/constants'
import { prepareAccountOrderDetailPageSeo } from '../../../utils/seo/pages/account'
import { XIcon } from '@heroicons/react/outline'
import { DynamicCancelOrderModal } from '../../../components/dynamicComponents'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    orderId: number
  }
}

const OrderDetails: NextPage<IProps> = props => {
  const router = useRouter()
  const { isFallback } = router

  if (isFallback || !props.pageData) {
    return <PageLoader />
  }

  const { pageData } = props
  const { orderId } = pageData

  const applicationContext = useContext(ApplicationContext)
  const { user, userGlobalDetailLoaded } = applicationContext

  const [order, setOrder] = useState<IOrderDetail>(null)
  const [dataFetched, toggleDataFetched] = useState(false)
  const [showCancelOrderModal, toggleCancelOrderModal] = useState(false)

  useEffect(() => {
    if (user) {
      toggleDataFetched(false)

      getSessionUserOrderDetail(orderId)
        .then(resp => {
          if (resp) {
            setOrder(resp)
          }
        })
        .catch(console.error)
        .finally(() => {
          toggleDataFetched(true)
        })
    }
  }, [user])

  const isCancelled = order ? !!order.orderCancellation : false

  const recentOrderHistory = order ? order.orderStatusHistory[0] : null

  const renderNoContent = () => {
    return (
      <div>
        <NoContent message="No such order found." />
      </div>
    )
  }

  const renderLoader = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader type={LoaderType.ELLIPSIS} />
        <div>Fetching order...</div>
      </div>
    )
  }

  const renderLoginContent = () => {
    return (
      <div>
        <NoContent message="Please login to view the order" type={NoContentType.LOGIN} />
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

  const renderItem = (title: ReactNode, subTitle: ReactNode, className?: string) => {
    return (
      <div className={classnames('mb-4', className)}>
        <div className="uppercase text-xs font-medium font-primary-medium">{title}</div>
        <div className="text-primaryTextBold text-base">{subTitle}</div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <CoreButton
            label={
              <React.Fragment>
                <XIcon className="w-5 mr-1" />
                <span>{isCancelled ? 'Order Cancelled' : 'Cancel Order'}</span>
              </React.Fragment>
            }
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_SECONDARY}
            disabled={isCancelled}
            onClick={() => toggleCancelOrderModal(true)}
          />
        </div>

        <div className="md:flex">
          <div className="mb-6 md:w-7/12">
            {renderItem('Order No', order.id)}
            {renderItem('Status', <span className="text-sm">{recentOrderHistory.status.name}</span>)}
            {order.statusText ? renderItem('Status Text', order.statusText) : null}
            {renderItem('Date', getFormattedDateTime(order.createdDateTime))}
            {renderItem('Phone Number', order.address.phoneNumber)}
            {renderItem(
              'Deliver To',
              [
                order.address.addressLine,
                `${order.address.area}${order.address.areaCode ? ` - ${order.address.areaCode}` : ''}`,
                order.address.city,
                order.address.country,
              ]
                .filter(Boolean)
                .join(', ')
            )}
            {renderItem('Payment Method', order.paymentMethod)}
            {order.orderCancellation ? (
              <>
                <hr className="text-gray300 my-4" />
                {renderItem('Cancelled Date', getFormattedDateTime(order.orderCancellation.createdDateTime))}
                {renderItem('Cancellation Reason', order.orderCancellation.reason)}
              </>
            ) : null}
          </div>

          <div className="mb-6 md:ml-4 md:w-5/12">
            <CartSummary
              retailAmount={order.retailAmount}
              saleAmount={order.saleAmount}
              discountAmount={order.discountAmount}
              deliveryAmount={order.deliveryAmount}
              totalAmount={order.totalAmount}
              extraChargesAmount={order.extraChargesAmount}
              extraChargesPercent={order.cart.extraCharges.percent}
              taxAmount={order.taxAmount}
              taxPercent={order.cart.tax.percent}
              currency={order.currency}
              title="Order Summary"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-primaryTextBold text-base lg:text-lg font-medium font-primary-medium mb-2">Products</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {order.cart.cartItems.map(cartItem => {
              return (
                <div key={cartItem.id} className="relative">
                  <ProductInfo layout={ProductInfoLayoutType.BLOCK} product={cartItem.product} />
                  <CounterButton
                    count={prependZero(cartItem.quantity)}
                    disabled
                    className="absolute right-2 top-2 z-[1]"
                  />
                </div>
              )
            })}
          </div>
        </div>
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
      } else if (!order) {
        return renderNoContent()
      } else {
        return renderContent()
      }
    }
  }

  const title = order ? `Order #${order.id}` : `Order Details`

  return (
    <div>
      <MobileView>
        <Snackbar title={title} />
      </MobileView>

      <PageContainer>
        <div className="">
          <DesktopView>
            <BackTitle title={title} />
          </DesktopView>

          <AccountLayout
            hideAccountLinks={{
              desktop: false,
              mobile: true,
            }}>
            <div className="px-3 mt-4 lg:mt-0">{ContentDecider()}</div>
          </AccountLayout>
        </div>
      </PageContainer>

      {showCancelOrderModal ? (
        <DynamicCancelOrderModal
          orderDetail={order}
          dismissModal={() => toggleCancelOrderModal(false)}
          updateOrder={setOrder}
        />
      ) : null}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any

  return {
    props: {
      pageData: {
        orderId: params.orderId,
      },
      seo: prepareAccountOrderDetailPageSeo(params.orderId),
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

export default OrderDetails
