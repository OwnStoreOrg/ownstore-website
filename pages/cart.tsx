import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import { MobileView, DesktopView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import NoContent, { NoContentType } from '../components/NoContent'
import AddressInfo, { AddressInfoSize } from '../components/address/AddressInfo'
import { LocationMarkerIcon, ChevronRightIcon, LockClosedIcon } from '@heroicons/react/solid'
import { TrashIcon } from '@heroicons/react/outline'
import { getAddressPageUrl, getUserAddressToShow } from '../utils/account'
import SelectAddressModal from '../components/address/SelectAddressModal'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../components/core/CoreButton'
import { getHomePageUrl } from '../utils/home'
import Loader, { LoaderType } from '../components/loader/Loader'
import ProductInfo, { ProductInfoLayoutType } from '../components/product/ProductInfo'
import CounterButton from '../components/CounterButton'
import { IComboProductInfo, IIndividualProductInfo } from '../contract/product'
import { filterInactiveItem, pluralize, prependZero } from '../utils/common'
import ApplicationContext from '../components/ApplicationContext'
import { getLoginPageUrl } from '../utils/login'
import { useRouter } from 'next/router'
import { IUserAddressInfo } from '../contract/address'
import { addCartItemInfo, deleteCartItemInfo } from '../http/cart'
import { incrementCartQuantity, removeFromCart } from '../utils/cart'
import { ICartItem } from '../contract/cart'
import { toastError, toastSuccess } from '../components/Toaster'
import {
  getCartCurrency,
  getCartDeliveryTotal,
  getCartDiscountTotal,
  getCartExtraChargesTotal,
  getCartRetailTotal,
  getCartSaleTotal,
  getCartTaxTotal,
  getCartTotal,
} from '../utils/payment'
import { DynamicCheckoutModal } from '../components/dynamicComponents'
import CartSummary from '../components/cart/CartSummary'
import { QUERY_PARAM_MAP } from '../constants/constants'
import { prepareCartPageSeo } from '../utils/seo/pages/cart'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import { prepareAnalyticsProductItem, prepareProductAnalyticsParams } from '../utils/analytics'
import { shouldDisableProduct } from '../utils/product'
import Alert from '../components/modal/Alert'
import appConfig from '../config/appConfig'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const CartPage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { cart, user, setting, updaters, userGlobalDetailLoaded } = applicationContext

  const router = useRouter()

  const [showSelectAddressModal, toggleSelectAddressModal] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<IUserAddressInfo | undefined>(undefined)
  const [showCheckout, toggleCheckout] = useState(false)
  const [showInActiveUserAlert, toggleInActiveUserAlert] = useState(false)
  const [showNoOrdersAlert, toggleNoOrdersAlert] = useState(false)

  const activeAddresses = filterInactiveItem(user?.addresses || [])

  useEffect(() => {
    if (user?.addresses) {
      setSelectedAddress(getUserAddressToShow(activeAddresses))
    }
  }, [user])

  useEffect(() => {
    if (cart?.cartItems.length) {
      appAnalytics.sendEvent({
        action: AnalyticsEventType.VIEW_CART,
        extra: {
          ...prepareProductAnalyticsParams({
            items: cart.cartItems.map(cartItem => ({
              product: cartItem.product,
              quantity: cartItem.quantity,
            })),
            value: getCartSaleTotal(cart),
          }),
          shipping: getCartDeliveryTotal(cart),
        },
      })
    }
  }, [cart])

  const isLoading = !userGlobalDetailLoaded

  const updateCartQuantity = (cartItem: ICartItem, totalQuantity: number) => {
    const productInfo = cartItem.product as IIndividualProductInfo | IComboProductInfo

    addCartItemInfo({
      productId: productInfo.id,
      productType: cartItem.product.type,
      totalQuantity: totalQuantity,
    })
      .then(resp => {
        if (resp.success) {
          updaters.updateCart({
            ...cart,
            cartItems: incrementCartQuantity(cart.cartItems, {
              ...cartItem,
              quantity: totalQuantity,
            }),
          })

          const analyticsParams = prepareProductAnalyticsParams({
            items: [{ product: productInfo, quantity: 1 }],
            value: productInfo.sku.salePrice,
          })

          if (totalQuantity > cartItem.quantity) {
            appAnalytics.sendEvent({
              action: AnalyticsEventType.ADD_TO_CART,
              extra: analyticsParams,
            })
          } else {
            appAnalytics.sendEvent({
              action: AnalyticsEventType.REMOVE_FROM_CART,
              extra: analyticsParams,
            })
          }
        }
      })
      .catch(e => {
        toastError('Failed to update your cart')
      })
  }

  const deleteCartItem = (cartItem: ICartItem) => {
    const productInfo = cartItem.product as IIndividualProductInfo | IComboProductInfo

    deleteCartItemInfo(cartItem.id)
      .then(resp => {
        if (resp.success) {
          updaters.updateCart({
            ...cart,
            cartItems: removeFromCart(cart.cartItems, cartItem),
          })

          appAnalytics.sendEvent({
            action: AnalyticsEventType.DELETE_CART_ITEM,
            extra: prepareProductAnalyticsParams({
              items: [{ product: productInfo, quantity: 1 }],
              value: productInfo.sku.salePrice,
            }),
          })

          toastSuccess('Product removed from your cart')
        }
      })
      .catch(e => {
        toastError('Failed to delete product from your cart')
      })
  }

  const onQuantityIncrement = (e: any, cartItem: ICartItem) => {
    e.preventDefault()
    e.stopPropagation()

    const totalQuantity = cartItem.quantity + 1
    const productInfo = cartItem.product as IIndividualProductInfo | IComboProductInfo

    if (totalQuantity > productInfo.sku.availableQuantity) {
      toastError(`Inadequate quantity available for this product. Only ${productInfo.sku.availableQuantity} left.`)
      return
    }

    updateCartQuantity(cartItem, totalQuantity)
  }

  const onQuantityDecrement = (e: any, cartItem: ICartItem) => {
    e.preventDefault()
    e.stopPropagation()

    const totalQuantity = cartItem.quantity - 1

    if (totalQuantity === 0) {
      deleteCartItem(cartItem)
      return
    }

    updateCartQuantity(cartItem, totalQuantity)
  }

  const handleCartCheckout = () => {
    if (!user.isActive) {
      toggleInActiveUserAlert(true)
      return
    }

    if (!setting.allow.newOrders) {
      toggleNoOrdersAlert(true)
      return
    }

    if (!selectedAddress) {
      toastError('Please add an address to continue')
      return
    }

    appAnalytics.sendEvent({
      action: AnalyticsEventType.BEGIN_CHECKOUT,
      extra: prepareProductAnalyticsParams({
        items: cart.cartItems.map(cartItem => ({
          product: cartItem.product,
          quantity: cartItem.quantity,
        })),
        value: getCartSaleTotal(cart),
      }),
    })

    toggleCheckout(true)
  }

  const renderLoader = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader type={LoaderType.ELLIPSIS} />
        <div>Fetching your cart details...</div>
      </div>
    )
  }

  const renderLoginContent = () => {
    return (
      <div>
        <NoContent message="Please login to view your cart products." type={NoContentType.LOGIN} />
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
        <NoContent message="Your cart is empty. Products you add in your cart will show up here." />
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

  const renderContent = () => {
    const retailTotal = getCartRetailTotal(cart)
    const saleTotal = getCartSaleTotal(cart)
    const discountTotal = getCartDiscountTotal(cart)
    const deliveryTotal = getCartDeliveryTotal(cart)
    const total = getCartTotal(cart)
    const extraChargesTotal = getCartExtraChargesTotal(cart)
    const taxTotal = getCartTaxTotal(cart)

    const cartCurrency = getCartCurrency(cart)

    return (
      <div className="lg:flex justify-between ">
        <div className="lg:w-[70%] mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cart.cartItems.map((cartItem, index) => {
              const productInfo = cartItem.product as IIndividualProductInfo | IComboProductInfo
              const canRemove = shouldDisableProduct(productInfo)

              return (
                <div key={cartItem.id} className="relative">
                  <ProductInfo layout={ProductInfoLayoutType.BLOCK} product={cartItem.product} />
                  {canRemove ? (
                    <div className="absolute right-2 top-2 z-[1] flex">
                      <div
                        className="bg-white p-2 rounded-full border border-gray400 text-primaryTextBold cursor-pointer group"
                        onClick={e => deleteCartItem(cartItem)}
                        title="Delete">
                        <TrashIcon className="w-5" />
                      </div>
                    </div>
                  ) : (
                    <CounterButton
                      count={prependZero(cartItem.quantity)}
                      onDecrement={e => onQuantityDecrement(e, cartItem)}
                      onIncrement={e => onQuantityIncrement(e, cartItem)}
                      className="absolute right-2 top-2 z-[1]"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="lg:w-[30%] lg:ml-10">
          <div className="lg:sticky top-24">
            <CartSummary
              retailAmount={retailTotal}
              saleAmount={saleTotal}
              discountAmount={discountTotal}
              deliveryAmount={deliveryTotal}
              totalAmount={total}
              currency={cartCurrency}
              extraChargesAmount={extraChargesTotal}
              extraChargesPercent={cart.extraCharges.percent}
              taxAmount={taxTotal}
              taxPercent={cart.tax.percent}
              title="Cart Summary"
            />

            <div className="mt-4 border border-gray300 rounded-lg">
              <div className="text-primaryTextBold font-medium font-primary-medium border-b border-gray300 p-3 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <LocationMarkerIcon className="w-6 relative mr-1 text-gray700" />
                  <span>Delivery Address</span>
                </div>
              </div>

              {selectedAddress ? (
                <AddressInfo
                  address={selectedAddress}
                  size={AddressInfoSize.MEDIUM}
                  showCTA={false}
                  showContactNumber={false}
                  className="p-3 py-4"
                />
              ) : (
                <div className="px-4 py-6 text-sm text-gray800">{`You don't have any saved address.`}</div>
              )}
              <div
                className="flex items-center p-3 border-t border-gray300 font-medium font-primary-medium justify-between transition-all bg-white hover:bg-gray100 rounded-b-lg cursor-pointer"
                onClick={() => {
                  if (activeAddresses.length > 0) {
                    toggleSelectAddressModal(true)
                  } else {
                    router.push(`${getAddressPageUrl()}?${QUERY_PARAM_MAP.ADD_ADDRESS}=true`)
                  }
                }}>
                <span>{activeAddresses.length > 0 ? 'Change address' : 'Add a new address'}</span>
                <ChevronRightIcon className="w-6" />
              </div>
            </div>

            <div className="mt-4">
              <CoreButton
                label={
                  <React.Fragment>
                    <span>Place Order</span>
                    <LockClosedIcon className="w-5 ml-1" />
                  </React.Fragment>
                }
                size={CoreButtonSize.LARGE}
                type={CoreButtonType.SOLID_PRIMARY}
                className="w-full py-3"
                disabled={!saleTotal}
                onClick={handleCartCheckout}
              />
            </div>
          </div>
        </div>

        {showInActiveUserAlert ? (
          <Alert
            title="Account Deactivated"
            subTitle="Your account has been deactivated. You cannot proceed further for cart payment. Please contact us for any queries."
            cta={{
              primary: {
                show: true,
                label: 'Okay',
                onClick: () => {
                  toggleInActiveUserAlert(false)
                },
              },
              secondary: {
                show: false,
              },
            }}
            dismissModal={() => toggleInActiveUserAlert(false)}
          />
        ) : null}

        {showNoOrdersAlert ? (
          <Alert
            title="New orders not allowed"
            subTitle="We're no longer accepting new orders. Please contact us for any queries. Sorry for the inconvenience."
            cta={{
              primary: {
                show: true,
                label: 'Okay',
                onClick: () => {
                  toggleNoOrdersAlert(false)
                },
              },
              secondary: {
                show: false,
              },
            }}
            dismissModal={() => toggleNoOrdersAlert(false)}
          />
        ) : null}
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
      if (!cart?.cartItems.length) {
        return renderNoContent()
      } else {
        return renderContent()
      }
    }
  }

  const title =
    cart && cart.cartItems.length
      ? `Cart (${cart.cartItems.length} ${pluralize('item', cart.cartItems.length)})`
      : `Cart`

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

      {showSelectAddressModal ? (
        <SelectAddressModal
          selectedAddress={selectedAddress}
          dismissModal={() => toggleSelectAddressModal(false)}
          onAddressSelect={address => {
            setSelectedAddress(address)
            toggleSelectAddressModal(false)
            toastSuccess('Delivery address changed')
            appAnalytics.sendEvent({
              action: AnalyticsEventType.SELECT_ADDRESS_FOR_DELIVERY,
              extra: {
                address: address,
              },
            })
          }}
        />
      ) : null}

      {showCheckout ? <DynamicCheckoutModal selectedAddress={selectedAddress} toggleModal={toggleCheckout} /> : null}
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareCartPageSeo(),
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

export default CartPage
