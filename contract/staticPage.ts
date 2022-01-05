export interface IStaticPageDetail {
  title: string
  body: string
  updatedDateTime: Date | null
}

export interface IStaticPageUpdateParams {
  title: string
  body: string
}

export interface IStaticPageUpdate {
  success: boolean
}
