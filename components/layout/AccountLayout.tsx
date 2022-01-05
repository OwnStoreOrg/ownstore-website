import React, { useContext, useEffect } from 'react'
import { DesktopView, MobileView } from '../ResponsiveViews'
import AccountLinks from '../account/AccountLinks'
import CoreLink from '../core/CoreLink'
import { getSecurityPageUrl } from '../../utils/account'
import { useRouter } from 'next/router'
import { InformationCircleIcon } from '@heroicons/react/solid'
import AddSecurityQuestionsMessage from '../security/AddSecurityQuestionsMessage'
import ApplicationContext from '../ApplicationContext'

interface IAccountLayoutProps {
  hideAccountLinks?: {
    desktop: boolean
    mobile: boolean
  }
}

const AccountLayoutDesktop: React.FC<IAccountLayoutProps> = props => {
  const { children, hideAccountLinks } = props

  return (
    <div>
      <div className="flex">
        {hideAccountLinks?.desktop ? null : (
          <div className="w-80">
            <AccountLinks />
          </div>
        )}
        <div className="ml-6 account-layout-desktop-width">
          <AddSecurityQuestionsMessage />
          {children}
        </div>
      </div>
    </div>
  )
}

const AccountLayoutMobile: React.FC<IAccountLayoutProps> = props => {
  const { children, hideAccountLinks } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  return (
    <div>
      <AddSecurityQuestionsMessage />
      <div>{children}</div>
      {hideAccountLinks?.mobile || !user ? null : (
        <div className="mt-10 px-2">
          <AccountLinks />
        </div>
      )}
    </div>
  )
}

const AccountLayout: React.FC<IAccountLayoutProps> = props => {
  return (
    <div>
      <DesktopView>
        <AccountLayoutDesktop {...props} />
      </DesktopView>
      <MobileView>
        <AccountLayoutMobile {...props} />
      </MobileView>
    </div>
  )
}

export default AccountLayout
