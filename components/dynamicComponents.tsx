import dynamic from 'next/dynamic'

export const DynamicCheckoutModal = dynamic(
  () => import(/* webpackChunkName: "CheckoutModal" */ 'components/payment/CheckoutModal'),
  {
    ssr: false,
  }
)

export const DynamicToaster = dynamic(
  () =>
    import(/* webpackChunkName: "react-hot-toast" */ 'react-hot-toast').then(resp => {
      return resp.Toaster
    }),
  {
    ssr: false,
  }
)

export const DynamicPageTransition: any = dynamic(() =>
  import(/* webpackChunkName: "PageTransition" */ 'next-page-transitions').then(resp => {
    return resp.PageTransition
  })
)

// Faiyaz - Password hint is disabled due to security reasons. https://www.troyhunt.com/adobe-credentials-and-serious/
// export const DynamicUpdatePasswordHintModal = dynamic(
//   () => import(/* webpackChunkName: "UpdatePasswordHintModal" */ 'components/security/UpdatePasswordHintModal'),
//   {
//     ssr: false,
//   }
// )

export const DynamicUpdateSecurityQuestionsModal = dynamic(
  () =>
    import(/* webpackChunkName: "UpdateSecurityQuestionsModal" */ 'components/security/UpdateSecurityQuestionsModal'),
  {
    ssr: false,
  }
)

export const DynamicAnswerSecurityQuestionsModal = dynamic(
  () =>
    import(/* webpackChunkName: "AnswerSecurityQuestionsModal" */ 'components/security/AnswerSecurityQuestionsModal'),
  {
    ssr: false,
  }
)

export const DynamicSupportedRegionsModal = dynamic(
  () => import(/* webpackChunkName: "SupportedRegionsModal" */ 'components/supported-regions/SupportedRegionsModal'),
  {
    ssr: false,
  }
)

export const DynamicAddAddressInfoModal = dynamic(
  () => import(/* webpackChunkName: "AddAddressInfoModal" */ 'components/address/AddAddressInfoModal'),
  {
    ssr: false,
  }
)

export const DynamicCancelOrderModal = dynamic(
  () => import(/* webpackChunkName: "CancelOrderModal" */ 'components/order/CancelOrderModal'),
  {
    ssr: false,
  }
)

export const DynamicCartTaxAndChargesModal = dynamic(
  () => import(/* webpackChunkName: "CartTaxAndChargesModal" */ 'components/cart/CartTaxAndChargesModal'),
  {
    ssr: false,
  }
)
