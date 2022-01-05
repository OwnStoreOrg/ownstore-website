import React, { useContext, useEffect, useRef, useState } from 'react'
import { StripeCardNumberElementOptions } from '@stripe/stripe-js'
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import useOnEnter from '../../hooks/useOnEnter'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config'
import { createPaymentIntent, successfulPayment } from '../../http/payment'
import ApplicationContext from '../ApplicationContext'
import debug from 'debug'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import classnames from 'classnames'
import { IUserAddressInfo } from '../../contract/address'
import { useRouter } from 'next/router'
import { getOrdersPageUrl } from '../../utils/account'
import appConfig from '../../config/appConfig'
import { getCartCurrency, getCartDeliveryTotal, getCartSaleTotal, getCartTotal } from '../../utils/payment'
import EscapeHTML from '../EscapeHTML'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { prepareAnalyticsProductItem, prepareProductAnalyticsParams } from '../../utils/analytics'
import { PaymentMethodType } from '../../contract/constants'
import { prepareImageUrl } from '../../utils/image'
import { vibrate } from '../../utils/common'
import { VibratePatternType } from '../../constants/constants'

const promise = loadStripe(appConfig.integrations.stripePayment.publicCode)

const logger = debug('payment')

const resolvedTailwindConfig = resolveConfig(tailwindConfig)
const theme = resolvedTailwindConfig.theme

const cardStyle: StripeCardNumberElementOptions = {
  style: {
    base: {
      fontSize: theme.fontSize.lg[0],
      fontFamily: theme.fontFamily.primary.join(', '),
      color: theme.colors.mineShaft,
      '::placeholder': {
        fontSize: theme.fontSize.lg[0],
      },
    },
    invalid: {
      color: 'red',
      iconColor: 'red',
    },
  },
}

interface ICheckoutFormProps {
  selectedAddress: IUserAddressInfo
}

