import React, { useContext } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from './_app'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import BackTitle from '../components/BackTitle'
import PageContainer from '../components/PageContainer'
import { IUserWishInfo } from '../contract/userWish'
import ProductInfo, { ProductInfoLayoutType } from '../components/product/ProductInfo'
import { ShoppingBagIcon, TrashIcon } from '@heroicons/react/outline'
import NoContent, { NoContentType } from '../components/NoContent'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../components/core/CoreButton'
import { getHomePageUrl } from '../utils/home'
import { getLoginPageUrl } from '../utils/login'
import ApplicationContext from '../components/ApplicationContext'
import Loader, { LoaderType } from '../components/loader/Loader'
import { useRouter } from 'next/router'
import { deleteSessionUserWishInfo } from '../http/wishlist'
import { addCartItemInfo } from '../http/cart'
import { IComboProductInfo, IIndividualProductInfo } from '../contract/product'
import { addToCart, getCartItemFromProduct, getCartPageUrl, incrementCartQuantityWithProduct } from '../utils/cart'
import { removeUserWish } from '../utils/wishlist'
import { pluralize, vibrate } from '../utils/common'
import { toastError, toastSuccess } from '../components/Toaster'
import { QUERY_PARAM_MAP } from '../constants/constants'
import { prepareWishlistPageSeo } from '../utils/seo/pages/wishlist'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import { prepareProductAnalyticsParams } from '../utils/analytics'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const WishListPage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user, wishlist, cart, updaters, userGlobalDetailLoaded } = applicationContext

  const router = useRouter()

  const isLoading = !userGlobalDetailLoaded

  const onDeleteClick = (e: any, userWish: IUserWishInfo) => {
    e.preventDefault()
    e.stopPropagation()

    const productInfo = userWish.product as IIndividualProductInfo | IComboProductInfo

    deleteSessionUserWishInfo(userWish.id)
      .then(resp => {
        if (resp.success) {
          updaters.updateWishlist(removeUserWish(wishlist, userWish))
          toastSuccess('Removed from your Wishlist')
          appAnalytics.sendEvent({
            action: AnalyticsEventType.REMOVE_FROM_WISHLIST,
            extra: prepareProductAnalyticsParams({
              items: [{ product: productInfo, quantity: 1 }],
              value: productInfo.sku.salePrice,
            }),
          })
        }
      })
      .catch(e => {
        toastError('Failed to remove from your Wishlist')
      })
  }

  const onAddClick = (e: any, userWish: IUserWishInfo) => {
    e.preventDefault()
    e.stopPropagation()

    const productInCart = getCartItemFromProduct(cart.cartItems, userWish.product)

    Promise.all([
      deleteSessionUserWishInfo(userWish.id),
      addCartItemInfo({
        productId: (userWish.product as IIndividualProductInfo | IComboProductInfo).id,
        productType: userWish.product.type,
        totalQuantity: productInCart ? productInCart.quantity + 1 : 1,
      }),
    ])
      .then(resp => {
        const [userWishDelete, userWishCart] = resp
        if (userWishDelete.success && userWishCart.success) {
          vibrate()

          if (userWishCart.cartItem) {
            updaters.updateCart({ ...cart, cartItems: addToCart(cart.cartItems, userWishCart.cartItem) })
            toastSuccess('Moved to cart')
          } else {
            const updatedCartItems = incrementCartQuantityWithProduct(cart.cartItems, userWish.product)
            updaters.updateCart({ ...cart, cartItems: updatedCartItems })
            toastSuccess('Moved to cart and updated its quantity')
          }

          const productInfo = userWish.product as IIndividualProductInfo | IComboProductInfo

          const analyticsParams = prepareProductAnalyticsParams({
            items: [{ product: productInfo, quantity: 1 }],
            value: productInfo.sku.salePrice,
          })

          appAnalytics.sendEvent({
            action: AnalyticsEventType.MOVE_TO_CART,
            extra: analyticsParams,
          })
          appAnalytics.sendEvent({
            action: AnalyticsEventType.ADD_TO_CART,
            extra: analyticsParams,
          })

          updaters.updateWishlist(removeUserWish(wishlist, userWish))
        }
      })
      .catch(e => {
        toastError('Failed to move to cart')
      })
  }

  const title = wishlist?.length ? `Wishlist (${wishlist.length} ${pluralize('item', wishlist.length)})` : 'Wishlist'

  const renderLoader = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader type={LoaderType.ELLIPSIS} />
        <div>Fetching your wishlist...</div>
      </div>
    )
  }

  const renderLoginContent = () => {
    return (
      <div>
        <NoContent message="Please login to view your liked products." type={NoContentType.LOGIN} />
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

  const renderNoContent = () => {
    return (
      <div>
        <NoContent message="You can view your liked products here. Explore more to add few..." />
        <div className="text-center">
          <CoreButton
            label="Browse products"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            // url={getHomePageUrl()}
            className="mr-1"
          />
          <CoreButton
            label="View cart"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_SECONDARY}
            url={getCartPageUrl()}
          />
        </div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6">
        {wishlist.map((wish, index) => {
          return (
            <div key={index} className="relative">
              <div className="absolute right-2 top-2 z-[1] flex">
                <div
                  className="bg-white p-2 rounded-full border border-gray400 cursor-pointer mr-2 group"
                  onClick={e => onAddClick(e, wish)}
                  title="Move to Cart">
                  <ShoppingBagIcon className="w-5 text-primaryTextBold" />
                </div>
                <div
                  className="bg-white p-2 rounded-full border border-gray400 cursor-pointer group"
                  onClick={e => onDeleteClick(e, wish)}
                  title="Delete">
                  <TrashIcon className="w-5 text-primaryTextBold" />
                </div>
              </div>

              <ProductInfo layout={ProductInfoLayoutType.BLOCK} product={wish.product} />
            </div>
          )
        })}
      </div>
    )
  }

  const contentDecider = () => {
    if (isLoading) {
      return renderLoader()
    }
    if (!user) {
      return renderLoginContent()
    } else {
      if (!wishlist?.length) {
        return renderNoContent()
      } else {
        return renderContent()
      }
    }
  }

  return (
    <div>
      <MobileView>
        <Snackbar title={title} />
      </MobileView>

      <PageContainer>
        <div className="px-2">
          <DesktopView>
            <BackTitle title={title} />
          </DesktopView>

          <div className="mt-4">{contentDecider()}</div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareWishlistPageSeo(),
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

export default WishListPage
