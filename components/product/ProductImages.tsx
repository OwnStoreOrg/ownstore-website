import React, { useContext } from 'react'
import { APP_LOGO, IMAGE_VARIANTS } from '../../constants/constants'
import { IImageInfo } from '../../contract/image'
import { IComboProductDetail, IIndividualProductDetail } from '../../contract/product'
import { filterInactiveItem } from '../../utils/common'
import { prepareImageUrl } from '../../utils/image'
import { handleThumbnailImageError } from '../../utils/image'
import { prepareImageObjectStructuredData } from '../../utils/seo/structuredData'
import ApplicationContext from '../ApplicationContext'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import DeviceSlider from '../DeviceSlider'
import NoContent from '../NoContent'
import { DesktopView, MobileView } from '../ResponsiveViews'
import classnames from 'classnames'

interface IProductImages {
  images: IImageInfo[]
  productDetail: IIndividualProductDetail | IComboProductDetail
}

const ProductImages: React.FC<IProductImages> = props => {
  const { images, productDetail } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isLg, isMobile },
  } = applicationContext

  if (!images.length) {
    return <NoContent message="No photos available for this product!" />
  }

  const mapImages = images.map((image, index) => (
    <React.Fragment key={index}>
      <CoreImage
        url={prepareImageUrl(image.url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_500)}
        alt={`image-${index}`}
        onError={handleThumbnailImageError}
        className="w-full min-h-80 lg:min-h-96 lg:object-cover"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            prepareImageObjectStructuredData(
              prepareImageUrl(image.url, ImageSourceType.CLOUD, IMAGE_VARIANTS.SQUARE_500),
              `${productDetail.name} - ${index}`
            )
          ),
        }}></script>
    </React.Fragment>
  ))

  return (
    <div>
      <DesktopView>
        <div className="overflow-hidden flex overflow-x-scroll overflow-y-hidden hide-scrollbar lg:grid grid-cols-2 gap-3 w-full">
          {images.length ? (
            images.length === 1 ? (
              <>
                {mapImages}
                <CoreImage url={APP_LOGO.DEFAULT} alt={productDetail.name} className="min-h-96 object-cover" />
              </>
            ) : (
              mapImages
            )
          ) : (
            <>
              <CoreImage url={APP_LOGO.DEFAULT} alt={productDetail.name} className="min-h-96 object-cover" />
              <CoreImage url={APP_LOGO.DEFAULT} alt={productDetail.name} className="min-h-96 object-cover" />
            </>
          )}
        </div>
      </DesktopView>

      <MobileView>
        <div
          className={classnames('productSlider', {
            'mb-7': images.length > 1,
          })}>
          <DeviceSlider
            forceShowSlider
            sliderConfig={{
              arrows: false,
              slidesToScroll: 1,
              slidesToShow: isLg ? 2 : 1,
              variableWidth: false,
              dots: images.length > 1,
            }}>
            {images.length ? (
              mapImages
            ) : (
              <CoreImage url={APP_LOGO.DEFAULT} alt={productDetail.name} className="min-h-80" />
            )}
          </DeviceSlider>
        </div>
      </MobileView>
    </div>
  )
}

export default ProductImages