const CheckoutFormElements: React.FC<ICheckoutFormProps> = props => {
  const { selectedAddress } = props

  const [processing, toggleProcessing] = useState(false)
  const [success, toggleSuccess] = useState(false)
  const [error, setError] = useState(null)

  const formRef = useRef(null)

  const [clientSecret, setClientSecret] = useState(null)
  const [paymentRequest, setPaymentRequest] = useState(null)

  const stripe = useStripe()
  const elements = useElements()

  const applicationContext = useContext(ApplicationContext)
  const { user, updaters, cart } = applicationContext

  const router = useRouter()

  const cartTotal = getCartTotal(cart)
  const cartCurrency = getCartCurrency(cart)

  useEffect(() => {
    if (!clientSecret) {
      createPaymentIntent()
        .then(resp => {
          if (resp.clientSecret) {
            setClientSecret(resp.clientSecret)
            logger('Fetched client secret')
          }
        })
        .catch(logger)
    }

    // Payment wallet commented
    // if (stripe && appConfig.features.enableWalletPayment) {
    //   const pr = stripe.paymentRequest({
    //     country: appConfig.global.app.countryCode,
    //     currency: appConfig.global.app.currencyCode,
    //     total: {
    //       label: `${appConfig.global.app.name} cart`,
    //       amount: cartTotal * 100,
    //     },
    //     requestPayerEmail: false,
    //     requestPayerName: false,
    //     requestShipping: false,
    //   })

    //   // Check the availability of the Payment Request API.
    //   pr.canMakePayment().then(resp => {
    //     logger('Can make wallet payment', resp)
    //     if (resp) {
    //       setPaymentRequest(pr)
    //     }
    //   })
    // }
  }, [stripe])

  // Payment wallet commented
  // useEffect(() => {
  //   if (paymentRequest) {
  //     paymentRequest.on('paymentmethod', async ev => {
  //       const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
  //         clientSecret,
  //         { payment_method: ev.paymentMethod.id },
  //         { handleActions: false }
  //       )

  //       if (confirmError) {
  //         ev.complete('fail')
  //       } else {
  //         ev.complete('success')
  //         if (paymentIntent.status === 'requires_action') {
  //           const { error, paymentIntent: _paymentIntent } = await stripe.confirmCardPayment(clientSecret)
  //           if (error) {
  //             setError('Failed to process payment.')
  //           } else {
  //             handlePaymentSuccess(_paymentIntent.id, PaymentMethodType.WALLET)
  //           }
  //         } else {
  //           handlePaymentSuccess(paymentIntent.id, PaymentMethodType.WALLET)
  //         }
  //       }
  //     })
  //   }
  // }, [paymentRequest])

  const handleChange = async event => {
    setError(event.error ? event.error.message : '')
  }

  const onNewOrderError = (e: any) => {
    logger(e)
    setError(
      `An Error occured while placing an order. If money is deducted from your bank account, don't worry it will be refunded within 7 working days.`
    )
    appAnalytics.sendEvent({
      action: AnalyticsEventType.FAILED_PAYMENT,
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

    appAnalytics.captureException(e)
  }

  const handlePaymentSuccess = (paymentId: string, paymentMethod: PaymentMethodType) => {
    successfulPayment({
      thirdPartyPaymentId: paymentId,
      addressId: selectedAddress.id,
      paymentMethod: paymentMethod,
    })
      .then(resp => {
        if (resp.success) {
          setError(null)
          toggleSuccess(true)

          vibrate(VibratePatternType.LONG)

          appAnalytics.sendEvent({
            action: AnalyticsEventType.PURCHASE,
            extra: {
              ...prepareProductAnalyticsParams({
                items: cart.cartItems.map(cartItem => ({
                  product: cartItem.product,
                  quantity: cartItem.quantity,
                })),
                value: getCartSaleTotal(cart),
              }),
              shipping: getCartDeliveryTotal(cart),
              transaction_id: resp.orderId,
            },
          })

          updaters.updateCart({
            ...cart,
            cartItems: [],
          })
          setTimeout(() => {
            router.push(getOrdersPageUrl())
          }, 1500)
        } else {
          onNewOrderError(resp)
        }
      })
      .catch(onNewOrderError)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!clientSecret) {
      return
    }

    toggleProcessing(true)

    const stripeProvider = await stripe.confirmCardPayment(clientSecret, {
      receipt_email: user.email,
      payment_method: {
        card: elements.getElement(CardElement),
      },
    })

    if (stripeProvider.error) {
      setError(`${stripeProvider.error.message}`)
    } else {
      handlePaymentSuccess(stripeProvider.paymentIntent.id, PaymentMethodType.CARD)
    }

    toggleProcessing(false)
  }

  useOnEnter(formRef, handleSubmit)

  const renderForm = () => {
    return (
      <div>
        {/* Payment wallet commented */}
        {/* {paymentRequest ? (
          <div className="px-2 mb-4 mt-1 lg:w-1/2 mx-auto">
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    type: 'check-out',
                    theme: 'dark',
                  },
                },
              }}
            />
          </div>
        ) : null} */}

        <div className="content mt-3 lg:mt-5 px-2">
          <div className="user-input-group">
            <CardElement options={cardStyle} className="user-input" onChange={handleChange} />
          </div>
          <div className="mb-2 text-sm">{error}</div>
        </div>
      </div>
    )
  }

  const renderSuccessMessage = () => {
    return (
      <div className="flex items-center flex-col justify-center pb-3">
        <CoreImage
          url={prepareImageUrl('/images/ribbon.png', ImageSourceType.ASSET)}
          className="w-28 mb-1"
          alt="Payment succeeded"
        />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col" ref={formRef}>
      <div className="relative mb-10">{!success ? renderForm() : renderSuccessMessage()}</div>

      <div
        className={classnames('absolute -bottom-1 left-0 right-0 box-border w-full', {
          'mb-2': success,
        })}>
        <CoreButton
          label={
            success ? (
              'Paid successfully!'
            ) : (
              <div>
                <span>Pay</span> <EscapeHTML html={cartCurrency?.symbol} element="span" />
                {cartTotal}
              </div>
            )
          }
          size={CoreButtonSize.LARGE}
          type={success ? CoreButtonType.OUTLINE_SECONDARY : CoreButtonType.SOLID_PRIMARY}
          onClick={handleSubmit}
          loading={processing}
          disabled={processing || success}
          className="w-full rounded-none lg:rounded-b-md py-3 border-primary"
        />
      </div>
      <div className="mb-2" />
    </div>
  )
}

const CheckoutForm: React.FC<ICheckoutFormProps> = props => {
  return (
    <Elements stripe={promise}>
      <CheckoutFormElements {...props} />
    </Elements>
  )
}

export default CheckoutForm
