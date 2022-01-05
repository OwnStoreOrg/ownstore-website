export interface ApiRequestParams {
  method: 'get' | 'post' | 'put' | 'delete'
  path: string
  data?: Record<string, any>
  headers?: Record<string, string>
}

export interface ApiErrorResponse {
  status: number
  message: string
  code: string
  data: any
}

class ApiError extends Error {
  public readonly request: ApiRequestParams
  public readonly response: ApiErrorResponse
  public readonly _apiError: boolean
  public constructor(request: ApiRequestParams, response: ApiErrorResponse) {
    super('API Request Failed')
    this.request = request
    this.response = response
    this._apiError = true
  }
  public static isApiError(err: Error): boolean {
    return err instanceof Error && !!(err as ApiError)._apiError
  }
}

export default ApiError
