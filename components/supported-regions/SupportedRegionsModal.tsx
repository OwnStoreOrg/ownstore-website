import React, { useContext, useEffect, useRef, useState } from 'react'
import Modal from '../modal/Modal'
import classnames from 'classnames'
import ApplicationContext from '../ApplicationContext'
import { capitalize } from '../../utils/common'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import { ISupportedRegionsInfo } from '../../contract/supportedRegions'
import NoContent, { NoContentType } from '../NoContent'
import { hasNoSupportedRegions } from '../../utils/supportedRegions'
import Loader, { LoaderType } from '../loader/Loader'
import { prepareImageUrl } from '../../utils/image'
import { IMAGE_VARIANTS, SOCIAL_ICONS_SRC_MAP } from '../../constants/constants'
import FullWidthModal from '../modal/FullWidthModal'

const getRegionList = (supportedRegions: ISupportedRegionsInfo, selectedTabKey: SelectedTabKey) => {
  let dataList = []

  if (selectedTabKey === 'countries') {
    dataList = supportedRegions.countries.map(country => ({
      name: country.name,
      imageUrl: country.flagUrl,
    }))
  }
  if (selectedTabKey === 'cities') {
    dataList = supportedRegions.cities.map(city => ({
      name: city.name,
      imageUrl: city.flagUrl,
    }))
  }

  return dataList
}

interface ISupportedRegionsModalProps {
  dismissModal: () => void
}

type SelectedTabKey = 'countries' | 'cities'

const SupportedRegionsModal: React.FC<ISupportedRegionsModalProps> = props => {
  const { dismissModal } = props

  const applicationContext = useContext(ApplicationContext)
  const { supportedRegions } = applicationContext

  const [selectedTabKey, setSelectedTabKey] = useState<SelectedTabKey>('countries')

  const renderLoader = () => {
    return (
      <div className="p-4">
        <Loader type={LoaderType.ELLIPSIS} />
      </div>
    )
  }

  const renderContent = () => {
    const tabs = [
      {
        label: 'Countries',
        key: 'countries',
        show: supportedRegions.countries.length > 0,
      },
      {
        label: 'Cities',
        key: 'cities',
        show: supportedRegions.cities.length > 0,
      },
    ]

    const regionList = getRegionList(supportedRegions, selectedTabKey)

    return (
      <div>
        <div className="flex font-medium font-primary-medium ">
          {tabs
            .filter(tab => tab.show)
            .map(tab => {
              const activeTab = selectedTabKey === tab.key

              return (
                <div
                  key={tab.key}
                  onClick={() => {
                    setSelectedTabKey(tab.key as SelectedTabKey)
                  }}
                  className={classnames('w-1/2 text-center px-2 py-3 cursor-pointer border-b-2 ', {
                    'border-primary text-primaryTextBold': activeTab,
                    'border-white': !activeTab,
                  })}>
                  <span>{tab.label}</span>
                </div>
              )
            })}
        </div>

        <div>
          <div className={classnames('grid pt-2 pb-3 grid-cols-2')}>
            {!regionList.length ? (
              <div>
                <NoContent type={NoContentType.DEFAULT} />
              </div>
            ) : (
              regionList.map((data, index) => {
                return (
                  <div key={index} className="py-3 px-3 flex items-center hover:bg-gray100 transition-colors">
                    <CoreImage
                      url={
                        false
                          ? prepareImageUrl(data.imageUrl, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_150)
                          : SOCIAL_ICONS_SRC_MAP.GLOBE
                      }
                      alt={data.name}
                      className="w-6 h-6 mr-2"
                    />
                    <span className="font-medium font-primary-medium">{capitalize(data.name)}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: dismissModal,
        title: 'Supported Regions',
      }}>
      {supportedRegions ? renderContent() : renderLoader()}
    </FullWidthModal>
  )
}

export default SupportedRegionsModal
