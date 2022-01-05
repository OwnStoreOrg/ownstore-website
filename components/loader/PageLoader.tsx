import React from 'react'
import Loader, { LoaderType } from './Loader'

interface IPageLoaderProps {
  message?: string
}

const PageLoader: React.FC<IPageLoaderProps> = props => {
  const { message = 'Fetching latest data for you...' } = props

  return (
    <div className="mt-20">
      <Loader type={LoaderType.ELLIPSIS} />
      <div className="text-center">{message}</div>
    </div>
  )
}

export default PageLoader
