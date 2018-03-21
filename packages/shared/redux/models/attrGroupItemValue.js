import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD = 'mw/attrGroupItemValue/LOAD'
const LOAD_SUCCESS = 'mw/attrGroupItemValue/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/attrGroupItemValue/LOAD_FAILURE'

const INSERT = 'mw/attrGroupItemValue/INSERT'
const INSERT_SUCCESS = 'mw/attrGroupItemValue/INSERT_SUCCESS'
const INSERT_FAILURE = 'mw/attrGroupItemValue/INSERT_FAILURE'

const UPDATE = 'mw/attrGroupItemValue/UPDATE'
const UPDATE_SUCCESS = 'mw/attrGroupItemValue/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'mw/attrGroupItemValue/UPDATE_FAILURE'

const DELETE = 'mw/attrGroupItemValue/DELETE'
const DELETE_SUCCESS = 'mw/attrGroupItemValue/DELETE_SUCCESS'
const DELETE_FAILURE = 'mw/attrGroupItemValue/DELETE_FAILURE'

const UNIT_LOAD = 'mw/attrGroupItemValue/UNIT_LOAD'
const UNIT_SUCCESS = 'mw/attrGroupItemValue/UNIT_SUCCESS'
const UNIT_FAILURE = 'mw/attrGroupItemValue/UNIT_FAILURE'

const ATTRVALUE_LOAD = 'mw/attrGroupItemValue/ATTRVALUE_LOAD'
const ATTRVALUE_SUCCESS = 'mw/attrGroupItemValue/ATTRVALUE_SUCCESS'
const ATTRVALUE_FAILURE = 'mw/attrGroupItemValue/ATTRVALUE_FAILURE'

const BATCH_DELETE_LOAD = 'mw/attrGroupItemValue/BATCH_DELETE_LOAD'
const BATCH_DELETE_SUCCESS = 'mw/attrGroupItemValue/BATCH_DELETE_SUCCESS'
const BATCH_DELETE_FAILURE = 'mw/attrGroupItemValue/BATCH_DELETE_FAILURE'

const initialState = {
  isFetching: false,
  byId: {},
  allIds: [],
  error: null,
  unitList: [],
  attrItemValueList: []
}
// 获取单位列表
const fetchUnitList = (state, payload, id = 'id') => {
  const list = payload.data || []
  console.log(list)
  state.unitList = list
}
// 获取所有属性值列表
const fetchAttrItemValueList = (state, payload, id = 'id') => {
  const list = payload.data.list || []
  console.log(list)
  state.attrItemValueList = list
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case INSERT:
    case UPDATE:
    case DELETE:
    case UNIT_LOAD:
    case ATTRVALUE_LOAD:
    case BATCH_DELETE_LOAD:
      return {...state, isFetching: true, error: null}

    case LOAD_FAILURE:
    case INSERT_FAILURE:
    case UPDATE_FAILURE:
    case DELETE_FAILURE:
    case UNIT_FAILURE:
    case ATTRVALUE_FAILURE:
    case BATCH_DELETE_FAILURE:
      return {...state, isFetching: false, error: action.error}

    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.data, 'valueGroupItemId'),
        isFetching: false
      }
    case UNIT_SUCCESS:
      return {
        ...state,
        ...fetchUnitList(state, action.data),
        isFetching: false
      }
    case ATTRVALUE_SUCCESS:
      return {
        ...state,
        ...fetchAttrItemValueList(state, action.data),
        isFetching: false
      }

    case INSERT_SUCCESS:
    case UPDATE_SUCCESS:
      return {
        ...state,
        ...updateDataOne(state, action.data, 'valueGroupItemId'),
        isFetching: false
      }

    case DELETE_SUCCESS:
      return {
        ...state,
        ...deleteData(state, action.id),
        isFetching: false
      }
    case BATCH_DELETE_SUCCESS:
      return {
        ...state,
        // ...deleteData(state, action.id),
        isFetching: false
      }

    default:
      return state
  }
}

// actions
export const fetchAttrGroupItemValue = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/backAttribute/getValueByGroupItem')
    .query(query)
    .then(data => dispatch({type: LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

export const insertAttrGroupItemValue = body => dispatch => {
  dispatch({type: INSERT})
  return request
    .post('/manufactory/backAttribute/addAttrByGroup')
    .send(body)
    .then(data => dispatch({type: INSERT_SUCCESS, data}))
    .catch(error => {
      dispatch({type: INSERT_FAILURE, error})
      throw error
    })
}

export const updateAttrGroupItemValue = (id, body) => dispatch => {
  dispatch({type: UPDATE})
  return request
    .put(`/manufactory/attributeItem/editValueByGroup`)
    .send(body)
    .then(data => dispatch({type: UPDATE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: UPDATE_FAILURE, error})
      throw error
    })
}

export const deleteAttrGroupItemValue = (attrGroupId, attrItemId, attrId) => dispatch => {
  dispatch({type: DELETE})
  return request
    .del(`/manufactory/backAttribute/deleteValueByGroup/${attrId}`)
    .then(data => dispatch({type: DELETE_SUCCESS, attrId, data}))
    .catch(error => {
      dispatch({type: DELETE_FAILURE, error})
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
// 获取属性值列表
export const fetchAttrValueList = query => dispatch => {
  dispatch({type: ATTRVALUE_LOAD})
  return request
    .get('/manufactory/backAttribute')
    .query(query)
    .then(data => dispatch({type: ATTRVALUE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: ATTRVALUE_FAILURE, error})
      throw error
    })
}
// 批量删除属性组中属性值
export const batchDeleteAttrGroupItemValue = (ids, list) => dispatch => {
  dispatch({type: BATCH_DELETE_LOAD})
  return request
    .del(`/manufactory/backAttribute/deleteListByGroup`)
    .send({grouplist: list})
    .then(data => dispatch({type: BATCH_DELETE_SUCCESS, ids, data}))
    .catch(error => {
      dispatch({type: BATCH_DELETE_FAILURE, error})
      throw error
    })
}
