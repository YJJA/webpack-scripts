
// mapData
export const mapData = (state, payload, id = 'id') => {
  const data = payload.data ? payload.data : payload
  const list = Array.isArray(data) ? data : (data.list || [])
  return list.reduce((result, item) => {
    result.byId[item[id]] = item
    result.allIds.push(item[id])
    return result
  }, {byId: {}, allIds: [], total: data.total})
}

export const updateDataOne = (state, data, id = 'id') => {
  const key = data[id]
  const item = state.byId[data[id]]
  const byId = {...state.byId, [key]: {...item, ...data}}
  const allIds = [...state.allIds]

  if (!~allIds.indexOf(data[id])) {
    allIds.push(data[id])
  }
  return {byId, allIds}
}

export const deleteData = (state, id) => {
  const ids = String(id).split(',')
  const allIds = state.allIds.filter(id => !~ids.indexOf(String(id)))

  return {
    allIds
  }
}

// 分类递归
/*
  parentField 父级ID字段名
  parentFieldValue 父级ID字段值
  sortFun 排序方法
*/
export const recursionCategory = ({
  allIds = [],
  byId = [],
  parentField = 'categoryPid',
  parentFieldValue = 0,
  sort,
  max = 0
} = {}, lv = 1) => {
  const result = allIds.reduce((result, id) => {
    const item = byId[id]
    if (item[parentField] === parentFieldValue) {
      if (!max || lv < max) {
        const children = recursionCategory({
          allIds,
          byId,
          parentField,
          parentFieldValue: id,
          sort,
          max
        }, lv + 1)
        if (children.length) {
          result.push({...item, children})
        } else {
          result.push(item)
        }
      } else {
        result.push(item)
      }
    }
    return result
  }, [])

  return typeof sort === 'function' ? result.sort(sort) : result
}

export const mapProvincesData = (state, data, id = 'id') => {
  const provincesList = state.provincesList
  data.list.map((item) => {
    provincesList.push({
      label: item.provinceName,
      value: item.countryId,
      children: []
    })
  })
}

// 资源递归
export const recursionList = (allIds, byId, parentField, parentFieldValue, sortFun) => {
  const result = allIds.reduce((result, id) => {
    const item = byId[id]
    if (item[parentField] === parentFieldValue) {
      const children = recursionList(allIds, byId, parentField, id, sortFun)
      if (children.length) {
        result.push({...item, children})
      } else {
        result.push(item)
      }
    }
    return result
  }, [])

  return typeof sortFun === 'function' ? result.sort(sortFun) : result
}
