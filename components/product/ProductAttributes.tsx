import React from 'react'
import { IProductAttributeInfo } from '../../contract/product'
import { filterInactiveItem } from '../../utils/common'

interface IProductAttributesProps {
  productAttributes: IProductAttributeInfo[]
}

const ProductAttributes: React.FC<IProductAttributesProps> = props => {
  const { productAttributes } = props

  const activeAttributes = filterInactiveItem<IProductAttributeInfo>(productAttributes)

  if (!activeAttributes.length) {
    return null
  }

  return (
    <div className="p-4">
      <ul className="ml-5">
        {activeAttributes.map((activeAttribute, index) => (
          <li key={index}>
            <span>
              {activeAttribute.key ? <span className="">{activeAttribute.key.name}:</span> : null}
              <span>&nbsp;{activeAttribute.value}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductAttributes
