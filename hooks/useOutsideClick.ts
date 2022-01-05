import { useEffect } from 'react'

interface Options {
  ref: React.MutableRefObject<any>
  onOutsideClick: (arg: MouseEvent) => void
}

const useOutsideClick = ({ ref, onOutsideClick }: Options) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onOutsideClick(event)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })
}

export default useOutsideClick
