import { useRouter, Router } from 'next/router'
import { useEffect, useRef, useState } from 'react'

function usePrevious(value) {
  const ref = useRef()
  const router = useRouter()

  useEffect(() => {
    ref.current = value
  }, [router.pathname])
  return ref.current
}

const usePreviousLocation = () => {
  const router = useRouter()
  // const [previousLocation, setPreviousLocation] = useState()

  const v = usePrevious(router.pathname)

  console.log(v)
}

export default usePreviousLocation
