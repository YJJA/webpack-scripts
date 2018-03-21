import request from '../../server/request'
import {mapData} from '../../lib/helpers'

// action type
const LOAD_REQUEST = 'mw/schedulesDetail/LOAD_REQUEST'
const LOAD_SUCCESS = 'mw/schedulesDetail/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/schedulesDetail/LOAD_FAILURE'

const initialState = {
  isFetching: false,
  error: null,
  byId: {},
  allIds: []
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REQUEST:
      return { ...state, isFetching: true, error: null }
    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.payload.data),
        isFetching: false
      }
    case LOAD_FAILURE:
      return { ...state, isFetching: false, error: action.payload }
    default:
      return state
  }
}

// action
export const featchSchedulesDetail = query => dispatch => {
  dispatch({ type: LOAD_REQUEST })
  return request
    .get('/ecback/equipment/arrange')
    .query(query)
    .then(payload => dispatch({ type: LOAD_SUCCESS, payload }))
    .catch(payload => {
      dispatch({ type: LOAD_FAILURE, payload })
      throw payload
    })
}
