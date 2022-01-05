/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins')
const { getAbsPath } = require('./scripts/fileSystem')
const nextPWA = require('next-pwa')

const appEnv = process.env.STORE_WEB_ENV

if (!appEnv) {
  console.error('STORE_WEB_ENV env variable is not set', process.env.HSCI_STORE_WEB_ENV)
  process.exit(1)
}

const { parsed: parsedEnvs } = require('dotenv').config({
  path: getAbsPath(`env/${appEnv}.env`),
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZE === 'true',
})

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
]

const nextConfig = {
  env: {
    ...parsedEnvs,
    STORE_WEB_ENV: process.env.STORE_WEB_ENV,
  },
  trailingSlash: false,
  basePath: '',
  poweredByHeader: false,
  optimizeFonts: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  assetPrefix: process.env.STORE_WEB_ASSETS_BASE_URL,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [...securityHeaders],
      },
    ]
  },
  async redirects() {
    return []
  },
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/js/sw.js',
      },
      {
        source: '/sw.js.map',
        destination: '/js/sw.js.map',
      },
      // {
      //   source: '/.well-known/apple-developer-merchantid-domain-association',
      //   destination: '/misc/apple-developer-merchantid-domain-association',
      // },
    ]
  },
}

const withNextPWA = [
  nextPWA,
  {
    pwa: {
      dest: 'public/js',
      sw: 'sw.js',
      scope: '/',
      disable: appEnv.startsWith('local'),
      register: true,
      swSrc: './pwa/service-worker.js',
    },
  },
]

module.exports = withPlugins([withNextPWA, withBundleAnalyzer], nextConfig)
