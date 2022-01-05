import { ChevronRightIcon } from '@heroicons/react/outline'
import React, { useContext } from 'react'
import { IProductInfo } from '../../contract/product'
import { getCartPageUrl, getCartItemFromProduct } from '../../utils/cart'
import ApplicationContext from '../ApplicationContext'
import CoreLink from '../core/CoreLink'

interface IProductInCartMessageProps {
  productInfo: IProductInfo
}

const ProductInCartMessage: React.FC<IProductInCartMessageProps> = props => {
  const { productInfo } = props

  const applicationContext = useContext(ApplicationContext)
  const { cart } = applicationContext

  const productInCart = getCartItemFromProduct(cart?.cartItems || [], productInfo)

  if (!productInCart) {
    return null
  }

  return (
    <div className="flex items-center px-4 py-1 w-full">
      <span>This product is in your cart.</span>
      &nbsp;
      <CoreLink
        url={getCartPageUrl()}
        className="text-primaryTextBold font-medium font-primary-medium flex items-center">
        View
        <ChevronRightIcon className="w-[18px] relative top-[1px] left-[-2px]" />
      </CoreLink>
    </div>
  )
}

export default ProductInCartMessage
