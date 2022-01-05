import React from 'react'
import { ReactFacebookLoginInfo, ReactFacebookFailureResponse } from 'react-facebook-login'
import ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import appConfig from '../../config/appConfig'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import classnames from 'classnames'
import debug from 'debug'
import { prepareImageUrl } from '../../utils/image'

const logger = debug('facebook-login')

interface IFacebookLoginButtonProps {
  label: string
  onSuccess: (response: ReactFacebookLoginInfo) => void
  onError?: (response: ReactFacebookFailureResponse) => void
  disabled?: boolean
  className?: string
}

const FacebookLoginButton: React.FC<IFacebookLoginButtonProps> = props => {
  const { label, onSuccess, onError, disabled, className } = props

  const handleResponse = (response: ReactFacebookLoginInfo) => {
    onSuccess(response)
  }

  const handleFailure = (response: ReactFacebookFailureResponse) => {
    logger(response)
    if (onError) {
      onError(response)
    }
  }

  if (!appConfig.integrations.facebookLogIn.enabled) {
    return null
  }

  return (
    <ReactFacebookLogin
      appId={appConfig.integrations.facebookLogIn.code}
      callback={handleResponse}
      onFailure={handleFailure}
      autoLoad={false}
      fields="name,email"
      disableMobileRedirect
      isDisabled={disabled}
      render={renderProps => (
        <div
          onClick={renderProps.onClick}
          className={classnames(
            'p-3 bg-funBlue text-white flex items-center justify-center rounded font-medium font-primary-medium text-base cursor-pointer transition-colors shadow hover:bg-moodyBlue',
            className
          )}>
          <CoreImage
            url={prepareImageUrl('/images/icons/third-party-login/facebook.svg', ImageSourceType.ASSET)}
            alt=""
            className="w-6 mr-2"
          />
          <span>{label}</span>
        </div>
      )}
    />
  )
}

export default FacebookLoginButton
