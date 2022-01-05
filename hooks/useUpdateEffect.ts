import { useRef, useEffect } from 'react'

const useUpdateEffect = (effect, dependencies = []) => {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      effect()
    }
  }, dependencies)
}

export default useUpdateEffect
