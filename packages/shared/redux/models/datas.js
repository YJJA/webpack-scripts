import request from '../../server/request'

const LOAD = 'mw/datas/LOAD'
const LOAD_SUCCESS = 'mw/datas/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/datas/LOAD_FAILURE'

const LOAD_ONE = 'mw/datas/LOAD_ONE'
const LOAD_ONE_SUCCESS = 'mw/datas/LOAD_ONE_SUCCESS'
const LOAD_ONE_FAILURE = 'mw/datas/LOAD_ONE_FAILURE'

let initialState = {
  isFetching: false,
  data: [],
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case LOAD_ONE:
      return {...state, isFetching: true}

    case LOAD_SUCCESS:
      return {...state, isFetching: false, data: action.payload.data}

    case LOAD_ONE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          [action.dataType]: action.payload.data
        }
      }

    case LOAD_FAILURE:
    case LOAD_ONE_FAILURE:
      return {...state, isFetching: false, error: action.payload}

    default:
      return state
  }
}

// actions
// 获取所有字典
export const fetchDatas = () => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/datas')
    .then(data => dispatch({type: LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

// 获取单个类型字典
export const fetchDatasByType = (dataType) => dispatch => {
  dispatch({type: LOAD_ONE})
  return request
    .get(`/manufactory/dataType/${dataType}/datas`)
    .then(payload => dispatch({type: LOAD_ONE_SUCCESS, dataType, payload}))
    .catch(payload => {
      dispatch({type: LOAD_ONE_FAILURE, payload})
      throw payload
    })
}
