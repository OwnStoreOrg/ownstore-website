import React, { ReactNode } from 'react'
import { IUserLoginAttributesInfo } from '../../contract/user'
import classnames from 'classnames'
import uaParser from 'ua-parser-js'
import { capitalize } from '../../utils/common'
import CoreImage from '../core/CoreImage'
import { SOCIAL_ICONS_SRC_MAP } from '../../constants/constants'
import { LoginSourceType, LoginType, PlatformType } from '../../contract/constants'
import { getFormattedDateTime } from '../../utils/dates'
import { LoginIcon, UserAddIcon } from '@heroicons/react/outline'

interface ILoginAttributesInfoProps {
  attributes: IUserLoginAttributesInfo
  index: number
}

const LoginAttributesInfo: React.FC<ILoginAttributesInfoProps> = props => {
  const { attributes, index } = props

  const renderItem = (title: ReactNode, subTitle: ReactNode, className?: string) => {
    return (
      <div className={classnames('flex items-center py-[1.5px]', className)}>
        <div className="font-medium font-primary-medium mr-1">{title}:</div>
        <div>{subTitle}</div>
      </div>
    )
  }

  const uaResult = uaParser(attributes.userAgent)
  const { browser, os, device } = uaResult

  const platform = capitalize(attributes.platform, true)
  let platformImageUrl = SOCIAL_ICONS_SRC_MAP.GLOBE
  if (attributes.platform === PlatformType.IOS) {
    platformImageUrl = SOCIAL_ICONS_SRC_MAP.APPLE
  }
  if (attributes.platform === PlatformType.ANDROID) {
    platformImageUrl = SOCIAL_ICONS_SRC_MAP.ANDROID
  }

  const loginSource = capitalize(attributes.loginSource, true)
  let sourceImageUrl = SOCIAL_ICONS_SRC_MAP.EMAIL
  if (attributes.loginSource === LoginSourceType.GOOGLE || attributes.loginSource === LoginSourceType.GOOGLE_ONE_TAP) {
    sourceImageUrl = SOCIAL_ICONS_SRC_MAP.GOOGLE
  }
  if (attributes.loginSource === LoginSourceType.FACEBOOK) {
    sourceImageUrl = SOCIAL_ICONS_SRC_MAP.FACEBOOK
  }
  if (attributes.loginSource === LoginSourceType.MANUAL_RESET) {
    sourceImageUrl = SOCIAL_ICONS_SRC_MAP.REFRESH
  }

  let TypeIcon = LoginIcon
  if (attributes.loginType === LoginType.SIGNUP) {
    TypeIcon = UserAddIcon
  }

  return (
    <div>
      {renderItem('Login Time', getFormattedDateTime(attributes.loginAt))}
      {/* {renderItem('Session Expiry Time', getFormattedDateTime(attributes.sessionExpiry))} */}
      {renderItem(
        'Type',
        <span className="inline-flex items-center" title={loginSource}>
          <TypeIcon className="w-5" />
          <span className="ml-1 text-sm">({attributes.loginType.toLowerCase()})</span>
        </span>
      )}

      {renderItem(
        'Platform',
        <span className="inline-flex items-center" title={platform}>
          <CoreImage url={platformImageUrl} alt={platform} className="w-4" />
          <span className="ml-1 text-sm">({attributes.platform.toLowerCase()})</span>
        </span>
      )}
      {renderItem(
        'Login Using',
        <span className="inline-flex items-center" title={loginSource}>
          <CoreImage url={sourceImageUrl} alt={loginSource} className="w-4" />
          <span className="ml-1 text-sm">({attributes.loginSource.toLowerCase()})</span>
        </span>
      )}
      {renderItem('IP Address', attributes.ipAddress)}
      {renderItem('Browser', browser.name)}
      {renderItem('Operating System', os.name)}
      {device.type ? renderItem('Device Type', capitalize(device.type, true)) : null}
      {device.model ? renderItem('Device Model', device.model) : null}
    </div>
  )
}

export default LoginAttributesInfo
