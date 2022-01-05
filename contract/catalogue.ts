import { IImageInfo } from './image'

export interface ICatalogueMeta {
  id: number
  name: string
  slug: string
  position: number
  isActive: boolean
}

export interface ICatalogueInfo extends ICatalogueMeta {
  images: IImageInfo[]
}

export interface ICatalogueDetail extends ICatalogueInfo {}

export interface ICatalogueInfoUpdateParams {
  name: string
  imageIds: string // separated by comma
  position: number
  isActive: boolean
}

export interface ICatalogueInfoUpdate {
  success: boolean
}

export interface ICatalogueInfoDelete {
  success: boolean
}
