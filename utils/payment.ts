import { ICartDetail, ICartExtraChargesInfo, ICartItem, IPriceAndDeliveryChargeMapping } from '../contract/cart'
import { ICurrencyInfo } from '../contract/currency'
import { IComboProductInfo, IIndividualProductInfo } from '../contract/product'
import { calculatePercentage } from './common'
import { shouldDisableProduct } from './product'

export const getCartRetailTotal = (cart: ICartDetail): number => {
  const retailTotal = cart.cartItems.reduce((acc, cur) => {
    const productInfo = cur.product as IIndividualProductInfo | IComboProductInfo
    const productAmount = shouldDisableProduct(productInfo) ? 0 : productInfo.sku.retailPrice * cur.quantity
    return acc + productAmount
  }, 0)
  return retailTotal
}

export const getCartSaleTotal = (cart: ICartDetail): number => {
  const saleTotal = cart.cartItems.reduce((acc, cur) => {
    const productInfo = cur.product as IIndividualProductInfo | IComboProductInfo

    let productAmount = 0

    if (!shouldDisableProduct(productInfo)) {
      productAmount = productInfo.sku.onSale
        ? productInfo.sku.salePrice * cur.quantity
        : productInfo.sku.retailPrice * cur.quantity
    }

    return acc + productAmount
  }, 0)

  return saleTotal
}

export const getCartDiscountTotal = (cart: ICartDetail): number => {
  const retailTotal = getCartRetailTotal(cart)
  const saleTotal = getCartSaleTotal(cart)
  return retailTotal - saleTotal
}

export const getCartDeliveryTotal = (cart: ICartDetail) => {
  const saleTotal = getCartSaleTotal(cart)

  let deliveryTotal = Object.values(cart.priceAndDeliveryChargeMapping)[0]

  Object.keys(cart.priceAndDeliveryChargeMapping).forEach(price => {
    const discount = cart.priceAndDeliveryChargeMapping[price]
    if (saleTotal >= Number(price)) {
      deliveryTotal = discount
    }
  })

  return deliveryTotal
}

export const getCartExtraChargesTotal = (cart: ICartDetail): number | null => {
  const { extraCharges } = cart

  let total: number | null

  if (extraCharges.percent !== null) {
    const saleTotal = getCartSaleTotal(cart)
    return calculatePercentage(extraCharges.percent, saleTotal, cart.extraCharges.decimalPrecision)
  } else {
    total = extraCharges.flat
  }

  return total
}

export const getCartTaxTotal = (cart: ICartDetail): number | null => {
  const { tax } = cart

  let total: number | null

  if (tax.percent !== null) {
    const saleTotal = getCartSaleTotal(cart)
    return calculatePercentage(tax.percent, saleTotal, cart.tax.decimalPrecision)
  } else {
    total = tax.flat
  }

  return total
}

export const getCartTotal = (cart: ICartDetail): number => {
  const saleTotal = getCartSaleTotal(cart)
  const deliveryTotal = getCartDeliveryTotal(cart)
  const extraChargesTotal = getCartExtraChargesTotal(cart) || 0
  const taxTotal = getCartTaxTotal(cart) || 0

  return saleTotal + deliveryTotal + extraChargesTotal + taxTotal
}

export const getCartCurrency = (cart: ICartDetail): ICurrencyInfo | null => {
  const firstCart = cart.cartItems[0]

  if (firstCart) {
    const firstCartProduct = firstCart.product
    const productInfo = firstCartProduct as IIndividualProductInfo | IComboProductInfo
    return productInfo.sku.currency
  }

  return null
}
