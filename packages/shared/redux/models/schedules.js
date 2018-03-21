import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD_REQUEST = 'mw/schedules/LOAD_REQUEST'
const LOAD_SUCCESS = 'mw/schedules/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/schedules/LOAD_FAILURE'

const DETAIL_REQUEST = 'mw/schedules/DETAIL_REQUEST'
const DETAIL_SUCCESS = 'mw/schedules/DETAIL_SUCCESS'

const initialState = {
  isFetching: false,
  error: null,
  selectedData: []
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REQUEST:
    case DETAIL_REQUEST:
      return {...state, isFetching: true, error: null}
    case LOAD_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isFetching: false
      }
    case DETAIL_SUCCESS:
      action.data ? state.selectedData = action.data : state.selectedData = []
      return {
        ...state,
        isFetching: false
      }
    case LOAD_FAILURE:
      return {...state, isFetching: false, error: action.error}
    default:
      return state
  }
}

// action
export const featchSchdules = query => dispatch => {
  dispatch({type: LOAD_REQUEST})
  return request
    .get('/ecback/equipment/everyDay')
    .query(query)
    .then(payload => dispatch({type: LOAD_SUCCESS, payload}))
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

export const featchSchdulesDetail = data => dispatch => {
  dispatch({type: DETAIL_REQUEST})
  return dispatch({type: DETAIL_SUCCESS, data})
}
