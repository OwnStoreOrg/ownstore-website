import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import {
  getAddressPageUrl,
  getAccountDetailsPageUrl,
  getLoginHistoryPageUrl,
  getChangePasswordPageUrl,
  getEditAccountPageUrl,
  getOrderDetailPageUrl,
  getSecurityPageUrl,
} from '../../account'

// http://localhost:3000/account/details
export const prepareAccountDetailsPageSeo = (): IAppSeoProps => {
  return {
    title: 'Account details',
    description: 'Account details description',
    canonical: `${appConfig.global.baseUrl}${getAccountDetailsPageUrl()}`,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}

// http://localhost:3000/account/details/edit
export const prepareAccountDetailsEditPageSeo = (): IAppSeoProps => {
  return {
    title: 'Edit account details',
    description: 'Edit account details description',
    canonical: `${appConfig.global.baseUrl}${getEditAccountPageUrl()}`,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}

// http://localhost:3000/account/details/change-password
export const prepareAccountChangePasswordPageSeo = (): IAppSeoProps => {
  return {
    title: 'Change password',
    description: 'Change password description',
    canonical: `${appConfig.global.baseUrl}${getChangePasswordPageUrl()}`,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}

// http://localhost:3000/account/address
export const prepareAccountAddressPageSeo = (): IAppSeoProps => {
  return {
    title: 'Addresses',
    description: 'Addresses description',
    canonical: `${appConfig.global.baseUrl}${getAddressPageUrl()}`,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}

// http://localhost:3000/account/login-history
export const prepareAccountLoginHistoryPageSeo = (): IAppSeoProps => {
  return {
    title: 'Login History',
    description: 'Login History description',
    canonical: `${appConfig.global.baseUrl}${getLoginHistoryPageUrl()}`,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}

// http://localhost:3000/account/order
export const prepareAccountOrdersPageSeo = (): IAppSeoProps => {
  return {
    title: 'Orders',
    description: 'Orders description',
    canonical: `${appConfig.global.baseUrl}${getLoginHistoryPageUrl()}`,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}

// http://localhost:3000/account/order/16
export const prepareAccountOrderDetailPageSeo = (orderId: number): IAppSeoProps => {
  return {
    title: 'Order detail',
    description: 'Order detail description',
    canonical: `${appConfig.global.baseUrl}${getOrderDetailPageUrl(orderId)}`,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}

// http://localhost:3000/account/security
export const prepareAccountSecurityPageSeo = (): IAppSeoProps => {
  return {
    title: 'Account security',
    description: 'Account security description',
    canonical: `${appConfig.global.baseUrl}${getSecurityPageUrl()}`,
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}
