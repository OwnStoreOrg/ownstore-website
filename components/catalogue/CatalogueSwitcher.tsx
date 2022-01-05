import React, { useState, useEffect } from 'react'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import { APP_LOGO, IMAGE_VARIANTS, MAX_PRODUCTS_IN_CATALOGUE_SWITCHER } from '../../constants/constants'
import classnames from 'classnames'
import ProductInfo, { ProductInfoLayoutType } from '../product/ProductInfo'
import { ProductType } from '../../contract/constants'
import ViewMoreCard from '../ViewMoreCard'
import { ICatalogueInfo } from '../../contract/catalogue'
import { getIndividualProductInfosByCatalogueId } from '../../http/product'
import CoreLink from '../core/CoreLink'
import { getCataloguePageUrl } from '../../utils/catalogue'
import { IIndividualProductInfo } from '../../contract/product'
import { handleThumbnailImageError } from '../../utils/image'
import { prepareImageUrl } from '../../utils/image'

interface ICatelogueSwitcherProps {
  catalogues: ICatalogueInfo[]
}

const CatelogueSwitcher: React.FC<ICatelogueSwitcherProps> = props => {
  const { catalogues } = props

  const validCatalogues = catalogues.filter(catalogue => catalogue.isActive).slice(0, 5)

  const [selectedCatelogue, setSelectedCatelogue] = useState<ICatalogueInfo>(validCatalogues[0])
  const [products, setProducts] = useState<IIndividualProductInfo[]>([])

  useEffect(() => {
    getIndividualProductInfosByCatalogueId(selectedCatelogue.id, {})
      .then(products => {
        setProducts(products)
      })
      .catch(console.log)
  }, [selectedCatelogue.id])

  const handleCatelogueClick = (catelogue: ICatalogueInfo) => {
    setSelectedCatelogue(catelogue)
  }

  const renderCatelogues = () =>
    validCatalogues.map(catelogue => (
      <div
        key={catelogue.id}
        className={classnames('flex items-center py-2 px-2 cursor-pointer bg-white hover:bg-whisper transition-all', {
          'bg-whisper': selectedCatelogue.id === catelogue.id,
        })}
        onClick={() => handleCatelogueClick(catelogue)}>
        <CoreImage
          url={
            catelogue.images[0]?.url
              ? prepareImageUrl(catelogue.images[0].url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_300)
              : APP_LOGO.DEFAULT
          }
          alt={`${catelogue.name}`}
          onError={handleThumbnailImageError}
          className="rounded-full w-12"
        />
        <div className="ml-2 text-primaryTextBold text-base font-medium font-primary-medium">{catelogue.name}</div>
      </div>
    ))

  let finalProducts = products
  let showMoreProducts = false

  if (products.length > MAX_PRODUCTS_IN_CATALOGUE_SWITCHER) {
    finalProducts = products.slice(0, MAX_PRODUCTS_IN_CATALOGUE_SWITCHER - 1)
    showMoreProducts = true
  }

  const renderCatelogueProducts = () => {
    return finalProducts.map((product, index) => (
      <div key={index} className="">
        <ProductInfo layout={ProductInfoLayoutType.BLOCK} product={product} />
      </div>
    ))
  }

  return (
    <div className="flex">
      <div className="w-[25%]">{renderCatelogues()}</div>
      <div className="w-[75%] ml-4 grid grid-cols-4 gap-5">
        {renderCatelogueProducts()}

        {showMoreProducts ? (
          <CoreLink url={getCataloguePageUrl(selectedCatelogue)}>
            <div className="h-[77%]">
              <ViewMoreCard />
            </div>
            <div className="h-[23%]" />
          </CoreLink>
        ) : null}
      </div>
    </div>
  )
}

export default CatelogueSwitcher
