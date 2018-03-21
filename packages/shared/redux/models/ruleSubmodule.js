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
const LOAD = 'mw/ruleSubmodule/LOAD'
const LOAD_SUCCESS = 'mw/ruleSubmodule/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/ruleSubmodule/LOAD_FAILURE'

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
export const fetchRuleSubmoduleList = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/ruleSubmodule/list')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.ruleSubmodule]})

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
export const disableRuleSubmoduleList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleSubmodule, goodsId))
  return request
    .put(`/ecback/ruleSubmodule/disable/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleSubmodule, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleSubmodule, goodsId, payload))
      throw payload
    })
}

// 禁用商品规则
export const enabledRuleSubmoduleList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleSubmodule, goodsId))
  return request
    .put(`/ecback/ruleSubmodule/enabled/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleSubmodule, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleSubmodule, goodsId, payload))
      throw payload
    })
}

// 删除商品规则
export const deleteRuleSubmoduleList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.ruleSubmodule, goodsId))
  return request
    .delete(`/ecback/ruleSubmodule/delete/${goodsId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.ruleSubmodule, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.ruleSubmodule, goodsId, payload))
      throw payload
    })
}

export const fetchRuleSubmodule = (query) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = query
  dispatch(actions.load(schema.ruleSubmoduleList, goodsId))
  return request
    .get(`/ecback/ruleSubmodule/${goodsId}`)
    .query(query)
    .then(payload => {
      dispatch(actions.loadSuccess(schema.ruleSubmoduleList, goodsId, {list: payload.data}))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.ruleSubmoduleList, goodsId, payload))
      throw payload
    })
}

export const insertRuleSubmodule = (body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.insert(schema.ruleSubmoduleList, goodsId))
  return request
    .post('/ecback/ruleSubmodule/add')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.ruleSubmoduleList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.ruleSubmoduleList, goodsId, payload))
      throw payload
    })
}

export const updateRuleSubmodule = (ruleId, body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.update(schema.ruleSubmoduleList, goodsId))
  return request
    .put(`/ecback/ruleSubmodule/edit`)
    .send({...body, ruleId})
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleSubmoduleList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleSubmoduleList, goodsId, payload))
      throw payload
    })
}

export const deleteRuleSubmodule = (goodsId, ruleId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.ruleSubmoduleList, goodsId))
  return request
    .del(`/ecback/ruleSubmodule/delete/ruleId/${ruleId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.ruleSubmoduleList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.ruleSubmoduleList, goodsId, payload))
      throw payload
    })
}

// selecter
export const ruleSubmoduleSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.ruleSubmodule, {list: [schema.ruleSubmodule]}, entities)
}

export const ruleSubmoduleEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleSubmodule)
}

export const ruleSubmoduleListSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleSubmoduleList)
}
