import { useRef } from 'react'
import useCustomLayoutEffect from './useCustomLayoutEffect'

const useUpdateLayoutEffect = (effect, dependencies = []) => {
  const isInitialMount = useRef(true)
  useCustomLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      effect()
    }
  }, dependencies)
}

export default useUpdateLayoutEffect
