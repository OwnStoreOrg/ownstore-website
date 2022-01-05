export const dynamicNprogress = () => import(/* webpackChunkName: "Nprogress" */ 'nprogress')

export const dynamicToast = () =>
  import(/* webpackChunkName: "react-hot-toast" */ 'react-hot-toast').then(mod => mod.toast)

export const dynamicSentry = () => import(/* webpackChunkName: "sentry" */ '@sentry/react')

export const dynamiJwtDecode = () => import(/* webpackChunkName: "jwt-decode" */ 'jwt-decode').then(mod => mod.default)

export const dynamicSentryTracingIntegrations = () =>
  import(/* webpackChunkName: "sentry-tracing" */ '@sentry/tracing').then(mod => mod.Integrations)
