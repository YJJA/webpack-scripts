import request from '../../server/request'

const LOAD = 'mw/menus/LOAD'
const LOAD_SUCCESS = 'mw/menus/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/menus/LOAD_FAILURE'

let initialState = {
  isFetching: false,
  data: [],
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return {...state, isFetching: true}

    case LOAD_SUCCESS:
      return {...state, isFetching: false, data: action.payload.data}

    case LOAD_FAILURE:
      return {...state, isFetching: false, error: action.payload}

    default:
      return state
  }
}

// actions
export const fetchMenus = (service) => dispatch => {
  dispatch({type: LOAD})
  return request
    .get(`/manufactory/service/${service}/menus`)
    .then(payload => dispatch({type: LOAD_SUCCESS, service, payload}))
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}
