import { ProductType } from '../contract/constants'
import { IComboProductInfo, IIndividualProductInfo, IProductInfo } from '../contract/product'

export const prepareAnalyticsProductItem = (productInfo: IProductInfo, quantity: number) => {
  const product = productInfo as IIndividualProductInfo | IComboProductInfo
  const individualProduct = productInfo as IIndividualProductInfo

  return {
    id: `${product.type}-${product.id}`,
    name: product.name,
    category: (product as any).catalogue ? individualProduct.catalogue.name : '',
    price: product.sku.salePrice,
    quantity: quantity,
  }
}

interface IPrepareProductAnalyticsParams {
  items: { product: IProductInfo; quantity: number }[]
  value: number
}

export const prepareProductAnalyticsParams = (options: IPrepareProductAnalyticsParams) => {
  const firstItem = options.items[0]
  const productInfo = firstItem.product as IIndividualProductInfo | IComboProductInfo
  const currency = productInfo.sku.currency

  const result: any = {
    currency: currency.isoCode.toUpperCase(),
    items: options.items.map(item => prepareAnalyticsProductItem(item.product, item.quantity)),
    value: options.value,
  }

  return result
}
