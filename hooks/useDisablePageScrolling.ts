import { useEffect } from 'react'
import { disablePageScrolling, enablePageScrolling } from '../utils/common'

const useDisablePageScrolling = () => {
  useEffect(() => {
    disablePageScrolling()
    return () => enablePageScrolling()
  }, [])
}

export default useDisablePageScrolling
