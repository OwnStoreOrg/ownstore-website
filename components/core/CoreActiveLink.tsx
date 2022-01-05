import React from 'react'
import { useRouter } from 'next/router'
import CoreLink, { ICoreLinkProps } from './CoreLink'

interface ICoreActiveLinkProps extends ICoreLinkProps {
  pagePaths?: string[]
  activeClassName?: string
}

/*
  Whenever you want your link to stay active when URL is same as link's href, use CoreActiveLink instead of CoreLink.
  There are 2 ways to controls active state:
  1. You can provide activeClassName to this component and whenever URL is same, the className you provided will be attached.
  2. Sometimes you want extra functionality than attaching className, you could also provide a functional child which will return whether
     the wrapped link is active or not.

  Usage:
    <CoreActiveLink href="/match/live" activeClassName='active'>
      <span>Live</span>
    </CoreActiveLink>

    <CoreActiveLink href="/match/live">
      (isActive =>
        <span className={isActive ? 'active' : ''} >Live</span>
      )
    </CoreActiveLink>

    <CoreActiveLink href="/match/live">
      (isActive =>
        <span>isActive ? `You've visited` : 'Please visit'</span>
      )
    </CoreActiveLink>
*/
const CoreActiveLink: React.FC<ICoreActiveLinkProps> = props => {
  const { url, pagePaths, children, activeClassName, className, ...rest } = props
  const { asPath, pathname } = useRouter()

  const asPathEquals = asPath === url
  const pagePathEquals = (pagePaths || []).includes(pathname)

  /*
    Sometimes there are different URL versions of the same page.
    URLs can be be different for a page but not the page pagePath.
    So if consumer provides pathPath, we'll use it for active state.
  */
  const isActive = pagePaths ? pagePathEquals : asPathEquals

  const updatedClassName = isActive ? activeClassName : ''

  return (
    <CoreLink url={url} className={`${className} ${updatedClassName}`} {...rest}>
      {typeof children === 'function' ? children(isActive) : children}
    </CoreLink>
  )
}

export default CoreActiveLink
