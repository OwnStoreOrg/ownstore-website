import { IImageInfo } from './image'

export interface IBlogInfo {
  id: number
  slug: string
  title: string
  description: string
  url: string
  image: IImageInfo | null
  position: number
  isActive: boolean
  createdDateTime: Date
}

export interface IBlogInfoUpdateParams {
  title: string
  description: string
  url: string
  imageId: number | null
  position: number
  isActive: boolean
}

export interface IBlogInfoUpdate {
  success: boolean
}

export interface IBlogInfoDelete {
  success: boolean
}
