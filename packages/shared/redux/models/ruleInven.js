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
const LOAD = 'mw/ruleInven/LOAD'
const LOAD_SUCCESS = 'mw/ruleInven/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/ruleInven/LOAD_FAILURE'

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
export const fetchRuleInvenList = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/ruleInven/list')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.ruleInven]})

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
export const disableRuleInvenList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleInven, goodsId))
  return request
    .put(`/ecback/ruleInven/disable/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleInven, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleInven, goodsId, payload))
      throw payload
    })
}

// 禁用商品规则
export const enabledRuleInvenList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleInven, goodsId))
  return request
    .put(`/ecback/ruleInven/enabled/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleInven, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleInven, goodsId, payload))
      throw payload
    })
}

// 删除商品规则
export const deleteRuleInvenList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.ruleInven, goodsId))
  return request
    .delete(`/ecback/ruleInven/delete/${goodsId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.ruleInven, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.ruleInven, goodsId, payload))
      throw payload
    })
}

export const fetchRuleInven = (query) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = query
  dispatch(actions.load(schema.ruleInvenList, goodsId))
  return request
    .get('/ecback/ruleInven')
    .query(query)
    .then(payload => {
      dispatch(actions.loadSuccess(schema.ruleInvenList, goodsId, {list: payload.data}))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.ruleInvenList, goodsId, payload))
      throw payload
    })
}

export const insertRuleInven = (body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.insert(schema.ruleInvenList, goodsId))
  return request
    .post('/ecback/ruleInven')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.ruleInvenList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.ruleInvenList, goodsId, payload))
      throw payload
    })
}

export const updateRuleInven = (ruleId, body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.update(schema.ruleInvenList, goodsId))
  return request
    .put(`/ecback/ruleInven/${ruleId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleInvenList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleInvenList, goodsId, payload))
      throw payload
    })
}

export const deleteRuleInven = (goodsId, ruleId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.ruleInvenList, goodsId))
  return request
    .del(`/ecback/ruleInven/${ruleId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.ruleInvenList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.ruleInvenList, goodsId, payload))
      throw payload
    })
}

// selecter
export const ruleInvenSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.ruleInven, {list: [schema.ruleInven]}, entities)
}

export const ruleInvenEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleInven)
}

export const ruleInvenListSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleInvenList)
}
