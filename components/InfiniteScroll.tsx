import React from 'react'
import ReactInfiniteScroll from 'react-infinite-scroller'
import Loader, { LoaderType } from './loader/Loader'

interface IInfiniteScrollProps {
  loadMore: (page: number) => void
  hasMore: boolean
}

const InfiniteScroll: React.FC<IInfiniteScrollProps> = props => {
  const { loadMore, hasMore, children } = props

  return (
    <ReactInfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      loader={<Loader key={0} type={LoaderType.RING} />}
      hasMore={hasMore}>
      {children}
    </ReactInfiniteScroll>
  )
}

export default InfiniteScroll
