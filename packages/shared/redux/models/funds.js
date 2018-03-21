import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD = 'pay/funds/LOAD'
const LOAD_SUCCESS = 'pay/funds/LOAD_SUCCESS'
const LOAD_FAILURE = 'pay/funds/LOAD_FAILURE'

const UPDATE = 'pay/funds/UPDATE'
const UPDATE_SUCCESS = 'pay/funds/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'pay/funds/UPDATE_FAILURE'

const LOAD_PARENT = 'pay/funds/LOAD_PARENT'
const LOAD_PARENT_SUCCESS = 'pay/funds/LOAD_PARENT_SUCCESS'
const LOAD_PARENT_FAILURE = 'pay/funds/LOAD_PARENT_FAILURE'

const POST_DIVIDE = 'pay/funds/POST_DIVIDE'
const POST_DIVIDE_SUCCESS = 'pay/funds/POST_DIVIDE_SUCCESS'
const POST_DIVIDE_FAILURE = 'pay/funds/POST_DIVIDE_FAILURE'

const UPDATE_STATUS = 'pay/funds/UPDATE_STATUS'
const UPDATE_STATUS_SUCCESS = 'pay/funds/UPDATE_STATUS_SUCCESS'
const UPDATE_STATUS_FAILURE = 'pay/funds/UPDATE_STATUS_FAILURE'

const UPDATE_BATCH = 'pay/funds/UPDATE_BATCH'
const UPDATE_BATCH_SUCCESS = 'pay/funds/UPDATE_BATCH_SUCCESS'
const UPDATE_BATCH_FAILURE = 'pay/funds/UPDATE_BATCH_FAILURE'

const COMPANIES = 'pay/funds/COMPANIES'
const COMPANIES_SUCCESS = 'pay/funds/COMPANIES_SUCCESS'
const COMPANIES_FAILURE = 'pay/funds/COMPANIES_FAILURE'

const initialState = {
  isFetching: false,
  byId: {},
  allIds: [],
  error: null,
  companyList: []
}
// 获取供应商列表(审核通过的入驻公司)
const fetchCompanyList = (state, payload) => {
  const data = payload.data || []
  console.log(data)
  state.companyList = data.list
}
// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case UPDATE:
    case POST_DIVIDE:
    case UPDATE_STATUS:
    case UPDATE_BATCH:
    case COMPANIES:
      return {...state, isFetching: true, error: null}

    case LOAD_FAILURE:
    case UPDATE_FAILURE:
    case POST_DIVIDE_FAILURE:
    case UPDATE_STATUS_FAILURE:
    case UPDATE_BATCH_FAILURE:
    case COMPANIES_FAILURE:
      return {...state, isFetching: false, error: action.data}

    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.data),
        isFetching: false
      }
    case COMPANIES_SUCCESS:
      return {
        ...state,
        ...fetchCompanyList(state, action.data),
        isFetching: false
      }

    case POST_DIVIDE_SUCCESS:
      return {
        ...state,
        isFetching: false
      }

    case UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        isFetching: false
      }
    case UPDATE_BATCH_SUCCESS:
      return {
        ...state,
        isFetching: false
      }
    case UPDATE_SUCCESS:
      return {
        ...state,
        isFetching: false
      }

    default:
      return state
  }
}

// 获取商户账单列表
export const fetchFundsList = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/pay/bussbill')
    .query(query)
    .then(data => dispatch({type: LOAD_SUCCESS, data}))
    .catch(error => {
      console.log(error)
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

// 批量分账接口
export const merchantDivide = (body) => dispatch => {
  dispatch({type: POST_DIVIDE})
  return request
    .post(`/pay/merchantDivide/batch`)
    .send(body)
    .then(data => dispatch({type: POST_DIVIDE_SUCCESS, data}))
    .catch(data => {
      dispatch({type: POST_DIVIDE_FAILURE, data})
      throw data
    })
}

// 支付订单，对账状态修改
export const updateCheckStatus = (id, body) => dispatch => {
  dispatch({type: UPDATE_STATUS})
  return request
    .put(`/pay/bussbill/${id}?checkStatus=${body.checkStatus}`)
    .send(body)
    .then(data => dispatch({type: UPDATE_STATUS_SUCCESS, data}))
    .catch(data => {
      dispatch({type: UPDATE_STATUS_SUCCESS, data})
      throw data
    })
}

// 获取供应商
export const fetchCompanies = query => dispatch => {
  dispatch({type: COMPANIES})
  return request
    .get('/manufactory/backCompany')
    .query(query)
    .then(data => dispatch({type: COMPANIES_SUCCESS, data}))
    .catch(error => {
      dispatch({type: COMPANIES_FAILURE, error})
      throw error
    })
}
// 批量确认接口
export const updateBatch = (body) => dispatch => {
  dispatch({type: UPDATE_BATCH})
  return request
    .put(`/pay/bussbill/updateBatch`)
    .send(body)
    .then(data => dispatch({type: UPDATE_BATCH_SUCCESS, data}))
    .catch(data => {
      dispatch({type: UPDATE_BATCH_SUCCESS, data})
      throw data
    })
}
