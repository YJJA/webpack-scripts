import isLength from 'validator/lib/isLength'

window.isLength = isLength

// 字符串升序较验（支持中文）
export const lengthValidate = (options, message) => (rule, value, callback) => {
  if (typeof value !== 'string') {
    return callback()
  }
  let min
  let max
  if (typeof (options) === 'object') {
    min = options.min || 0
    max = options.max
  } else { // backwards compatibility: isLength(str, min [, max])
    min = arguments[1]
    max = arguments[2]
  }
  const surrogatePairs = value.match(/[^\x00-\xff]/g) || [] /* eslint no-control-regex: "off" */
  const len = value.length + surrogatePairs.length

  if (len >= min && (typeof max === 'undefined' || len <= max)) {
    return callback()
  }
  callback(message)
}

// 动态匹配正则
export const regValidate = (reg, message) => (rule, value, callback) => {
  if (typeof value !== 'string') {
    return callback()
  }
  if (reg.test(value)) {
    callback()
  } else {
    callback(message)
  }
}
