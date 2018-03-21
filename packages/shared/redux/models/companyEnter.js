import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD = 'mw/companyEnter/LOAD'
const LOAD_SUCCESS = 'mw/companyEnter/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/companyEnter/LOAD_FAILURE'

const DETAIL_LOAD = 'mw/companyEnter/DETAIL_LOAD'
const DETAIL_LOAD_SUCCESS = 'mw/companyEnter/DETAIL_LOAD_SUCCESS'
const DETAIL_LOAD_FAILURE = 'mw/companyEnter/DETAIL_LOAD_FAILURE'

const STATUS = 'mw/companyEnter/STATUS'
const STATUS_SUCCESS = 'mw/companyEnter/STATUS_SUCCESS'
const STATUS_FAILURE = 'mw/companyEnter/STATUS_FAILURE'

const MESSAGE = 'mw/companyEnter/MESSAGE'
const MESSAGE_SUCCESS = 'mw/companyEnter/MESSAGE_SUCCESS'
const MESSAGE_FAILURE = 'mw/companyEnter/MESSAGE_FAILURE'

const UPDATE_DETAIL = 'mw/companyEnter/UPDATE_DETAIL'
const UPDATE_DETAIL_SUCCESS = 'mw/companyEnter/UPDATE_DETAIL_SUCCESS'
const UPDATE_DETAIL_FAILURE = 'mw/companyEnter/UPDATE_DETAIL_FAILURE'

const initialState = {
  isFetching: false,
  byId: {},
  allIds: [],
  error: null,
  companyEnterDetail: {}
}
// 获取公司入驻详情
const fetchDetail = (state, payload, id = 'id') => {
  const detail = payload.data || []
  console.log(detail)
  state.companyEnterDetail = detail
}
const sendMes = (state, payload) => {
  console.log(payload)
}
// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case DETAIL_LOAD:
    case STATUS:
    case UPDATE_DETAIL:
      return {...state, isFetching: true, error: null}

    case MESSAGE:
      return {...state, isFetching: false, error: action.error}
    case LOAD_FAILURE:
    case DETAIL_LOAD_FAILURE:
    case STATUS_FAILURE:
    case MESSAGE_FAILURE:
    case UPDATE_DETAIL_FAILURE:
      return {...state, isFetching: false, error: action.error}

    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.data, 'id'),
        isFetching: false
      }

    case DETAIL_LOAD_SUCCESS:
      return {
        ...state,
        ...fetchDetail(state, action.data),
        isFetching: false
      }

    case STATUS_SUCCESS:
      return {
        ...state,
        ...updateDataOne(state, action.data, 'id'),
        isFetching: false
      }

    case UPDATE_DETAIL_SUCCESS:
      return {
        ...state,
        ...updateDataOne(state, action.data, 'id'),
        isFetching: false
      }

    case MESSAGE_SUCCESS:
      return {
        ...state,
        ...sendMes(state, action.data),
        isFetching: false
      }

    default:
      return state
  }
}

// actions
export const fetchCompanyEnter = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/companyApplies')
    .query(query)
    .then(data => dispatch({type: LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

export const fetchCompanyEnterDetail = (id) => dispatch => {
  console.log(id)
  dispatch({type: DETAIL_LOAD})
  return request
    .get(`/manufactory/companyApplies/${id}`)
    .then(data => dispatch({type: DETAIL_LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: DETAIL_LOAD_FAILURE, error})
      throw error
    })
}

// 提交公司审核
export const checkCompanyEnter = (id, body) => dispatch => {
  dispatch({type: STATUS})
  return request
    .put(`/manufactory/companyApplies/${id}/check`)
    .send(body)
    .then(data => dispatch({type: STATUS_SUCCESS, id, data}))
    .catch(error => {
      dispatch({type: STATUS_FAILURE, error})
      throw error
    })
}

// 发送授权短信
export const sendMessage = (phone) => dispatch => {
  console.log(phone)
  dispatch({type: MESSAGE})
  return request
    .put(`/pay/smsAuth/${phone}`)
    .send({phone})
    .then(data => dispatch({type: MESSAGE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: MESSAGE_FAILURE, error})
      throw error
    })
}
// 修改公司申请详情
export const updateCompanyDetail = (body) => dispatch => {
  dispatch({type: UPDATE_DETAIL})
  return request
    .put(`/manufactory/companyApplies `)
    .send(body)
    .then(data => dispatch({type: UPDATE_DETAIL_SUCCESS, data}))
    .catch(error => {
      dispatch({type: UPDATE_DETAIL_FAILURE, error})
      throw error
    })
}
