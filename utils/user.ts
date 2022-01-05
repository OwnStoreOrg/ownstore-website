import appConfig from '../config/appConfig'

const authTokenKey = `${appConfig.global.app.key}-AUTH-TOKEN`
const authIdKey = `${appConfig.global.app.key}-AUTH-USER-ID`

export const getAuthToken = (): string | null => {
  return localStorage.getItem(authTokenKey)
}

export const setAuthToken = (authToken: string) => {
  localStorage.setItem(authTokenKey, authToken)
}

export const deleteAuthToken = () => {
  localStorage.removeItem(authTokenKey)
}

export const getAuthUserId = (): string | null => {
  const authUserId = localStorage.getItem(authIdKey)
  return authUserId ? window.atob(authUserId) : null
}

export const setAuthUserId = (authToken: string) => {
  localStorage.setItem(authIdKey, window.btoa(authToken))
}

export const deleteAuthUserId = () => {
  localStorage.removeItem(authIdKey)
}

export const isLoggedIn = () => {
  const authToken = getAuthToken()
  const authUserId = getAuthUserId()
  return authToken && authUserId
}
