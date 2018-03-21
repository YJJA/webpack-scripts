import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// 属性项 types
const ITEM_LOAD = 'mw/attributeItemValue/ITEM_LOAD'
const ITEM_LOAD_SUCCESS = 'mw/attributeItemValue/ITEM_LOAD_SUCCESS'
const ITEM_LOAD_FAILURE = 'mw/attributeItemValue/ITEM_LOAD_FAILURE'

const ITEM_INSERT = 'mw/attributeItemValue/ITEM_INSERT'
const ITEM_INSERT_SUCCESS = 'mw/attributeItemValue/ITEM_INSERT_SUCCESS'
const ITEM_INSERT_FAILURE = 'mw/attributeItemValue/IITEM_NSERT_FAILURE'

const ITEM_UPDATE = 'mw/attributeItemValue/ITEM_UPDATE'
const ITEM_UPDATE_SUCCESS = 'mw/attributeItemValue/ITEM_UPDATE_SUCCESS'
const ITEM_UPDATE_FAILURE = 'mw/attributeItemValue/ITEM_UPDATE_FAILURE'

const ITEM_DELETE = 'mw/attributeItemValue/ITEM_DELETE'
const ITEM_DELETE_SUCCESS = 'mw/attributeItemValue/ITEM_DELETE_SUCCESS'
const ITEM_DELETE_FAILURE = 'mw/attributeItemValue/ITEM_DELETE_FAILURE'

const STATUS = 'mw/attributeItemValue/STATUS'
const STATUS_SUCCESS = 'mw/attributeItemValue/STATUS_SUCCESS'
const STATUS_FAILURE = 'mw/attributeItemValue/STATUS_FAILURE'

// 属性值
const VALUE_LOAD = 'mw/attributeItemValue/VALUE_LOAD'
const VALUE_LOAD_SUCCESS = 'mw/attributeItemValue/VALUE_LOAD_SUCCESS'
const VALUE_LOAD_FAILURE = 'mw/attributeItemValue/VALUE_LOAD_FAILURE'

const VALUE_INSERT = 'mw/attributeItemValue/VALUE_INSERT'
const VALUE_INSERT_SUCCESS = 'mw/attributeItemValue/VALUE_INSERT_SUCCESS'
const VALUE_INSERT_FAILURE = 'mw/attributeItemValue/IVALUE_NSERT_FAILURE'

const VALUE_UPDATE = 'mw/attributeItemValue/VALUE_UPDATE'
const VALUE_UPDATE_SUCCESS = 'mw/attributeItemValue/VALUE_UPDATE_SUCCESS'
const VALUE_UPDATE_FAILURE = 'mw/attributeItemValue/VALUE_UPDATE_FAILURE'

const VALUE_DELETE = 'mw/attributeItemValue/VALUE_DELETE'
const VALUE_DELETE_SUCCESS = 'mw/attributeItemValue/VALUE_DELETE_SUCCESS'
const VALUE_DELETE_FAILURE = 'mw/attributeItemValue/VALUE_DELETE_FAILURE'

const UNIT_LOAD = 'mw/attributeItemValue/UNIT_LOAD'
const UNIT_SUCCESS = 'mw/attributeItemValue/UNIT_SUCCESS'
const UNIT_FAILURE = 'mw/attributeItemValue/UNIT_FAILURE'

const SET_LOAD = 'mw/attributeItemValue/SET_LOAD'
const SET_SUCCESS = 'mw/attributeItemValue/SET_SUCCESS'
const SET_FAILURE = 'mw/attributeItemValue/SET_FAILURE'

const initialState = {
  isFetching: false,
  attributeItem: {
    byId: {},
    allIds: [],
    isFetching: false
  },
  attributeValue: {
    byId: {},
    allIds: [],
    isFetching: false
  },
  unitList: [],
  error: null
}

// 获取单位列表
const getFetchUnitList = (state, payload, id = 'id') => {
  const list = payload.data || []
  console.log(list)
  state.unitList = list
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case UNIT_LOAD:
      return {
        ...state,
        isFetching: false,
        error: null
      }
    case ITEM_LOAD:
    case ITEM_INSERT:
    case ITEM_UPDATE:
    case ITEM_DELETE:
    case STATUS:
    case SET_LOAD:
      return {
        ...state,
        attributeItem: {...state.attributeItem, isFetching: true},
        error: null
      }

    case ITEM_LOAD_FAILURE:
    case ITEM_INSERT_FAILURE:
    case ITEM_UPDATE_FAILURE:
    case ITEM_DELETE_FAILURE:
    case STATUS_FAILURE:
    case SET_FAILURE:
      return {
        ...state,
        isFetching: false,
        attributeItem: {...state.attributeItem, isFetching: false},
        error: action.error
      }

    case ITEM_LOAD_SUCCESS:
      return {
        ...state,
        attributeItem: {...mapData(state.attributeItem, action.data, 'attrItemId'), isFetching: false}
      }

    case ITEM_INSERT_SUCCESS:
    case ITEM_UPDATE_SUCCESS:
      return {
        ...state,
        attributeItem: {...state.attributeItem, isFetching: false}
      }
    case STATUS_SUCCESS:
      return {
        ...state,
        attributeItem: {...state.attributeItem, isFetching: false},
        isFetching: false
      }
    case SET_SUCCESS:
      return {
        ...state,
        attributeItem: {...state.attributeItem, ...action.data, isFetching: false},
        isFetching: false
      }

    case ITEM_DELETE_SUCCESS:
      return {
        ...state,
        ...deleteData(state.attributeItem, action.id),
        isFetching: false
      }

    case VALUE_LOAD:
    case VALUE_INSERT:
    case VALUE_UPDATE:
    case VALUE_DELETE:
      return {
        ...state,
        attributeValue: {...state.attributeValue, isFetching: true},
        error: null
      }

    case VALUE_LOAD_FAILURE:
    case VALUE_INSERT_FAILURE:
    case VALUE_UPDATE_FAILURE:
    case VALUE_DELETE_FAILURE:
    case UNIT_FAILURE:
      return {
        ...state,
        isFetching: false,
        attributeValue: {...state.attributeValue, isFetching: false},
        error: action.error
      }

    case VALUE_LOAD_SUCCESS:
      return {
        ...state,
        attributeValue: {...mapData(state.attributeValue, action.data, 'attrId'), isFetching: false}
      }

    case VALUE_INSERT_SUCCESS:
    case VALUE_UPDATE_SUCCESS:
      return {
        ...state,
        attributeValue: {...state.attributeValue, isFetching: false}
      }

    case VALUE_DELETE_SUCCESS:
      return {
        ...state,
        attributeValue: {...state.attributeValue, isFetching: false},
        isFetching: false
      }
    // case VALUE_BDELETE_SUCCESS:
    //   return {
    //     ...state,
    //     ...deleteData(state.attributeValue, action.id),
    //     isFetching: false
    //   }

    case UNIT_SUCCESS:
      return {
        ...state,
        ...getFetchUnitList(state, action.data),
        isFetching: false
      }
    default:
      return state
  }
}

