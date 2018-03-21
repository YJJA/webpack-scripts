import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD = 'mw/attrGroupItem/LOAD'
const LOAD_SUCCESS = 'mw/attrGroupItem/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/attrGroupItem/LOAD_FAILURE'

const INSERT = 'mw/attrGroupItem/INSERT'
const INSERT_SUCCESS = 'mw/attrGroupItem/INSERT_SUCCESS'
const INSERT_FAILURE = 'mw/attrGroupItem/INSERT_FAILURE'

const UPDATE = 'mw/attrGroupItem/UPDATE'
const UPDATE_SUCCESS = 'mw/attrGroupItem/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'mw/attrGroupItem/UPDATE_FAILURE'

const DELETE = 'mw/attrGroupItem/DELETE'
const DELETE_SUCCESS = 'mw/attrGroupItem/DELETE_SUCCESS'
const DELETE_FAILURE = 'mw/attrGroupItem/DELETE_FAILURE'

const UNIT_LOAD = 'mw/attrGroupItem/UNIT_LOAD'
const UNIT_SUCCESS = 'mw/attrGroupItem/UNIT_SUCCESS'
const UNIT_FAILURE = 'mw/attrGroupItem/UNIT_FAILURE'

const ATTRITEM_LOAD = 'mw/attrGroupItem/ATTRITEM_LOAD'
const ATTRITEM_SUCCESS = 'mw/attrGroupItem/ATTRITEM_SUCCESS'
const ATTRITEM_FAILURE = 'mw/attrGroupItem/ATTRITEM_FAILURE'

const initialState = {
  isFetching: false,
  byId: {},
  allIds: [],
  error: null,
  unitList: [],
  attrItemList: []
}
// 获取单位列表
const fetchUnitList = (state, payload, id = 'id') => {
  const list = payload.data || []
  console.log(list)
  state.unitList = list
}
// 获取所有属性项列表
const fetchIndustriesProperties = (state, payload, id = 'id') => {
  const list = payload.data.list || []
  console.log(list)
  state.attrItemList = list
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case INSERT:
    case UPDATE:
    case DELETE:
    case UNIT_LOAD:
    case ATTRITEM_LOAD:
      return {...state, isFetching: true, error: null}

    case LOAD_FAILURE:
    case INSERT_FAILURE:
    case UPDATE_FAILURE:
    case DELETE_FAILURE:
    case UNIT_FAILURE:
    case ATTRITEM_FAILURE:
      return {...state, isFetching: false, error: action.error}

    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.data, 'groupItemId'),
        isFetching: false
      }
    case UNIT_SUCCESS:
      return {
        ...state,
        ...fetchUnitList(state, action.data),
        isFetching: false
      }
    case ATTRITEM_SUCCESS:
      return {
        ...state,
        ...fetchIndustriesProperties(state, action.data),
        isFetching: false
      }

    case INSERT_SUCCESS:
    case UPDATE_SUCCESS:
      return {
        ...state,
        ...updateDataOne(state, action.data, 'groupItemId'),
        isFetching: false
      }

    case DELETE_SUCCESS:
      return {
        ...state,
        ...deleteData(state, action.id),
        isFetching: false
      }

    default:
      return state
  }
}

// actions
export const fetchAttrGroupItem = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/attributeItem/getItemByGroup')
    .query(query)
    .then(data => dispatch({type: LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

export const insertAttrGroupItem = (attrGroupId, attrItemId, body) => dispatch => {
  dispatch({type: INSERT})
  return request
    .post(`/manufactory/attributeItem/${attrGroupId}/${attrItemId}`)
    .send(body)
    .then(data => dispatch({type: INSERT_SUCCESS, data}))
    .catch(error => {
      dispatch({type: INSERT_FAILURE, error})
      throw error
    })
}

export const updateAttrGroupItem = (body) => dispatch => {
  dispatch({type: UPDATE})
  return request
    .put(`/manufactory/attributeItem/editItemByGroup`)
    .send(body)
    .then(data => dispatch({type: UPDATE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: UPDATE_FAILURE, error})
      throw error
    })
}

export const deleteAttrGroupItem = (attrGroupId, attrItemId) => dispatch => {
  dispatch({type: DELETE})
  return request
    .del(`/manufactory/attributeItem/${attrGroupId}/${attrItemId}`)
    .then(data => dispatch({type: DELETE_SUCCESS, attrItemId, data}))
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
// 获取属性项
export const fetchAttrItemList = query => dispatch => {
  dispatch({type: ATTRITEM_LOAD})
  return request
    .get('/manufactory/attributeItem')
    .query(query)
    .then(data => dispatch({type: ATTRITEM_SUCCESS, data}))
    .catch(error => {
      dispatch({type: ATTRITEM_FAILURE, error})
      throw error
    })
}
