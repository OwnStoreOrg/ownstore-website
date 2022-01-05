import { IUserAddressInfo } from '../contract/address'

export const getAccountDetailsPageUrl = () => {
  return '/account/details'
}

export const getEditAccountPageUrl = () => {
  return '/account/details/edit'
}

export const getChangePasswordPageUrl = () => {
  return '/account/details/change-password'
}

export const getAddressPageUrl = () => {
  return '/account/address'
}

export const getOrdersPageUrl = () => {
  return '/account/order'
}

export const getOrderDetailPageUrl = (orderId: number) => {
  return `/account/order/${orderId}`
}

export const getLoginHistoryPageUrl = () => {
  return '/account/login-history'
}

export const getSecurityPageUrl = () => {
  return '/account/security'
}

export const getPrimaryUserAddress = (userAddresses: IUserAddressInfo[]): IUserAddressInfo | undefined => {
  return userAddresses.find(userAddress => userAddress.isPrimary)
}

export const getUserAddressToShow = (userAddresses: IUserAddressInfo[]): IUserAddressInfo | undefined => {
  return getPrimaryUserAddress(userAddresses) || userAddresses[0]
}

export const addUserAddress = (
  userAddresses: IUserAddressInfo[],
  newUserAddress: IUserAddressInfo
): IUserAddressInfo[] => {
  return [newUserAddress, ...userAddresses]
}

export const updateUserAddress = (
  userAddresses: IUserAddressInfo[],
  userAddress: IUserAddressInfo
): IUserAddressInfo[] => {
  return userAddresses.map(address => {
    if (address.id === userAddress.id) {
      return userAddress
    }
    return address
  })
}
