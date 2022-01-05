import { ProductType } from '../contract/constants'
import { IProductInfo, IIndividualProductInfo, IComboProductInfo } from '../contract/product'
import { IUserWishInfo } from '../contract/userWish'

export const getWishlistPageUrl = () => {
  return '/wishlist'
}

export const isProductWishlisted = (wishlist: IUserWishInfo[], productInfo: IProductInfo): boolean => {
  if (wishlist.length === 0) {
    return false
  }

  return wishlist.some(wish => {
    if (productInfo.type === ProductType.INDIVIDUAL && wish.product.type === ProductType.INDIVIDUAL) {
      const individualWishProduct = wish.product as IIndividualProductInfo
      const individualProduct = productInfo as IIndividualProductInfo
      return individualWishProduct.id === individualProduct.id
    }

    if (productInfo.type === ProductType.COMBO && wish.product.type === ProductType.COMBO) {
      const comboWishProduct = wish.product as IComboProductInfo
      const comboProduct = productInfo as IComboProductInfo
      return comboWishProduct.id === comboProduct.id
    }
  })
}

export const addUserWish = (wishlist: IUserWishInfo[], userWish: IUserWishInfo): IUserWishInfo[] => {
  return [userWish, ...wishlist]
}

export const removeUserWish = (wishlist: IUserWishInfo[], userWish: IUserWishInfo): IUserWishInfo[] => {
  return wishlist.filter(wish => wish.id !== userWish.id)
}
