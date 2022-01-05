import React from 'react'
import ReactGoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'
import appConfig from '../../config/appConfig'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import classnames from 'classnames'
import debug from 'debug'
import { prepareImageUrl } from '../../utils/image'

const logger = debug('google-login')

interface IGoogleLoginButtonProps {
  label: string
  onSuccess: (response: GoogleLoginResponse) => void
  onError?: (response: GoogleLoginResponseOffline) => void
  disabled?: boolean
  className?: string
}

const GoogleLoginButton: React.FC<IGoogleLoginButtonProps> = props => {
  const { label, onSuccess, onError, disabled = false, className } = props

  const handleResponse = (response: GoogleLoginResponse) => {
    onSuccess(response)
  }

  const handleFailure = (response: GoogleLoginResponseOffline) => {
    logger(response)
    if (onError) {
      onError(response)
    }
  }

  if (!appConfig.integrations.googleLogIn.enabled) {
    return null
  }

  return (
    <ReactGoogleLogin
      autoLoad={false}
      clientId={appConfig.integrations.googleLogIn.code}
      onSuccess={handleResponse}
      onFailure={handleFailure}
      disabled={disabled}
      render={renderProps => (
        <div
          onClick={renderProps.onClick}
          className={classnames(
            'p-3 flex items-center justify-center rounded font-medium font-primary-medium text-base cursor-pointer shadow transition-colors hover:bg-gray100',
            className
          )}>
          <CoreImage
            url={prepareImageUrl('/images/icons/third-party-login/google.svg', ImageSourceType.ASSET)}
            alt=""
            className="w-6 mr-2"
          />
          <span>{label}</span>
        </div>
      )}
    />
  )
}

export default GoogleLoginButton
