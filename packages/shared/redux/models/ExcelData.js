import request from '../../server/request'

// action type
const IMPORT_REQUEST = 'mw/materials/IMPORT_REQUEST'
const IMPORT_SUCCESS = 'mw/materials/IMPORT_SUCCESS'
const IMPORT_FAILURE = 'mw/materials/IMPORT_FAILURE'

const initialState = {
  isFetching: false,
  error: null
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_REQUEST:
      return { ...state, isFetching: true, error: null }
    case IMPORT_SUCCESS:
      return { ...state, isFetching: false, error: null }
    case IMPORT_FAILURE:
      return { ...state, isFetching: false, error: action.error }
    default:
      return state
  }
}

export const fetchImport = body => dispatch => {
  dispatch({ type: IMPORT_REQUEST })
  return request
    .post(`/ecback/excel/import`)
    .send(body)
    .then(payload => dispatch({type: IMPORT_SUCCESS, payload}))
    .catch(payload => {
      dispatch({type: IMPORT_FAILURE, payload})
      throw payload
    })
}
