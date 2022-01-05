import { precacheAndRoute } from 'workbox-precaching'
import * as navigationPreload from 'workbox-navigation-preload'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'

const VERSION = 1

precacheAndRoute(self.__WB_MANIFEST)

const CACHE_NAME = `offline-html-${VERSION}`

// This assumes /offline.html is a URL for your self-contained
// (no external images or styles) offline page.
const FALLBACK_HTML_URL = '/html/offline.html'

// Populate the cache with the offline HTML page when the
// service worker is installed.
self.addEventListener('install', async event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.add(FALLBACK_HTML_URL)))
})

navigationPreload.enable()

const networkOnly = new NetworkOnly()
const navigationHandler = async params => {
  try {
    // Attempt a network request.
    return await networkOnly.handle(params)
  } catch (error) {
    // If it fails, return the cached HTML.
    return caches.match(FALLBACK_HTML_URL, {
      cacheName: CACHE_NAME,
    })
  }
}

// Register this strategy to handle all navigations.
registerRoute(new NavigationRoute(navigationHandler))
