import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../../_app'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import { PAGE_REVALIDATE_TIME, INITIAL_PAGE_BUILD_COUNT } from '../../../constants/constants'
import { getComboProductInfo, getComboProductDetailById } from '../../../http/product'
import { IComboProductDetail } from '../../../contract/product'
import ApiError from '../../../error/ApiError'
import { get404PageUrl } from '../../../utils/error'
import { useRouter } from 'next/router'
import PageLoader from '../../../components/loader/PageLoader'
import { DesktopView, MobileView } from '../../../components/ResponsiveViews'
import Snackbar from '../../../components/header/Snackbar'
import PageContainer from '../../../components/PageContainer'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../components/core/CoreButton'
import { HeartIcon as HeartIconOutline, ShoppingBagIcon } from '@heroicons/react/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid'
import ProductFeatureSections from '../../../components/product/ProductFeatureSections'
import ProductAttributes from '../../../components/product/ProductAttributes'
import ApplicationContext from '../../../components/ApplicationContext'
import { getComboPageUrl, getProductAddLabel } from '../../../utils/product'
import ProductRelatedProducts from '../../../components/product/ProductRelatedProducts'
import ProductImages from '../../../components/product/ProductImages'
import ProductNameAndPrice from '../../../components/product/ProductNameAndPrice'
import { getPageSections } from '../../../http/section'
import { ISectionInfo } from '../../../contract/section'
import Section from '../../../components/section/Section'
import ProductInfo, { ProductInfoLayoutType } from '../../../components/product/ProductInfo'
import LoginPromptModal from '../../../components/login/LoginPromptModal'
import { addUserWish, isProductWishlisted } from '../../../utils/wishlist'
import { addSessionUserWishInfo } from '../../../http/wishlist'
import { addToCart, getCartItemFromProduct, incrementCartQuantityWithProduct } from '../../../utils/cart'
import { addCartItemInfo } from '../../../http/cart'
import ProductInCartMessage from '../../../components/product/ProductInCartMessage'
import EscapeHTML from '../../../components/EscapeHTML'
import { toastError, toastSuccess } from '../../../components/Toaster'
import { prepareComboPageSeo } from '../../../utils/seo/pages/product'
import appAnalytics from '../../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../../constants/analytics'
import { prepareProductAnalyticsParams } from '../../../utils/analytics'
import BackTitle from '../../../components/BackTitle'
import { PageSectionType } from '../../../contract/constants'
import NoContent from '../../../components/NoContent'
import { getSearchPageUrl } from '../../../utils/search'
import { vibrate } from '../../../utils/common'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    comboDetail: IComboProductDetail
    sections: ISectionInfo[]
  }
}

