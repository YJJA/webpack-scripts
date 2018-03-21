// 获取图片高宽
export function getImageSize (url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    if (img.complete) {
      resolve({width: img.width, height: img.height})
    } else {
      img.onload = function() {
        resolve({width: img.width, height: img.height})
      }
      img.onerror = function(e) {
        reject(e)
      }
    }
  })
}
