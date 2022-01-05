export const insertStylesheet = (url: string, name: string): Promise<void> => {
  return new Promise(resolve => {
    const linkTag = document.createElement('link')

    const alreadyExists = document.querySelectorAll(`.${name}`)
    if (alreadyExists.length > 0) {
      return resolve()
    }

    const finalUrl = url

    linkTag.href = finalUrl
    linkTag.rel = 'stylesheet'
    linkTag.type = 'text/css'
    linkTag.className = name

    document.body.appendChild(linkTag)
    resolve()
  })
}

/*
  Loads and executes scripts. Appends the script at the bottom of body tag.
  Promise is fulfilled when the script is executed.
*/
export const loadAndExecuteScript = (url: string, name: string): Promise<void> => {
  return new Promise(resolve => {
    const script = document.createElement('script')
    script.type = 'text/javascript'

    const isLoaded = document.querySelectorAll(`.${name}`) || document.querySelectorAll(`script[src="${url}"]`)
    if (isLoaded.length > 0) {
      return resolve()
    }

    // @ts-ignore
    if (script.readyState) {
      //IE
      // @ts-ignore
      script.onreadystatechange = function () {
        // @ts-ignore
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          // @ts-ignore
          script.onreadystatechange = null
          resolve()
        }
      }
    } else {
      //Others
      script.onload = function () {
        resolve()
      }
    }

    const finalUrl = url

    script.src = finalUrl
    script.className = name
    document.body.appendChild(script)
  })
}
