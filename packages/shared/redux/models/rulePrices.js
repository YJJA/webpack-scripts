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

// action types
const LOAD = 'mw/rulePrices/LOAD'
const LOAD_SUCCESS = 'mw/rulePrices/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/rulePrices/LOAD_FAILURE'

const initialState = {
  isFetching: false,
  list: [],
  total: 0,
  error: null
}

// reducer
export default createReducer(initialState, {
  [LOAD]: (state) => {
    return {...state, isFetching: true, error: null}
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {...state, isFetching: false, list: payload.list, total: payload.total}
  },
  [LOAD_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: false, error: payload}
  }
})

// actions
// 规则列表
export const fetchRulePricesList = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/rulePrice/list')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.rulePrices]})

      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

// 启用商品规则
export const disableRulePricesList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.rulePrices, goodsId))
  return request
    .put(`/ecback/rulePrice/disable/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.rulePrices, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.rulePrices, goodsId, payload))
      throw payload
    })
}

// 禁用商品规则
export const enabledRulePricesList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.rulePrices, goodsId))
  return request
    .put(`/ecback/rulePrice/enabled/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.rulePrices, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.rulePrices, goodsId, payload))
      throw payload
    })
}

// 删除商品规则
export const deleteRulePricesList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.rulePrices, goodsId))
  return request
    .delete(`/ecback/rulePrice/delete/${goodsId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.rulePrices, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.rulePrices, goodsId, payload))
      throw payload
    })
}

export const fetchRulePrices = (query) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = query
  dispatch(actions.load(schema.rulePricesList, goodsId))
  return request
    .get('/ecback/rulePrice')
    .query(query)
    .then(payload => {
      dispatch(actions.loadSuccess(schema.rulePricesList, goodsId, {list: payload.data}))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.rulePricesList, goodsId, payload))
      throw payload
    })
}

export const insertRulePrices = (body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.insert(schema.rulePricesList, goodsId))
  return request
    .post('/ecback/rulePrice')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.rulePricesList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.rulePricesList, goodsId, payload))
      throw payload
    })
}

export const updateRulePrices = (ruleId, body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.update(schema.rulePricesList, goodsId))
  return request
    .put(`/ecback/rulePrice/${ruleId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.rulePricesList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.rulePricesList, goodsId, payload))
      throw payload
    })
}

export const deleteRulePrices = (goodsId, ruleId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.rulePricesList, goodsId))
  return request
    .del(`/ecback/rulePrice/${ruleId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.rulePricesList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.rulePricesList, goodsId, payload))
      throw payload
    })
}

// selecter
export const rulePricesSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.rulePrices, {list: [schema.rulePrices]}, entities)
}

export const rulePricesEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.rulePrices)
}

export const rulePricesListSelecter = (state) => {
  return entitiesSelecter(state, schema.rulePricesList)
}
