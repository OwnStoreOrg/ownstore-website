import { useState, useEffect } from 'react'

const useOrientation = () => {
  const [isLandscape, toggleIsLandscape] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: landscape)')
    toggleIsLandscape(mediaQuery.matches)

    const onOrientationChange = m => {
      toggleIsLandscape(m.matches)
    }

    mediaQuery.addListener(onOrientationChange)
    return () => {
      mediaQuery.removeListener(onOrientationChange)
    }
  }, [])

  return {
    isLandscapeMode: isLandscape,
  }
}

export default useOrientation
