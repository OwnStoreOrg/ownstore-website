import debug from 'debug'
import fetchRetry from 'fetch-retry'
import { toastDismiss, toastError } from '../components/Toaster'
import appConfig from '../config/appConfig'
import ApiError, { ApiRequestParams } from '../error/ApiError'
import { isBrowser } from '../utils/common'
import { getAuthToken } from '../utils/user'

declare let window: any

const _fetch = fetchRetry(fetch)

const log = debug('http')

async function fetchWithTimeout(url: string, options: Record<string, any>): Promise<any> {
  const ctrl = new AbortController()
  const signal = ctrl.signal

  const fetchData = _fetch(url, { signal, ...options })

  const timeOut = new Promise(resolve => {
    setTimeout(async () => {
      ctrl.abort()
      resolve(null)
    }, options.timeout)
  })

  const result = await Promise.race([fetchData, timeOut])
  return result
}

const callApi = async <T>(requestParams: ApiRequestParams): Promise<T> => {
  const { method, path, data, headers } = requestParams

  const finalHeaders = headers || {}

  if (method !== 'get' && data) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (isBrowser()) {
    const authToken = getAuthToken()

    if (authToken) {
      finalHeaders['x-access-token'] = authToken
    }
  }

  let options: any = {
    method,
    headers: finalHeaders,
    // timeout: appConfig.global.apiResponseTimeout,
  }

  if (method === 'get') {
    options = {
      ...options,
      retries: 4,
      retryDelay: (attempt, error, response) => {
        return Math.pow(2, attempt) * 1000 // 1000, 2000, 4000, 8000
      },
      retryOn: [502, 503, 504],
    }
  }

  let finalUrl = appConfig.global.apiBaseUrl + path

  if (method === 'get') {
    const queryParams = []

    for (const key in data) {
      const value = data[key]

      if (Array.isArray(value)) {
        value.forEach(v => {
          queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(v))
        })
      } else {
        queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      }
    }
    finalUrl = `${finalUrl}?${queryParams.join('&')}`
  } else {
    options['body'] = JSON.stringify(data)
  }

  let response
  let responseBody

  try {
    response = await _fetch(finalUrl, options)
  } catch (err) {
    throw new ApiError(requestParams, {
      status: 500,
      message: err.message,
      code: 'HTTP_CALL_FAILED',
      data: null,
    })
  }

  log(response.status, finalUrl)

  try {
    responseBody = await response.json().then(data => data as T)
  } catch (err) {
    throw new ApiError(requestParams, {
      status: response.status,
      message: `Error while parsing API response: ${err.message}`,
      code: 'INVALID_RESPONSE',
      data: null,
    })
  }

  if (response.status >= 200 && response.status < 300) {
    return responseBody
  }

  if (responseBody.code === 'INVALID_TOKEN') {
    window.APP.logout()
    toastDismiss()
    toastError('Authorization failed!')
    return
  }

  throw new ApiError(requestParams, {
    status: response.status,
    message: responseBody.message,
    code: responseBody.code,
    data: responseBody.data,
  })
}

export const httpClient = {
  async get<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return callApi({
      method: 'get',
      path,
      data: params,
      headers,
    })
  },
  async post<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return callApi({
      method: 'post',
      path,
      data: params,
      headers,
    })
  },
  async put<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return callApi({
      method: 'put',
      path,
      data: params,
      headers,
    })
  },
  async delete<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return callApi({
      method: 'delete',
      path,
      data: params,
      headers,
    })
  },
}
