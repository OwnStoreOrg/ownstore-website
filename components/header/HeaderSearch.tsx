import React from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import CoreLink from '../core/CoreLink'
import { getSearchPageUrl } from '../../utils/search'
import appConfig from '../../config/appConfig'

interface IHeaderSearchProps {}

const HeaderSearch: React.FC<IHeaderSearchProps> = props => {
  return (
    <CoreLink url={getSearchPageUrl()}>
      <div className="flex justify-between items-center bg-whisper hover:bg-gray200 group transition-all h-10 lg:h-11 px-2 pl-4 text-sm text-primaryText rounded-lg cursor-pointer">
        <span>{appConfig.search.placeholder.header}</span>
        <SearchIcon className="w-5 transition-all group-hover:transform group-hover:scale-105" />
      </div>
    </CoreLink>
  )
}

export default HeaderSearch
