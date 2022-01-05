import React, { ReactNode, CSSProperties } from 'react'
import NextLink from 'next/link'
import appConfig from '../../config/appConfig'

export interface ICoreLinkProps {
  url: string
  className?: string
  isExternal?: boolean
  style?: CSSProperties
  title?: string
  onClick?: (e: any) => void
  children: ReactNode
}

const CoreLink: React.FC<ICoreLinkProps> = props => {
  const { url, className, isExternal, style, title, onClick, children } = props

  const handleClick = e => {
    if (onClick) onClick(e)
  }

  if ((url && url.indexOf('http') === 0) || !url) {
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        href={url || 'javascript:;'}
        className={className}
        target={isExternal ? '_blank' : '_parent'}
        rel={isExternal ? 'noopener noreferrer' : ''}
        style={style}
        title={title}
        onClick={handleClick}>
        {children}
      </a>
    )
  }

  return (
    <NextLink href={url} prefetch={appConfig.features.enablePagesPrefetching}>
      <a
        data-hover={typeof children === 'string' ? children : ''}
        className={className}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : ''}
        style={style}
        title={title}
        onClick={handleClick}>
        {children}
      </a>
    </NextLink>
  )
}

export default CoreLink
