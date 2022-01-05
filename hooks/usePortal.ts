import { useRef, useEffect, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import useSSR from 'use-ssr'

const usePortal = (): React.FC => {
  // useful hooks
  const { isServer, isBrowser } = useSSR()

  // create a portal child element only on browser
  const portal = useRef(isBrowser ? document.createElement('div') : null)

  // Append/Remove child portal
  // @ts-ignore
  useEffect(() => {
    if (isServer) return

    const node = portal.current
    document.body.appendChild(portal.current)

    return () => document.body.removeChild(node)
  }, [isServer, portal])

  // Portal component
  const Portal = useCallback(
    ({ children }: { children: ReactNode }) => {
      if (portal.current != null) return createPortal(children, portal.current)
      return null
    },
    [portal]
  )

  return Portal
}

export default usePortal
