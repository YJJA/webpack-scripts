import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD = 'mw/attributeValue/LOAD'
const LOAD_SUCCESS = 'mw/attributeValue/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/attributeValue/LOAD_FAILURE'

const INSERT = 'mw/attributeValue/INSERT'
const INSERT_SUCCESS = 'mw/attributeValue/INSERT_SUCCESS'
const INSERT_FAILURE = 'mw/attributeValue/INSERT_FAILURE'

const UPDATE = 'mw/attributeValue/UPDATE'
const UPDATE_SUCCESS = 'mw/attributeValue/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'mw/attributeValue/UPDATE_FAILURE'

const DELETE = 'mw/attributeValue/DELETE'
const DELETE_SUCCESS = 'mw/attributeValue/DELETE_SUCCESS'
const DELETE_FAILURE = 'mw/attributeValue/DELETE_FAILURE'

const UNIT_LOAD = 'mw/attributeValue/UNIT_LOAD'
const UNIT_SUCCESS = 'mw/attributeValue/UNIT_SUCCESS'
const UNIT_FAILURE = 'mw/attributeValue/UNIT_FAILURE'

const initialState = {
  isFetching: false,
  byId: {},
  allIds: [],
  error: null,
  unitList: []
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
    case LOAD:
    case INSERT:
    case UPDATE:
    case DELETE:
    case UNIT_LOAD:
      return {...state, isFetching: true, error: null}

    case LOAD_FAILURE:
    case INSERT_FAILURE:
    case UPDATE_FAILURE:
    case DELETE_FAILURE:
    case UNIT_FAILURE:
      return {...state, isFetching: false, error: action.error}

    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.data, 'attrId'),
        isFetching: false
      }
    case UNIT_SUCCESS:
      return {
        ...state,
        ...getFetchUnitList(state, action.data),
        isFetching: false
      }

    case INSERT_SUCCESS:
    case UPDATE_SUCCESS:
      return {
        ...state,
        ...updateDataOne(state, action.data, 'attrId'),
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
export const fetchAttributeValue = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/backAttribute')
    .query(query)
    .then(data => dispatch({type: LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

export const insertAttributeValue = body => dispatch => {
  dispatch({type: INSERT})
  return request
    .post('/manufactory/backAttribute')
    .send(body)
    .then(data => dispatch({type: INSERT_SUCCESS, data}))
    .catch(error => {
      dispatch({type: INSERT_FAILURE, error})
      throw error
    })
}

export const updateAttributeValue = (id, body) => dispatch => {
  dispatch({type: UPDATE})
  return request
    .put(`/manufactory/backAttribute/${id}`)
    .send(body)
    .then(data => dispatch({type: UPDATE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: UPDATE_FAILURE, error})
      throw error
    })
}

export const deleteAttributeValue = (attrItemId, attrId) => dispatch => {
  dispatch({type: DELETE})
  return request
    .del(`/manufactory/backAttribute/${attrItemId}/${attrId}`)
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
