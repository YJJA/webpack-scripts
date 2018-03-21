import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD = 'mw/attrGroup/LOAD'
const LOAD_SUCCESS = 'mw/attrGroup/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/attrGroup/LOAD_FAILURE'

const INSERT = 'mw/attrGroup/INSERT'
const INSERT_SUCCESS = 'mw/attrGroup/INSERT_SUCCESS'
const INSERT_FAILURE = 'mw/attrGroup/INSERT_FAILURE'

const UPDATE = 'mw/attrGroup/UPDATE'
const UPDATE_SUCCESS = 'mw/attrGroup/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'mw/attrGroup/UPDATE_FAILURE'

const DELETE = 'mw/attrGroup/DELETE'
const DELETE_SUCCESS = 'mw/attrGroup/DELETE_SUCCESS'
const DELETE_FAILURE = 'mw/attrGroup/DELETE_FAILURE'

const STATUS = 'mw/attrGroup/STATUS'
const STATUS_SUCCESS = 'mw/attrGroup/STATUS_SUCCESS'
const STATUS_FAILURE = 'mw/attrGroup/STATUS_FAILURE'

const initialState = {
  isFetching: false,
  byId: {},
  allIds: [],
  error: null
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case INSERT:
    case UPDATE:
    case DELETE:
    case STATUS:
      return {...state, isFetching: true, error: null}

    case LOAD_FAILURE:
    case INSERT_FAILURE:
    case UPDATE_FAILURE:
    case DELETE_FAILURE:
    case STATUS_FAILURE:
      return {...state, isFetching: false, error: action.error}

    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.data, 'attrGroupId'),
        isFetching: false
      }

    case INSERT_SUCCESS:
    case UPDATE_SUCCESS:
    case STATUS_SUCCESS:
      return {
        ...state,
        ...updateDataOne(state, action.data, 'attrGroupId'),
        isFetching: false
      }

    case DELETE_SUCCESS:
      return {
        ...state,
        ...deleteData(state, action.propertId, 'attrGroupId'),
        isFetching: false
      }

    default:
      return state
  }
}

// actions
export const fetchAttrGroup = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/attributeGroup')
    .query(query)
    .then(data => dispatch({type: LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

export const insertAttrGroup = body => dispatch => {
  dispatch({type: INSERT})
  return request
    .post('/manufactory/attributeGroup')
    .send(body)
    .then(data => dispatch({type: INSERT_SUCCESS, data}))
    .catch(error => {
      dispatch({type: INSERT_FAILURE, error})
      throw error
    })
}

export const updateAttrGroup = (body) => dispatch => {
  dispatch({type: UPDATE})
  return request
    .put(`/manufactory/attributeGroup`)
    .send(body)
    .then(data => dispatch({type: UPDATE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: UPDATE_FAILURE, error})
      throw error
    })
}

export const deleteAttrGroup = (attrGroupId) => dispatch => {
  dispatch({type: DELETE})
  return request
    .del(`/manufactory/attributeGroup/${attrGroupId}`)
    .then(data => dispatch({type: DELETE_SUCCESS, attrGroupId, data}))
    .catch(error => {
      dispatch({type: DELETE_FAILURE, error})
      throw error
    })
}

// 启用或停用属性项
export const setAttrGroupEnable = (id, status) => dispatch => {
  dispatch({type: STATUS})
  return request
    .put(`/manufactory/attributeGroup/isEnable/${id}/${status}`)
    .then(data => dispatch({type: STATUS_SUCCESS, id, data}))
    .catch(error => {
      dispatch({type: STATUS_FAILURE, error})
      throw error
    })
}
