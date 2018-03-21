
let counter = 0
const createIframe = () => {
  counter += 1
  let frameId = `printarea-${counter}`
  let iframeStyle = 'border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;'
  let iframe

  try {
    iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    iframe.id = frameId
    iframe.style = iframeStyle
    iframe.src = '#' + new Date().getTime()
    iframe.doc = null
    iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document)
  } catch (e) { throw e + '. iframes may not be supported in this browser.' }

  if (iframe.doc == null) throw 'Cannot find document.'

  return { win: iframe.contentWindow || iframe, doc: iframe.doc }
}

const getHead = () => {
  const links = [...document.getElementsByTagName('link')].filter(link => {
    return link.rel === 'stylesheet'
  }).map(link => {
    return `<link type="text/css" rel="stylesheet" href="${link.href}" >`
  })

  return `<head><title>${document.title}</title>${links.join('')}</head>`
}

const write = (PADocument, ele) => {
  PADocument.open()
  PADocument.write(`<html>${getHead()}<body>${ele.innerHTML}</body></html>`)
  PADocument.close()
}

export default (ele) => {
  const iframe = createIframe()
  write(iframe.doc, ele)

  iframe.win.onload = () => {
    setTimeout(() => {
      iframe.win.focus()
      iframe.win.print()
    }, 1000)
  }
}
