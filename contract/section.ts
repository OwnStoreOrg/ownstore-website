import { ProductType, SectionType } from './constants'
import { IBlogInfo } from './blog'
import { ICatalogueInfo } from './catalogue'
import { IImageInfo } from './image'
import { IProductInfo } from './product'

export interface IProductSectionInfo {
  id: number
  position: number
  isActive: boolean
  productInfo: IProductInfo
}

export interface IProductSectionInfoUpdateParams {
  position: number
  isActive: boolean
  productType: ProductType
  productId: number
}

export interface IProductSectionInfoUpdate {
  success: boolean
}

export interface IProductSectionInfoDelete {
  success: boolean
}

export interface ICatalogueSectionInfo {
  id: number
  position: number
  isActive: boolean
  catalogueInfo: ICatalogueInfo
}

export interface ICatalogueSectionInfoUpdateParams {
  position: number
  isActive: boolean
  catalogueId: number
}

export interface ICatalogueSectionInfoUpdate {
  success: boolean
}

export interface ICatalogueSectionInfoDelete {
  success: boolean
}

export interface IBlogSectionInfo {
  id: number
  position: number
  isActive: boolean
  blogInfo: IBlogInfo
}

export interface IBlogSectionInfoUpdateParams {
  position: number
  isActive: boolean
  blogId: number
}

export interface IBlogSectionInfoUpdate {
  success: boolean
}

export interface IBlogSectionInfoDelete {
  success: boolean
}

export interface ICustomerFeedbackInfo {
  id: number
  name: string
  email: string | null
  designation: string | null
  feedback: string
  image: IImageInfo
  position: number
  isActive: boolean
}

export interface ICustomerFeedbackInfoUpdateParams {
  name: string
  email: string | null
  designation: string | null
  feedback: string
  imageId: number
  position: number
  isActive: boolean
}

export interface ICustomerFeedbackInfoUpdate {
  success: boolean
}

export interface ICustomerFeedbackInfoDelete {
  success: boolean
}

export interface IProcedureInfo {
  id: number
  title: string
  subTitle: string
  image: IImageInfo | null
  position: number
  isActive: boolean
}

export interface IProcedureInfoUpdateParams {
  title: string
  subTitle: string
  imageId: number | null
  position: number
  isActive: boolean
}

export interface IProcedureInfoUpdate {
  success: boolean
}

export interface IProcedureInfoDelete {
  success: boolean
}

export interface ISlideInfo {
  id: number
  url: string | null
  image: IImageInfo
  mobileImage: IImageInfo | null
  position: number
  isActive: boolean
}

export interface ISlideInfoUpdateParams {
  url: string | null
  imageId: number
  mobileImageId: number | null
  position: number
  isActive: boolean
}

export interface ISlideInfoUpdate {
  success: boolean
}

export interface ISlideInfoDelete {
  success: boolean
}

export interface IUSPInfo {
  id: number
  name: string
  url: string | null
  image: IImageInfo
  position: number
  isActive: boolean
}

export interface IUSPInfoUpdateParams {
  name: string
  url: string | null
  imageId: number
  position: number
  isActive: boolean
}

export interface IUSPInfoUpdate {
  success: boolean
}

export interface IUSPInfoDelete {
  success: boolean
}

export interface ICustomSectionBody {
  id: number
  html: string
  position: number
  isActive: boolean
}

export interface ICustomSectionBodyUpdateParams {
  html: string
  position: number
  isActive: boolean
}

export interface ICustomSectionBodyUpdate {
  success: boolean
}

export interface ICustomSectionBodyDelete {
  success: boolean
}

export type SectionInfoItem =
  | IProductSectionInfo
  | ICatalogueSectionInfo
  | IBlogSectionInfo
  | ISlideInfo
  | IUSPInfo
  | ICustomerFeedbackInfo
  | IProcedureInfo
  | ICustomSectionBody

export interface IPageSectionMeta {
  id: number
}

export interface ISectionInfo {
  id: number
  slug: string
  name: string
  title: string | null
  subTitle: string | null
  showMoreUrl: string | null
  position: number | null
  showDivider: boolean | null
  type: SectionType
  pageSection: IPageSectionMeta | null
}

export interface ISectionInfoProducts extends ISectionInfo {
  type: SectionType.PRODUCTS
  products: IProductSectionInfo[]
}

export interface ISectionInfoCatalogues extends ISectionInfo {
  type: SectionType.CATALOGUES
  catalogues: ICatalogueSectionInfo[]
}

export interface ISectionInfoBlogs extends ISectionInfo {
  type: SectionType.BLOGS
  blogs: IBlogSectionInfo[]
}

export interface ISectionInfoFullWidthSlides extends ISectionInfo {
  type: SectionType.FULL_WIDTH_SLIDES
  slides: ISlideInfo[]
}

export interface ISectionInfoStrictWidthSlides extends ISectionInfo {
  type: SectionType.STRICT_WIDTH_SLIDES
  slides: ISlideInfo[]
}

export interface ISectionInfoUSPs extends ISectionInfo {
  type: SectionType.USPS
  uspList: IUSPInfo[]
}

export interface ISectionInfoProcedures extends ISectionInfo {
  type: SectionType.PROCEDURES
  procedures: IProcedureInfo[]
}

export interface ISectionInfoCustomerFeedbacks extends ISectionInfo {
  type: SectionType.CUSTOMER_FEEDBACKS
  customerFeedbacks: ICustomerFeedbackInfo[]
}

export interface ISectionInfoShare extends ISectionInfo {
  type: SectionType.SHARE
}

export interface ISectionInfoOffers extends ISectionInfo {
  type: SectionType.OFFERS
  offers: any[]
}

export interface ISectionInfoCustom extends ISectionInfo {
  type: SectionType.CUSTOM
  bodyList: ICustomSectionBody[]
}

export interface ISectionInfoUpdateParams {
  name: string
  title: string | null
  subTitle: string | null
  showMoreUrl: string | null
  showDivider: boolean | null
  type: SectionType
}

export interface ISectionInfoUpdate {
  success: boolean
}

export interface ISectionInfoDelete {
  success: boolean
}

export interface IPageSectionInfoUpdateParams {
  sectionId: number
  position: number
  title: string | null
  subTitle: string | null
  showMoreUrl: string | null
  showDivider: boolean | null
}

export interface IPageSectionInfoUpdate {
  success: boolean
}

export interface IPageSectionInfoDelete {
  success: boolean
}
