import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD = 'mw/constraints/LOAD'
const LOAD_SUCCESS = 'mw/constraints/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/constraints/LOAD_FAILURE'

const LOAD_ONE = 'mw/constraints/LOAD_ONE'
const LOAD_ONE_SUCCESS = 'mw/constraints/LOAD_ONE_SUCCESS'
const LOAD_ONE_FAILURE = 'mw/constraints/LOAD_ONE_FAILURE'

const INSERT = 'mw/constraints/INSERT'
const INSERT_SUCCESS = 'mw/constraints/INSERT_SUCCESS'
const INSERT_FAILURE = 'mw/constraints/INSERT_FAILURE'

const UPDATE = 'mw/constraints/UPDATE'
const UPDATE_SUCCESS = 'mw/constraints/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'mw/constraints/UPDATE_FAILURE'

const DELETE = 'mw/constraints/DELETE'
const DELETE_SUCCESS = 'mw/constraints/DELETE_SUCCESS'
const DELETE_FAILURE = 'mw/constraints/DELETE_FAILURE'

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
      return {...state, isFetching: true, error: null}

    case LOAD_FAILURE:
    case INSERT_FAILURE:
    case UPDATE_FAILURE:
    case DELETE_FAILURE:
      return {...state, isFetching: false, error: action.error}

    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.data),
        isFetching: false
      }

    case INSERT_SUCCESS:
    case UPDATE_SUCCESS:
      return {
        ...state,
        ...updateDataOne(state, action.data),
        isFetching: false
      }

    case DELETE_SUCCESS:
      return {
        ...state,
        ...deleteData(state, action.constraintId),
        isFetching: false
      }

    default:
      return state
  }
}

// actions
export const fetchConstraints = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/constraint')
    .query(query)
    .then(data => dispatch({type: LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

export const fetchConstraintsOne = (constraintId) => dispatch => {
  dispatch({type: LOAD_ONE})
  return request
    .get(`/ecback/constraint/${constraintId}`)
    .then(data => dispatch({type: LOAD_ONE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: LOAD_ONE_FAILURE, error})
      throw error
    })
}

export const insertConstraints = body => dispatch => {
  dispatch({type: INSERT})
  return request
    .post('/ecback/constraint')
    .send(body)
    .then(data => dispatch({type: INSERT_SUCCESS, data}))
    .catch(error => {
      dispatch({type: INSERT_FAILURE, error})
      throw error
    })
}

export const updateConstraints = (constraintId, body) => dispatch => {
  dispatch({type: UPDATE})
  return request
    .put(`/ecback/constraint/${constraintId}`)
    .send(body)
    .then(data => dispatch({type: UPDATE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: UPDATE_FAILURE, error})
      throw error
    })
}

export const deleteConstraints = constraintId => dispatch => {
  dispatch({type: DELETE})
  return request
    .del(`/ecback/constraint/${constraintId}`)
    .then(data => dispatch({type: DELETE_SUCCESS, constraintId, data}))
    .catch(error => {
      dispatch({type: DELETE_FAILURE, error})
      throw error
    })
}
