import { useState, useRef, useContext, useEffect } from 'react'
import debug from 'debug'
import ApplicationContext from '../components/ApplicationContext'
import appConfig from '../config/appConfig'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'

const log = debug('pwa-install')

type PromptFn = (prompt: any) => void

interface PromptEvent extends Event {
  prompt: () => void
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const usePWAInstall = () => {
  const [show, toggle] = useState(false)
  const prompt = useRef<PromptEvent>(undefined)

  const applicationContext = useContext(ApplicationContext)

  useEffect(() => {
    if (appConfig.features.enablePWAPromotions) {
      window.addEventListener('beforeinstallprompt', (e: PromptEvent) => {
        log('Received beforeinstallprompt event', e)
        e.preventDefault() // hide in-built install UI
        prompt.current = e // store prompt object
        toggle(true) // show custom UI
      })

      window.addEventListener('appinstalled', e => {
        log('Received appinstalled event', e)
        setTimeout(() => {
          toggle(false)
        }, 1000)
      })
    }
  }, [])

  const showPrompt = (onAccept?: PromptFn, onDecline?: PromptFn) => {
    prompt.current.prompt() // show prompt
    prompt.current.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        log('User accepted the install prompt')
        if (onAccept) {
          onAccept(prompt)
        }
        appAnalytics.sendEvent({
          action: AnalyticsEventType.PWA_INSTALL_SUCCESS,
        })
      } else {
        log('User dismissed the install prompt')
        if (onDecline) {
          onDecline(prompt)
        }
        appAnalytics.sendEvent({
          action: AnalyticsEventType.PWA_INSTALL_FAILED,
        })
      }
    })
  }

  log('show custom install UI', show)

  return {
    showPWAInstall: show,
    showPWAInstallPrompt: showPrompt,
  }
}

export default usePWAInstall
