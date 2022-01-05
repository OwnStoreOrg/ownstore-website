export interface IImageInfo {
  id: number
  url: string
  name: string
  createdAt: Date
}

export interface IImageInfoUpdateParams {
  name: string
  url: string
  meta: {
    thirdPartyId: string | null
    originalName: string | null
    sizeInBytes: string | null
    width: number | null
    height: number | null
  } | null
}

export interface IImageInfoUpdate {
  success: boolean
  id: number | null
}
