import React, { useEffect, useState } from 'react'
import 'styles/styles.scss'
import { NextPage } from 'next'
import AppSeo, { IAppSeoProps } from '../components/seo/AppSeo'
import ApplicationContext from '../components/ApplicationContext'
import Header from '../components/header/Header'
import { Router, useRouter } from 'next/router'
import { dynamicNprogress } from '../components/dynamicModules'
import Footer from '../components/footer/Footer'
import ScrollToTop from '../components/ScrollTopTop'
import OrientationLock from '../components/OrientationLock'
import appConfig from '../config/appConfig'
import useApplicationContext from '../hooks/useApplicationContext'
import classnames from 'classnames'
import CookieBanner from '../components/CookieBanner'
import Toaster, { toastSuccess } from '../components/Toaster'
import { DynamicPageTransition } from '../components/dynamicComponents'
import ErrorBoundary from '../components/error/ErrorBoundary'
import appAnalytics from '../lib/analytics/appAnalytics'
import GoogleOneTapLogin from '../components/login/GoogleOneTapLogin'

declare let window: any

export interface IPageLayoutData {
  header: {
    hideTopNav?: {
      mobile: boolean
      desktop: boolean
    }
  }
  footer: {
    show: boolean
  }
}

export interface IGlobalLayoutProps {
  pageData: any
  seo: IAppSeoProps
  layoutData: IPageLayoutData
  analytics: any
}

interface IProps {
  Component: NextPage<IGlobalLayoutProps>
  pageProps: IGlobalLayoutProps
}

Router.events.on('routeChangeStart', () => {
  dynamicNprogress().then(mod => mod.start())
})

Router.events.on('routeChangeComplete', () => {
  dynamicNprogress().then(mod => mod.done())
})

Router.events.on('routeChangeError', () => {
  dynamicNprogress().then(mod => mod.done())
})

const MyApp: NextPage<IProps> = props => {
  const { Component, pageProps } = props
  const { layoutData, seo } = pageProps || {}

  const { footer, header } = layoutData || {}
  const { hideTopNav } = header || {}

  const { applicationContext, dispatchApplicationContext } = useApplicationContext()
  const router = useRouter()

  const [analyticsLoaded, toggleAnalyticsLoaded] = useState(false)

  useEffect(() => {
    window.APP.logout = applicationContext.logout

    appAnalytics.init().then(() => {
      toggleAnalyticsLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (analyticsLoaded) {
      appAnalytics.sendPageView({
        pageTitle: router.asPath,
        pagePath: router.asPath,
      })
    }
  }, [router.asPath, analyticsLoaded])

  let showTopNav: boolean

  if (!hideTopNav) {
    showTopNav = true
  } else {
    if (hideTopNav.desktop && hideTopNav.mobile) {
      showTopNav = false
    } else if (hideTopNav.desktop && !hideTopNav.mobile) {
      showTopNav = !applicationContext.device.isDesktop
    } else if (!hideTopNav.desktop && hideTopNav.mobile) {
      showTopNav = !applicationContext.device.isMobile
    }
  }

  return (
    <ApplicationContext.Provider value={applicationContext}>
      <AppSeo {...seo} />
      <Header topNavVisibility={showTopNav} />

      <GoogleOneTapLogin />

      <main
        id={classnames('pageMain', {
          'pageMain-lock': appConfig.features.enableLandscapeMode,
        })}
        className="pb-16 lg:pb-0">
        <ErrorBoundary key={router.route}>
          {appConfig.features.enablePageTransition ? (
            <DynamicPageTransition timeout={300} classNames="pageTransition">
              <Component {...pageProps} key={router.route} />
            </DynamicPageTransition>
          ) : (
            <Component {...pageProps} key={router.route} />
          )}

          {footer?.show ? <Footer /> : null}
        </ErrorBoundary>
      </main>

      <CookieBanner />
      <Toaster />
      {appConfig.features.enableScrollToTop ? <ScrollToTop /> : null}
      {appConfig.features.enableLandscapeMode ? <OrientationLock /> : null}
    </ApplicationContext.Provider>
  )
}

export default MyApp
