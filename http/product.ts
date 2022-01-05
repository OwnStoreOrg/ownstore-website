import { httpClient } from './httpClient'
import {
  IIndividualProductInfo,
  IIndividualProductDetail,
  IComboProductInfo,
  IComboProductDetail,
} from '../contract/product'
import { IFindParams } from '../contract/common'

export const getIndividualProductInfosByCatalogueId = async (
  catalogueId: number,
  findParams: IFindParams
): Promise<IIndividualProductInfo[]> => {
  const result = await httpClient.get<IIndividualProductInfo[]>(`/product/info/catalogue/${catalogueId}`, findParams)
  return result
}

export interface IGetIndividualProductInfoParams {
  limit?: number
}

export const getIndividualProductInfo = async (
  params: IGetIndividualProductInfoParams
): Promise<IIndividualProductInfo[]> => {
  const result = await httpClient.get<IIndividualProductInfo[]>('/product/individual/info', params)
  return result
}

export const getIndividualProductDetailById = async (id: number): Promise<IIndividualProductDetail> => {
  const result = await httpClient.get<IIndividualProductDetail>(`/product/individual/detail/${id}`)
  return result
}

export interface IGetComboProductInfoParams {
  limit?: number
}

export const getComboProductInfo = async (params: IGetComboProductInfoParams): Promise<IComboProductInfo[]> => {
  const result = await httpClient.get<IComboProductInfo[]>('/product/combo/info', params)
  return result
}

export const getComboProductDetailById = async (id: number): Promise<IComboProductDetail> => {
  const result = await httpClient.get<IComboProductDetail>(`/product/combo/detail/${id}`)
  return result
}
