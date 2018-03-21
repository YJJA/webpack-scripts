import {normalize, denormalize} from 'normalizr'
import * as schema from '../schema'
import {
  createReducer,
  allEntitiesSelecter,
  entitiesSelecter,
  entitiesSelecterById,
  fetchStatusSelecter,
  fetchStatusSelecterById
} from '../redux-normalizr'

// action type
const LOAD = 'mw/orders/LOAD'
const LOAD_SUCCESS = 'mw/orders/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/orders/LOAD_FAILURE'

// initialState
const initialState = {
  isFetching: false,
  list: [],
  error: null,
  total: 0
}

// reducer
export default createReducer(initialState, {
  [LOAD]: (state, action) => {
    return { ...state, isFetching: true, error: null }
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      isFetching: false,
      list: payload.list,
      total: payload.total
    }
  },
  [LOAD_FAILURE]: (state, action) => {
    return {...state, isFetching: false, error: action.payload}
  }
})

// action
export const fetchOrders = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/orders')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.order]})

      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

export const fetchOrdersOne = (orderId, query) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.load(schema.order, orderId))
  return Promise.all([
    request.get(`/ecback/orders/${orderId}`).query(query),
    request.get(`/ecback/orders/status/${orderId}`).query(query)
  ])
    .then(([detail, status]) => {
      const payload = {
        ...detail.data,
        ...status.data,
        operateList: status.data.operList
      }

      dispatch(actions.loadSuccess(schema.order, orderId, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.order, orderId, payload))
      throw payload
    })
}

export const updateOrders = (orderId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.order, orderId))
  return request
    .put(`/ecback/orders/${orderId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.order, orderId))
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.order, orderId, payload))
      throw payload
    })
}

export const fetchGoodsConfig = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goodsConfiguration, goodsId))

  return request
    .get(`/ecback/goodsConfig/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goodsConfiguration, goodsId, payload.data))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goodsConfiguration, goodsId, payload))
      throw payload
    })
}

// selecter
export const ordersSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.orders, {list: [schema.order]}, entities)
}

export const orderOneSelecter = (state, id) => {
  return entitiesSelecterById(state, schema.order, id)
}

export const orderStatusSelecter = (state, id) => {
  return fetchStatusSelecterById(state, schema.order, id)
}

export const goodsConfigurationSelecter = (state, id) => {
  return entitiesSelecterById(state, schema.goodsConfiguration, id)
}
