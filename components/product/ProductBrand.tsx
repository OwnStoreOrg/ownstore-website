import { ExclamationCircleIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { IProductBrandInfo } from '../../contract/product'
import Modal from '../modal/Modal'

interface IProductBrandProps {
  brand: IProductBrandInfo
}

const ProductBrand: React.FC<IProductBrandProps> = props => {
  const { brand } = props
  const [showDescription, toggleDescription] = useState(false)

  if (!brand) {
    return null
  }

  return (
    <div>
      <div className="text-primaryText px-4 py-4 text-base">
        <span className="font-medium font-primary-medium">Brand:</span>{' '}
        <span className="">
          <span className="inline">{brand.name}</span>
          {brand.description ? (
            <ExclamationCircleIcon
              className="w-5 cursor-pointer ml-[2px] inline relative top-[-2px] transition-all hover:scale-105"
              onClick={() => toggleDescription(true)}
            />
          ) : null}
        </span>
      </div>

      {showDescription ? (
        <Modal dismissModal={() => toggleDescription(false)} title="About this brand">
          <div className="px-3 pb-2">{brand.description}</div>
        </Modal>
      ) : null}
    </div>
  )
}

export default ProductBrand
