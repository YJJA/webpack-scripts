import request from '../../server/request'
import {USER_INFO_CHANGE} from './user'

// action types
const LOAD = 'mw/user/LOAD'
const LOAD_SUCCESS = 'mw/user/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/user/LOAD_FAILURE'

const INSERT = 'mw/user/INSERT'
const INSERT_SUCCESS = 'mw/user/INSERT_SUCCESS'
const INSERT_FAILURE = 'mw/user/INSERT_FAILURE'

const UPDATE = 'mw/user/UPDATE'
const UPDATE_SUCCESS = 'mw/user/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'mw/user/UPDATE_FAILURE'

const SAVE_SUCCESS = 'mw/user/SAVE_SUCCESS'

const CLEAR_INFO = 'mobile/user/CLEAR_INFO'

const initialState = {
  isFetching: false,
  information: {},
  error: null
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case INSERT:
    case UPDATE:
      return {...state, isFetching: true, error: null}

    case LOAD_FAILURE:
    case INSERT_FAILURE:
    case UPDATE_FAILURE:
      return {...state, isFetching: false, error: action.error}

    case LOAD_SUCCESS:
      return {
        ...state,
        information: action.data.data,
        isFetching: false
      }
    case INSERT_SUCCESS:
    case UPDATE_SUCCESS:
      return {
        ...state,
        isFetching: false
      }
    case SAVE_SUCCESS:
      return {...state, isFetching: true, error: null}
    case CLEAR_INFO:
      return {...state, isFetching: false, information: {}}
    default:
      return state
  }
}

// actions
export const fetchInformation = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/front/user/acctInfo')
    .then(data => {
      // 更新本地用户信息
      dispatch({
        type: USER_INFO_CHANGE,
        payload: {
          acctIcon: data.data.acctIcon
        }
      })
      return dispatch({type: LOAD_SUCCESS, data})
    })
    .catch(error => {
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

// 保存账户修改
export const modifyAcctIcon = body => dispatch => {
  return request
    .post('/front/user/modifyAcctIcon')
    .send(body)
    .then(data => dispatch({type: SAVE_SUCCESS}))
    .catch(error => {
      throw error
    })
}

// 文件上传
export const uploadFile = '/manufactory/uploadFile'

export const putPassword = (body) => dispatch => {
  return request
    .post('/front/user/changePassword')
    .send(body)
    .then(data => dispatch({type: UPDATE_SUCCESS}))
    .catch(error => {
      throw error
    })
}

// 退出
export const clearInfo = body => dispatch => {
  dispatch({type: CLEAR_INFO})
}
