import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action type
const LOAD = 'mw/salesOrders/LOAD'
const LOAD_SUCCESS = 'mw/salesOrders/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/salesOrders/LOAD_FAILURE'

const LOAD_ONE = 'mw/salesOrders/LOAD_ONE'
const LOAD_ONE_SUCCESS = 'mw/salesOrders/LOAD_ONE_SUCCESS'
const LOAD_ONE_FAILURE = 'mw/salesOrders/LOAD_ONE_FAILURE'

const LOAD_STATUS = 'mw/salesOrders/LOAD_STATUS'
const LOAD_STATUS_SUCCESS = 'mw/salesOrders/LOAD_STATUS_SUCCESS'
const LOAD_STATUS_FAILURE = 'mw/salesOrders/LOAD_STATUS_FAILURE'

const UPDATE = 'mw/salesOrders/UPDATE'
const UPDATE_SUCCESS = 'mw/salesOrders/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'mw/salesOrders/UPDATE_FAILURE'

const GOODS_CONFIG = 'mw/salesOrders/GOODS_CONFIG'
const GOODS_CONFIG_SUCCESS = 'mw/salesOrders/GOODS_CONFIG_SUCCESS'
const GOODS_CONFIG_FAILURE = 'mw/salesOrders/GOODS_CONFIG_FAILURE'

const initialState = {
  isFetching: false,
  error: null,
  byId: {},
  allIds: [],
  total: 0
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case LOAD_ONE:
    case LOAD_STATUS:
    case UPDATE:
    case GOODS_CONFIG:
      return { ...state, isFetching: true, error: null }

    case LOAD_FAILURE:
    case LOAD_ONE_FAILURE:
    case LOAD_STATUS_FAILURE:
    case UPDATE_FAILURE:
    case GOODS_CONFIG_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      }

    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.payload.data, 'id'),
        isFetching: false
      }

    case LOAD_STATUS_SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.orderId]: {
            ...state.byId[action.orderId],
            operList: action.payload.data.operList,
            statusList: action.payload.data.statusList
          }
        },
        isFetching: false
      }

    case LOAD_ONE_SUCCESS:
    case UPDATE_SUCCESS:
      return {
        ...state,
        ...updateDataOne(state, action.payload.data),
        isFetching: false
      }

    default:
      return state
  }
}

// action
export const fetchSalesOrders = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/orders')
    .query(query)
    .then(payload => dispatch({type: LOAD_SUCCESS, payload}))
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

export const fetchSalesOrdersOne = orderId => dispatch => {
  dispatch({type: LOAD_ONE})
  return request
    .get(`/ecback/orders/${orderId}`)
    .then(payload => dispatch({type: LOAD_ONE_SUCCESS, payload}))
    .catch(payload => {
      dispatch({type: LOAD_ONE_FAILURE, payload})
      throw payload
    })
}

export const fetchSalesOrdersStatus = orderId => dispatch => {
  dispatch({type: LOAD_STATUS})
  return request
    .get(`/ecback/orders/status/${orderId}`)
    .then(payload => dispatch({type: LOAD_STATUS_SUCCESS, orderId, payload}))
    .catch(payload => {
      dispatch({type: LOAD_STATUS_FAILURE, payload})
      throw payload
    })
}

export const fetchGoodsConfig = goodsId => dispatch => {
  dispatch({type: GOODS_CONFIG})
  return request
    .get(`/ecback/goodsConfig/${goodsId}`)
    .then(payload => dispatch({type: GOODS_CONFIG_SUCCESS, goodsId, payload}))
    .catch(payload => {
      dispatch({type: GOODS_CONFIG_FAILURE, payload})
      throw payload
    })
}

export const updateSalesOrders = (orderId, body) => dispatch => {
  dispatch({type: UPDATE})
  return request
    .put(`/ecback/orders/${orderId}`)
    .send(body)
    .then(payload => dispatch({type: UPDATE_SUCCESS, payload}))
    .catch(payload => {
      dispatch({type: UPDATE_FAILURE, payload})
      throw payload
    })
}
