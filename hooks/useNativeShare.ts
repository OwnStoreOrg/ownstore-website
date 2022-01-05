import { useState, useEffect, useContext } from 'react'
import ApplicationContext from '../components/ApplicationContext'
import appConfig from '../config/appConfig'
import debug from 'debug'

const log = debug('native-share')

declare let window: any

const useNativeShare = () => {
  const [showNativeShare, toggleNativeShare] = useState(false)
  const [nativeShareFailed, toggleNativeShareFailed] = useState(false)

  const {
    device: { isMobile },
  } = useContext(ApplicationContext)

  useEffect(() => {
    log('nativeShare supported', !!window.navigator.share)

    if (window.navigator.share && isMobile) {
      log('show native share')

      toggleNativeShare(true)
    }
  }, [])

  const nativeShareUrl = ({ title, text, url }: { title?: string; text: string; url: string }) => {
    if (window.navigator.share) {
      window.navigator
        .share({
          title: title || appConfig.global.app.name,
          text,
          url: url,
        })
        .catch(e => {
          console.log(e, e.name, e.message)

          if (!['AbortError'].includes(e.name)) {
            // https://hotstar.atlassian.net/browse/ER-1904
            // https://developer.apple.com/forums/thread/662629
            toggleNativeShareFailed(true)
          }
        })
    }
  }

  return {
    showNativeShare,
    nativeShareUrl,
    nativeShareFailed,
    toggleNativeShareFailed,
  }
}

export default useNativeShare
