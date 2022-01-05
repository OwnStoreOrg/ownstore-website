import React, { useContext, PropsWithChildren } from 'react'
import ApplicationContext from './ApplicationContext'

interface IResponsiveViewProps {
  useCSS?: boolean
}

export const DesktopView: React.FC<IResponsiveViewProps> = props => {
  const { useCSS, children } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isDesktop },
  } = applicationContext

  if (useCSS) {
    return <div className="desktop-view">{children}</div>
  }

  return <>{isDesktop ? children : null}</>
}

export const MobileView: React.FC<IResponsiveViewProps> = props => {
  const { useCSS, children } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isMobile },
  } = applicationContext

  if (useCSS) {
    return <div className="mobile-view">{children}</div>
  }

  return <>{isMobile ? children : null}</>
}
