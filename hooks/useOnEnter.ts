import React, { useEffect, useState } from 'react'

const useOnEnter = (elementRef, handleSubmit) => {
  const [shortcut, setShortcut] = useState(null)

  useEffect(() => {
    if (shortcut === 13) {
      handleSubmit()
    }
  }, [shortcut])

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      setShortcut(event.keyCode)
    }

    if (elementRef.current) {
      elementRef.current.addEventListener('keydown', handleKeyUp)
    }
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('keydown', handleKeyUp)
      }
    }
  }, [])
}

export default useOnEnter
