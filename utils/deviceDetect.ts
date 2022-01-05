const device = {
  Android() {
    return window.navigator.userAgent.match(/Android/i)
  },
  BlackBerry() {
    return window.navigator.userAgent.match(/BlackBerry/i)
  },
  iOS() {
    return window.navigator.userAgent.match(/iPhone|iPod|iPad/i)
  },
  Chrome() {
    return window.navigator.userAgent.match(/Chrome/i)
  },
  Firefox() {
    return window.navigator.userAgent.match(/Firefox/i)
  },
  Safari() {
    return window.navigator.userAgent.match(/^((?!chrome|android).)*safari/i)
  },
  OperaMini() {
    return window.navigator.userAgent.match(/Opera Mini/i)
  },
  IE() {
    return window.navigator.userAgent.match(/MSIE/i)
  },
  Windows() {
    return window.navigator.userAgent.match(/IEMobile/i)
  },
  TouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
  },
  any() {
    return !!(device.Android() || device.BlackBerry() || device.iOS() || device.OperaMini() || device.Windows())
  },
}

export const isChrome = () => !!device.Chrome()
export const isFirefox = () => !!device.Firefox()
export const isSafari = () => !!device.Safari()
export const isOperaMini = () => !!device.OperaMini()
export const isIE = () => !!device.IE()
export const isPwa = () => window.matchMedia('(display-mode: standalone)').matches
export const isIOSDevice = () => !!device.iOS()
export const isAndroidDevice = () => !!device.Android()
export const isTouchDevice = () => !!device.TouchDevice()

export const getChromeVersion = () =>
  isChrome && parseInt(window.navigator.userAgent.match(new RegExp('Chrome/([0-9]+).'))[1], 10)

export const getFirefoxVersion = () =>
  isFirefox && parseInt(window.navigator.userAgent.match(new RegExp('Firefox/([0-9]+).'))[1], 10)
