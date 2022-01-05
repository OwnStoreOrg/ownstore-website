import React, { useRef } from 'react'
import useSSR from 'use-ssr'
import useCustomLayoutEffect from '../hooks/useCustomLayoutEffect'

interface IEscapeHTMLProps {
  element: string
  html: string
  className?: string
}

/*
  Renders raw HTML in a React component.
*/

const EscapeHTML: React.FC<IEscapeHTMLProps> = props => {
  const { element, html, className } = props

  const { isServer } = useSSR()
  const articleRef = useRef(null)

  useCustomLayoutEffect(() => {
    let updated = false
    if (document.createRange) {
      const range = document.createRange()
      if (range.createContextualFragment) {
        articleRef.current.innerHTML = ''
        articleRef.current.appendChild(range.createContextualFragment(html))
        updated = true
      }
    }
    if (!updated) {
      // this is added to support fallabck for old browsers
      if (articleRef.current.insertAdjacentHTML) {
        articleRef.current.innerHTML = ''
        articleRef.current.insertAdjacentHTML('afterBegin', html)
      } else {
        // if no update method found just set innerHTML, this may not execute scripts
        articleRef.current.innerHTML = html
      }
    }
  }, [html])

  return isServer
    ? React.createElement(element, { dangerouslySetInnerHTML: { __html: html }, ref: articleRef, className: className })
    : React.createElement(element, { ref: articleRef, className: className })
}

export default EscapeHTML
