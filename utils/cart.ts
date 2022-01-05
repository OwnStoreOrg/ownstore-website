import { ICartItem } from '../contract/cart'
import { ProductType } from '../contract/constants'
import { IComboProductInfo, IIndividualProductInfo, IProductInfo } from '../contract/product'

export const getCartPageUrl = () => {
  return '/cart'
}

export const getCartItemFromProduct = (cartItems: ICartItem[], productInfo: IProductInfo): ICartItem | undefined => {
  if (cartItems.length === 0) {
    return undefined
  }

  return cartItems.find(cartItem => {
    if (productInfo.type === ProductType.INDIVIDUAL && cartItem.product.type === ProductType.INDIVIDUAL) {
      const individualCartProduct = cartItem.product as IIndividualProductInfo
      const individualProduct = productInfo as IIndividualProductInfo
      return individualCartProduct.id === individualProduct.id
    }

    if (productInfo.type === ProductType.COMBO && cartItem.product.type === ProductType.COMBO) {
      const comboWishProduct = cartItem.product as IComboProductInfo
      const comboProduct = productInfo as IComboProductInfo
      return comboWishProduct.id === comboProduct.id
    }
  })
}

export const incrementCartQuantityWithProduct = (cartItems: ICartItem[], productInfo: IProductInfo): ICartItem[] => {
  return cartItems.map(cartItem => {
    if (cartItem.product.type === ProductType.INDIVIDUAL && productInfo.type === ProductType.INDIVIDUAL) {
      const individualCartProduct = cartItem.product as IIndividualProductInfo
      const individualProduct = productInfo as IIndividualProductInfo
      if (individualCartProduct.id === individualProduct.id) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
        }
      }
    } else if (cartItem.product.type === ProductType.COMBO && productInfo.type === ProductType.COMBO) {
      const comboCartProduct = cartItem.product as IComboProductInfo
      const comboProduct = productInfo as IComboProductInfo
      if (comboCartProduct.id === comboProduct.id) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
        }
      }
    }

    return cartItem
  })
}

export const addToCart = (cartItems: ICartItem[], cartItem: ICartItem): ICartItem[] => {
  return [cartItem, ...cartItems]
}

export const removeFromCart = (cartItems: ICartItem[], cartItem: ICartItem): ICartItem[] => {
  return cartItems.filter(cItem => cItem.id !== cartItem.id)
}

export const getProductsQuantityCount = (cartItems: ICartItem[]): number => {
  return cartItems.reduce((acc, cur) => {
    return acc + cur.quantity
  }, 0)
}

export const incrementCartQuantity = (cartItems: ICartItem[], cartItem: ICartItem): ICartItem[] => {
  return cartItems.map(cProduct => {
    if (cProduct.id === cartItem.id) {
      return cartItem
    }
    return cProduct
  })
}
