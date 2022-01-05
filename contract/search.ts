import { IIndividualProductInfo, IComboProductInfo } from './product'
import { ICatalogueInfo } from './catalogue'

export interface ISearchInfo {
  catalogues: ICatalogueInfo[] | null
  individualProducts: IIndividualProductInfo[] | null
  comboProducts: IComboProductInfo[] | null
}