// actions
export const fetchAttributeItem = query => dispatch => {
  console.log('i am in fetchAttributeItem function **************')
  console.log(query)
  dispatch({type: ITEM_LOAD})
  return request
    .get('/manufactory/attributeItem')
    .query(query)
    .then(data => dispatch({type: ITEM_LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: ITEM_LOAD_FAILURE, error})
      throw error
    })
}

export const insertAttributeItem = body => dispatch => {
  dispatch({type: ITEM_INSERT})
  return request
    .post('/manufactory/attributeItem')
    .send(body)
    .then(data => {
      dispatch({type: ITEM_INSERT_SUCCESS, data})
    })
    .catch(error => {
      dispatch({type: ITEM_INSERT_FAILURE, error})
      throw error
    })
}

export const updateAttributeItem = (id, body) => dispatch => {
  dispatch({type: ITEM_UPDATE})
  return request
    .put(`/manufactory/attributeItem/${id}`)
    .send(body)
    .then(data => dispatch({type: ITEM_UPDATE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: ITEM_UPDATE_FAILURE, error})
      throw error
    })
}

export const deleteAttributeItem = id => dispatch => {
  dispatch({type: ITEM_DELETE})
  return request
    .del(`/manufactory/attributeItem/${id}`)
    .then(data => dispatch({type: ITEM_DELETE_SUCCESS, id, data}))
    .catch(error => {
      dispatch({type: ITEM_DELETE_FAILURE, error})
      throw error
    })
}
// 启用或停用属性项
export const setAttrItemEnable = (id, status) => dispatch => {
  dispatch({type: STATUS})
  return request
    .put(`/manufactory/attributeItem/isEnable/${id}/${status}`)
    .then(data => dispatch({type: STATUS_SUCCESS, id, data}))
    .catch(error => {
      dispatch({type: STATUS_FAILURE, error})
      throw error
    })
}

// ******************** 属性值actions *********************//

export const fetchAttributeValue = query => dispatch => {
  dispatch({type: VALUE_LOAD})
  return request
    .get('/manufactory/backAttribute')
    .query(query)
    .then(data => dispatch({type: VALUE_LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: VALUE_LOAD_FAILURE, error})
      throw error
    })
}

export const insertAttributeValue = body => dispatch => {
  dispatch({type: VALUE_INSERT})
  return request
    .post('/manufactory/backAttribute')
    .send(body)
    .then(data => dispatch({type: VALUE_INSERT_SUCCESS, data}))
    .catch(error => {
      dispatch({type: VALUE_INSERT_FAILURE, error})
      throw error
    })
}

export const updateAttributeValue = (id, body) => dispatch => {
  dispatch({type: VALUE_UPDATE})
  return request
    .put(`/manufactory/backAttribute/${id}`)
    .send(body)
    .then(data => dispatch({type: VALUE_UPDATE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: VALUE_UPDATE_FAILURE, error})
      throw error
    })
}

export const deleteAttributeValue = (attrItemId, attrId) => dispatch => {
  dispatch({type: VALUE_DELETE})
  return request
    .del(`/manufactory/backAttribute/${attrItemId}/${attrId}`)
    .then(data => dispatch({type: VALUE_DELETE_SUCCESS, attrId, data}))
    .catch(error => {
      dispatch({type: VALUE_DELETE_FAILURE, error})
      throw error
    })
}

export const batchDeleteAttributeValue = (ids, list) => dispatch => {
  dispatch({type: VALUE_DELETE})
  return request
    .del(`/manufactory/backAttribute/deleteBackAttrList`)
    .send({list})
    .then(data => dispatch({type: VALUE_DELETE_SUCCESS, ids, data}))
    .catch(error => {
      dispatch({type: VALUE_DELETE_FAILURE, error})
      throw error
    })
}

export const fetchUnit = query => dispatch => {
  dispatch({type: UNIT_LOAD})
  return request
    .get('/manufactory/dataType/UNIT/datas')
    .query(query)
    .then(data => dispatch({type: UNIT_SUCCESS, data}))
    .catch(error => {
      dispatch({type: UNIT_FAILURE, error})
      throw error
    })
}

export const setAttributeItem = data => dispatch => {
  dispatch({type: SET_LOAD})
  return (
    dispatch({type: SET_SUCCESS, data})
  )
}
