const app = {
  name: 'OwnStore Demo',
  shortName: 'OwnStore Demo',
  summary: 'A summary',
  key: 'OWN-STORE-DEMO', // should be uppercase
}

const appConfig = {
  isDev: process.env.STORE_WEB_ENV.includes('local'),
  env: process.env.STORE_WEB_ENV,
  global: {
    app: app,
    domain: process.env.STORE_WEB_DOMAIN,
    baseUrl: process.env.STORE_WEB_BASE_URL,
    assetBaseUrl: process.env.STORE_WEB_ASSETS_BASE_URL,
    imageBaseUrl: process.env.STORE_WEB_IMAGE_BASE_URL,
    apiBaseUrl: process.env.STORE_WEB_API_BASE_URL,
    infiniteScrollFetchLimit: 20,
    scrollToTopDisplayThreshold: 1400,
    // apiResponseTimeout: 5 * 1000,
    minSecurityQuestions: 3,
    openBlogsInNewTab: true,
  },
  seo: {
    facebook: {
      pageId: process.env.STORE_WEB_SEO_FACEBOOK_PAGE_ID,
    },
    twitter: {
      username: process.env.STORE_WEB_SEO_TWITTER_USERNAME,
    },
  },
  pwa: {
    shortcuts: [
      {
        name: 'Search',
        short_name: 'Search',
        url: '/search?utm_source=pwa&utm_medium=shortcut',
      },
      {
        name: 'Catalogues',
        short_name: 'Catalogues',
        url: '/catalogue?utm_source=pwa&utm_medium=shortcut',
      },
    ],
    startUrl: '/?utm_source=pwa&utm_medium=homescreen',
    icons: {
      maskable: false, // make sure icons can be masked before setting to true
    },
    preferNativeAppOverPWA: false, // if set to true, pwa prompt will not show up (browser behaviour)
  },
  app: {
    android: {
      name: '',
      id: '',
      storeUrl: '',
    },
    iOS: {
      name: '',
      id: '',
      storeUrl: '',
    },
  },
  search: {
    placeholder: {
      header: `Search ${app.name}...`,
      page: 'Search for products, catalogues & more',
    },
    sectionFetchLimit: 10, // get 10 items for each section such as catalogues, combos, and Individual products
  },
  features: {
    enableLandscapeMode: process.env.STORE_WEB_ENABLE_LANDSCAPE_MODE === 'true',
    enablePageTransition: process.env.STORE_WEB_ENABLE_PAGE_TRANSITION === 'true',
    enableScrollToTop: process.env.STORE_WEB_ENABLE_SCROLL_TO_TOP === 'true',
    enablePWAPromotions: process.env.STORE_WEB_ENABLE_PWA_PROMOTIONS === 'true',
    enableAppPromotions: process.env.STORE_WEB_ENABLE_APP_PROMOTIONS === 'true',
    enablePagesPrefetching: process.env.STORE_WEB_ENABLE_PAGES_PREFETCHING === 'true',
  },
  build: {
    pageRevalidateTimeInSec: {
      CATALOGUE: 15 * 60,
      COMBO: 15 * 60,
      FAQ: 30 * 60,
      PRODUCT: 15 * 60,
      SECTION: 15 * 60,
      EXPLORE: 15 * 60,
      HOME: 15 * 60,
      PRIVACY_POLICY: 60 * 60,
      TERMS_CONDITIONS: 60 * 60,
      REFUND_POLICY: 60 * 60,
      SHIPPING_POLICY: 60 * 60,
      404: 15 * 60,
      ERROR: 15 * 60,
      SEARCH: 15 * 60,
      SEARCH_RESULTS: 15 * 60, // server-rendered page
    },
    initialPageBuildCount: {
      CATALOGUE: 40,
      PRODUCT: 100,
      COMBO: 100,
      SECTION: 10,
      FAQ: 10,
    },
  },
  integrations: {
    googleOneTapLogIn: {
      enabled: process.env.STORE_WEB_INTEGRATION_GOOGLE_ONE_TAP_LOGIN_ENABLED === 'true',
      code: process.env.STORE_WEB_INTEGRATION_GOOGLE_ONE_TAP_LOGIN_CLIENT_CODE,
    },
    googleLogIn: {
      enabled: process.env.STORE_WEB_INTEGRATION_GOOGLE_LOGIN_ENABLED === 'true',
      code: process.env.STORE_WEB_INTEGRATION_GOOGLE_LOGIN_CLIENT_CODE,
    },
    facebookLogIn: {
      enabled: process.env.STORE_WEB_INTEGRATION_FACEBOOK_LOGIN_ENABLED === 'true',
      code: process.env.STORE_WEB_INTEGRATION_FACEBOOK_LOGIN_APP_CODE,
    },
    stripePayment: {
      code: process.env.STORE_WEB_INTEGRATION_STRIPE_PAYMENT_SECRET_KEY,
      publicCode: process.env.STORE_WEB_INTEGRATION_STRIPE_PAYMENT_PUBLIC_KEY,
    },
    googleAnalytics: {
      enabled: process.env.STORE_WEB_INTEGRATION_GOOGLE_ANALYTICS_ENABLED === 'true',
      webCode: process.env.STORE_WEB_INTEGRATION_GOOGLE_ANALYTICS_WEB_CODE,
    },
    googleSiteVerification: {
      enabled: process.env.STORE_WEB_INTEGRATION_GOOGLE_SITE_VERIFICATION_ENABLED === 'true',
      code: process.env.STORE_WEB_INTEGRATION_GOOGLE_SITE_VERIFICATION_CODE,
    },
    sentryErrorReporting: {
      enabled: process.env.STORE_WEB_INTEGRATION_SENTRY_ENABLED === 'true',
      dsn: process.env.STORE_WEB_INTEGRATION_SENTRY_DSN,
    },
    imageTransformation: {
      enabled: process.env.STORE_WEB_INTEGRATION_CLOUDINARY_ENABLED === 'true',
      variants: {
        // square (1:1)
        SQUARE_300: 't_s_300', //c_fill,h_300,w_300
        SQUARE_150: 't_s_150', //c_fill,h_150,w_150
        SQUARE_500: 't_s_500', //c_fill,h_500,w_500

        // wide (16:9)
        WIDE_620: 't_w_620', // c_fill,w_620,h_350

        // full screen
        FULL_1280: 't_full_1280', // c_fill,w_1280
      },
    },
  },
  company: {
    name: 'OwnStore Demo Pvt. Ltd.',
    contactNumber: '+918104570640',
    contactEmail: 'ownstoreonlinee@gmail.com',
    address: {
      streetAddress: 'Zed Pearl, No 12, Domlur Layout',
      addressLocality: 'Mumbai, Maharashtra',
      addressRegion: 'India',
      postalCode: '400000',
    },

    socialLinks: [
      { type: 'TWITTER', url: 'https://twitter.com/ownStore_', name: 'Twitter', isExternal: true },
      { type: 'FACEBOOK', url: 'https://www.facebook.com/ownStoreFB', name: 'Facebook', isExternal: true },
      { type: 'INSTAGRAM', url: 'https://www.instagram.com/ownStore__/', name: 'Instagram', isExternal: true },
      {
        type: 'YOUTUBE',
        url: 'https://www.youtube.com/channel/UCp7xl0E-JtFQamoZNBO8yGw',
        name: 'YouTube',
        isExternal: true,
      },
      { type: 'WHATSAPP', url: 'https://wa.me/+919999999999', name: 'WhatsApp', isExternal: true },
      { type: 'MAIL', url: 'mailto:ownstoreonlinee@gmail.com', name: 'Mail', isExternal: true },
    ],
  },
  footer: {
    links: [
      { label: 'FAQ', url: '/faq' },
      { label: 'Privacy Policy', url: '/privacy-policy' },
      { label: 'Terms of Use', url: '/terms-conditions' },
      { label: 'Refund Policy', url: '/refund-policy' },
      { label: 'Shipping Policy', url: '/shipping-policy' },
      { label: 'Contact', url: '/contact' },
    ],
    copyrightText: `&copy; ${new Date().getFullYear()} ${app.name}. All rights reserved`,
  },
  share: {
    section: {
      title: `Hey! Checkout ${app.name} for amazing products`,
    },
    product: {
      title: `Checkout {{PRODUCT_NAME}} on ${app.name}!`, // Dynamic keywords allowed: PRODUCT_NAME, PRODUCT_URL
    },
  },
}

export default appConfig
