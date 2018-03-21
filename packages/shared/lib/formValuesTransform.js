import {Form} from 'antd'

// 表单提交值转换
export function transformValues(values, transform) {
  return Object.keys(transform).reduce((result, key) => {
    const transfer = transform[key]
    if (typeof transfer === 'function') {
      result[key] = transfer(values[key], values)
    } else {
      result[key] = transfer
    }
    return result
  }, values)
}

// 初始化表单字段
export function transformInitialValues(initialValues, transform = {}, append) {
  if (typeof initialValues !== 'object') {
    return {}
  }

  // 现有字段转换
  const result = Object.keys(initialValues).reduce((result, key) => {
    const value = initialValues[key]
    const transfer = transform[key]
    let nextValue = null
    if (typeof transfer === 'function' && typeof value !== 'undefined' && value !== null) {
      nextValue = {value: transfer(value, initialValues)}
    } else if (typeof transfer !== 'undefined' && typeof transfer !== 'function') {
      nextValue = {value: transfer}
    } else if (value !== null) {
      nextValue = {value}
    }
    result[key] = Form.createFormField(nextValue)
    return result
  }, {})

  if (typeof append !== 'object') {
    return result
  }

  // 新增字段添加
  return Object.keys(append).reduce((result, key) => {
    const appender = append[key]
    result[key] = Form.createFormField({
      value: typeof appender === 'function' ? appender(initialValues) : appender
    })
    return result
  }, result)
}
