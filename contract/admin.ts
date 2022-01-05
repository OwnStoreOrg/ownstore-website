export interface IAdminVerified {
  success: boolean
}

export interface IAdminVerifyParams {
  key: string
}

export interface IAdminVerify {
  success: boolean
  token: string | null
}