const ComboPage: NextPage<IProps> = props => {
  const { isFallback } = useRouter()

  if (isFallback || !props.pageData) {
    return <PageLoader />
  }

  const { comboDetail, sections } = props.pageData
  const { type, id, name, description, sku, productsRelation, attributes, featureSections, images } = comboDetail

  const isAvailable = sku.availableQuantity > 0
  const comingSoon = sku.comingSoon

  const [showLoginPrompt, toggleLoginPrompt] = useState(false)
  const [cartLoading, toggleCartLoading] = useState(false)
  const [wishlistLoading, toggleWishlistLoading] = useState(false)

  const applicationContext = useContext(ApplicationContext)
  const { user, wishlist, cart, updaters } = applicationContext

  useEffect(() => {
    appAnalytics.sendEvent({
      action: AnalyticsEventType.VIEW_PRODUCT,
      extra: prepareProductAnalyticsParams({
        items: [{ product: comboDetail, quantity: 1 }],
        value: comboDetail.sku.salePrice,
      }),
    })
  }, [])

  const handleWishlistClick = () => {
    if (!user) {
      toggleLoginPrompt(true)
      return
    }

    toggleWishlistLoading(true)
    addSessionUserWishInfo({ productId: comboDetail.id, productType: comboDetail.type })
      .then(resp => {
        if (resp.success && resp.userWish) {
          updaters.updateWishlist(addUserWish(wishlist, resp.userWish))
          toastSuccess('Added to your Wishlist')
          appAnalytics.sendEvent({
            action: AnalyticsEventType.ADD_TO_WISHLIST,
            extra: prepareProductAnalyticsParams({
              items: [{ product: comboDetail, quantity: 1 }],
              value: comboDetail.sku.salePrice,
            }),
          })
        }
      })
      .catch(e => {
        toastError('Failed to add to your Wishlist')
      })
      .finally(() => {
        toggleWishlistLoading(false)
      })
  }

  const handleCartClick = () => {
    if (!user) {
      toggleLoginPrompt(true)
      return
    }

    const productInCart = getCartItemFromProduct(cart.cartItems, comboDetail)

    toggleCartLoading(true)
    addCartItemInfo({
      productId: comboDetail.id,
      productType: comboDetail.type,
      totalQuantity: productInCart ? productInCart.quantity + 1 : 1,
    })
      .then(resp => {
        if (resp.success) {
          if (resp.cartItem) {
            updaters.updateCart({ ...cart, cartItems: addToCart(cart.cartItems, resp.cartItem) })
          } else {
            const updatedCartItems = incrementCartQuantityWithProduct(cart.cartItems, comboDetail)
            updaters.updateCart({ ...cart, cartItems: updatedCartItems })
          }
          vibrate()
          toastSuccess('Added to your cart')
          appAnalytics.sendEvent({
            action: AnalyticsEventType.ADD_TO_CART,
            extra: prepareProductAnalyticsParams({
              items: [{ product: comboDetail, quantity: 1 }],
              value: comboDetail.sku.salePrice,
            }),
          })
        }
      })
      .catch(e => {
        toastError('Failed to add to your cart')
      })
      .finally(() => {
        toggleCartLoading(false)
      })
  }

  const addedToWishlist = isProductWishlisted(wishlist || [], comboDetail)

  const renderNotFoundContent = () => {
    return (
      <div>
        <NoContent message="No such product found. Please keep exploring!" />
        <div className="text-center">
          <CoreButton
            label="Search product"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            url={getSearchPageUrl()}
          />
        </div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div>
        <div className="lg:flex justify-between mt-5">
          <div className="mb-5">
            <MobileView useCSS>
              <ProductNameAndPrice productDetail={comboDetail} urlPath={getComboPageUrl(comboDetail)} />
            </MobileView>
          </div>

          <div className="lg:w-[68%]">
            <ProductImages images={images} productDetail={comboDetail} />
          </div>

          <div className="lg:max-w-[400px] lg:w-[32%]">
            <div>
              <DesktopView useCSS>
                <ProductNameAndPrice productDetail={comboDetail} urlPath={getComboPageUrl(comboDetail)} />
              </DesktopView>

              <MobileView useCSS>
                <div className="pt-2">
                  <ProductInCartMessage productInfo={comboDetail} />
                </div>
              </MobileView>

              <div className="p-4 flex flex-col md:flex-row lg:flex-col">
                <CoreButton
                  label={
                    <React.Fragment>
                      <ShoppingBagIcon className="w-5 mr-1" />
                      <span>{getProductAddLabel(comboDetail)}</span>
                    </React.Fragment>
                  }
                  size={CoreButtonSize.LARGE}
                  type={CoreButtonType.SOLID_PRIMARY}
                  disabled={!isAvailable || comingSoon}
                  className="mb-2 py-3 md:mb-0 rounded-lg md:w-1/2 md:mr-2 lg:w-full lg:mr-0 lg:mb-2"
                  onClick={handleCartClick}
                  loading={cartLoading}
                />
                <CoreButton
                  label={
                    addedToWishlist ? (
                      <React.Fragment>
                        <HeartIconSolid className="w-5 mr-1" />
                        <span>Added to Wishlist</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <HeartIconOutline className="w-5 mr-1" />
                        <span>Wishlist</span>
                      </React.Fragment>
                    )
                  }
                  size={CoreButtonSize.LARGE}
                  type={CoreButtonType.SOLID_SECONDARY}
                  disabled={!isAvailable || comingSoon || addedToWishlist}
                  className="py-3 rounded-lg md:w-1/2 lg:w-full"
                  onClick={handleWishlistClick}
                  loading={wishlistLoading}
                />
              </div>

              {productsRelation ? (
                <ProductRelatedProducts productsRelation={productsRelation} comboProductDetail={comboDetail} />
              ) : null}

              <div className="text-primaryText p-4 text-base html-body">
                <EscapeHTML html={description} element="div" />
              </div>

              <ProductAttributes productAttributes={attributes} />

              {comboDetail.products.length ? (
                <div className="p-4">
                  <div className="font-medium font-primary-medium text-primaryTextBold mb-3">Items in this Combo</div>
                  <div className="">
                    {comboDetail.products.map(individualProduct => (
                      <ProductInfo
                        key={individualProduct.id}
                        layout={ProductInfoLayoutType.INLINE}
                        product={individualProduct}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <ProductFeatureSections productFeatureSections={featureSections} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          {sections.map((section, index) => (
            <Section key={index} section={section} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <MobileView>
        <Snackbar title={'Combo Product'} />
      </MobileView>

      <PageContainer>
        <DesktopView>
          <BackTitle title={'Combo Product'} />
        </DesktopView>

        {!comboDetail.isActive ? renderNotFoundContent() : renderContent()}
      </PageContainer>

      {showLoginPrompt ? <LoginPromptModal toggleModal={toggleLoginPrompt} /> : null}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const comboProducts = await getComboProductInfo({
    limit: INITIAL_PAGE_BUILD_COUNT.COMBO,
  })

  const paths: any = comboProducts.map(comboProduct => ({
    params: {
      comboId: `${comboProduct.id}`,
      comboSlug: comboProduct.slug,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any

  let comboDetail: IComboProductDetail
  let invalidProduct = false

  try {
    comboDetail = await getComboProductDetailById(params.comboId)
  } catch (e) {
    if ((e as ApiError).response.code === 'ENTITY_NOT_FOUND') {
      invalidProduct = true
    }
  }

  if (invalidProduct) {
    return {
      redirect: {
        destination: get404PageUrl(),
        permanent: false,
      },
    }
  }

  if (comboDetail && params.comboSlug !== comboDetail.slug) {
    return {
      redirect: {
        destination: getComboPageUrl(comboDetail),
        permanent: true,
      },
    }
  }

  const sections = await getPageSections(PageSectionType.COMBO_PRODUCT)

  return {
    props: {
      pageData: {
        comboDetail: comboDetail,
        sections: sections,
      },
      seo: prepareComboPageSeo(comboDetail),
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
    revalidate: PAGE_REVALIDATE_TIME.COMBO,
  }
}

export default ComboPage
