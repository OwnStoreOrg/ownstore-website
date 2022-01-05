import { useEffect } from 'react'

type OnEscape = (arg: KeyboardEvent) => void

const useEscape = (onEscape: OnEscape) => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      onEscape(e)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])
}

export default useEscape
