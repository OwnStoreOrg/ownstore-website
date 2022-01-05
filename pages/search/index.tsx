import React, { useState, useRef } from 'react'
import { NextPage, GetServerSideProps, GetStaticProps } from 'next'
import { IGlobalLayoutProps } from '../_app'
import { ISectionInfo } from '../../contract/section'
import PageContainer from '../../components/PageContainer'
import { ArrowLeftIcon, ClipboardCopyIcon } from '@heroicons/react/outline'
import CoreTextInput, { CoreTextInputType } from '../../components/core/CoreInput'
import { useRouter } from 'next/router'
import BlockSection from '../../components/section/BlockSection'
import { ISearchInfo } from '../../contract/search'
import { getSearchInfo } from '../../http/search'
import ProductInfo, { ProductInfoLayoutType } from '../../components/product/ProductInfo'
import CatalogueInfo, { CatalogueInfoLayoutType } from '../../components/catalogue/CatalogueInfo'
import NoContent from '../../components/NoContent'
import { getHomePageUrl } from '../../utils/home'
import { copyToClipboard, filterInactiveItem, routerPageBack } from '../../utils/common'
import useUpdateEffect from '../../hooks/useUpdateEffect'
import appConfig from '../../config/appConfig'
import { prepareSearchPageSeo } from '../../utils/seo/pages/search'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { ClipboardIcon as ClipboardIconOutline } from '@heroicons/react/outline'
import { ClipboardIcon as ClipboardIconSolid } from '@heroicons/react/solid'
import { getSearchResultPageUrl } from '../../utils/search'
import { toastSuccess } from '../../components/Toaster'
import { PAGE_REVALIDATE_TIME } from '../../constants/constants'
import { getPageSections } from '../../http/section'
import { PageSectionType } from '../../contract/constants'

const defaultSearchInfo: ISearchInfo = {
  catalogues: [],
  individualProducts: [],
  comboProducts: [],
}

interface IProps extends IGlobalLayoutProps {
  pageData: {
    sections: ISectionInfo[]
  }
}

const SearchPage: NextPage<IProps> = props => {
  const {
    pageData: { sections },
  } = props

  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchInfo, setSearchInfo] = useState<ISearchInfo>(defaultSearchInfo)
  const [urlCopied, toggleUrlCopied] = useState(false)

  const timer = useRef(null)

  const searchByTerm = () => {
    getSearchInfo(searchTerm, { limit: appConfig.search.sectionFetchLimit })
      .then(resp => {
        setSearchInfo(resp)
        appAnalytics.sendEvent({
          action: AnalyticsEventType.SEARCH,
          extra: {
            search_term: searchTerm,
          },
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  useUpdateEffect(() => {
    if (timer) {
      clearTimeout(timer.current)
    }

    if (searchTerm) {
      timer.current = setTimeout(() => {
        searchByTerm()
      }, 500)
    } else {
      clearSearch()
    }

    toggleUrlCopied(false)
  }, [searchTerm])

  const hasData = [searchInfo.catalogues, searchInfo.individualProducts, searchInfo.comboProducts].some(
    info => info.length > 0
  )

  const clearSearch = () => {
    setSearchTerm('')
    setSearchInfo(defaultSearchInfo)
  }

  const onBackIconClick = () => {
    routerPageBack(router)
  }

  const onCopyClick = () => {
    copyToClipboard(`${appConfig.global.baseUrl}${getSearchResultPageUrl(searchTerm)}`)
    toastSuccess('Search result page copied!')
    toggleUrlCopied(true)
  }

  const renderNoContent = () => {
    return (
      <div>
        {sections.map((section, index) => (
          <BlockSection
            key={index}
            section={section}
            renderTitle={section => (
              <div className="text-primaryTextBold font-bold font-primary-bold mt-7 mb-3 uppercase">
                {section.title}
              </div>
            )}
          />
        ))}
      </div>
    )
  }

  const renderSearchIndividualProducts = () => {
    return (
      <div>
        <div className="font-medium font-primary-medium text-primaryTextBold mt-3 lg:mt-4 lg:mb-1 ml-1">Products</div>
        <div>
          {searchInfo.individualProducts
            .filter(product => product.isActive)
            .map(individualProduct => (
              <ProductInfo
                key={individualProduct.id}
                layout={ProductInfoLayoutType.INLINE}
                product={individualProduct}
              />
            ))}
        </div>
      </div>
    )
  }

  const renderSearchComboProducts = () => {
    return (
      <div>
        <div className="font-medium font-primary-medium text-primaryTextBold mt-3 lg:mt-4 lg:mb-1 ml-1">Combos</div>
        <div>
          {searchInfo.comboProducts
            .filter(comboProduct => comboProduct.isActive)
            .map(comboProduct => (
              <ProductInfo key={comboProduct.id} layout={ProductInfoLayoutType.INLINE} product={comboProduct} />
            ))}
        </div>
      </div>
    )
  }

  const renderSearchCatalogues = () => {
    return (
      <div>
        <div className="font-medium font-primary-medium text-primaryTextBold mt-3 lg:mt-4 lg:mb-1 ml-1">Catalogues</div>
        <div>
          {searchInfo.catalogues
            .filter(catalogue => catalogue.isActive)
            .map(catalogue => (
              <CatalogueInfo key={catalogue.id} layout={CatalogueInfoLayoutType.INLINE} catalogue={catalogue} />
            ))}
        </div>
      </div>
    )
  }

  const renderResult = () => {
    if (!hasData) {
      return (
        <div>
          <NoContent message="No result found!" />
          {renderNoContent()}
        </div>
      )
    }

    return (
      <div>
        {filterInactiveItem(searchInfo.individualProducts).length ? renderSearchIndividualProducts() : null}
        {filterInactiveItem(searchInfo.comboProducts).length ? renderSearchComboProducts() : null}
        {filterInactiveItem(searchInfo.catalogues).length ? renderSearchCatalogues() : null}
      </div>
    )
  }

  return (
    <div>
      <PageContainer>
        <div className="">
          <div className="sticky lg:relative top-0 lg:top-18 bg-white lg:bg-none z-10 lg:z-0 px-2 py-4 shadow-sm lg:shadow-none">
            <div className="flex items-center">
              <div title="Go Back">
                <ArrowLeftIcon
                  className="w-6 lg:w-7 mr-3 ml-1 text-mineShaft cursor-pointer transform transition-transform hover:scale-110"
                  onClick={onBackIconClick}
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <CoreTextInput
                    type={CoreTextInputType.TEXT}
                    value={searchTerm}
                    setValue={setSearchTerm}
                    placeholder={appConfig.search.placeholder.page}
                    autoFocus
                    showClearIcon
                    onClearClick={() => setSearchTerm('')}
                    inputClassName="searchInputPlaceholder border-none lg:text-lg"
                    className="flex-grow"
                  />
                  {searchTerm ? (
                    <>
                      {urlCopied ? (
                        <ClipboardIconSolid className="w-6 cursor-pointer transition hover:scale-105 text-mineShaft" />
                      ) : (
                        <ClipboardIconOutline
                          className="w-6 cursor-pointer transition hover:scale-105 text-mineShaft"
                          onClick={onCopyClick}
                        />
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="px-2 mt-3 ">{searchTerm ? renderResult() : renderNoContent()}</div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const searchSections = await getPageSections(PageSectionType.SEARCH)

  return {
    props: {
      pageData: {
        sections: searchSections,
      },
      seo: prepareSearchPageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
    revalidate: PAGE_REVALIDATE_TIME.SEARCH,
  }
}

export default SearchPage
