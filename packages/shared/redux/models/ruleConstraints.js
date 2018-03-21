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
const LOAD = 'mw/ruleConstraints/LOAD'
const LOAD_SUCCESS = 'mw/ruleConstraints/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/ruleConstraints/LOAD_FAILURE'

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
export const fetchRuleConstraintsList = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/ruleRestraint/list')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.ruleConstraints]})

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
export const disableRuleConstraintsList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleConstraints, goodsId))
  return request
    .put(`/ecback/ruleRestraint/disable/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleConstraints, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleConstraints, goodsId, payload))
      throw payload
    })
}

// 禁用商品规则
export const enabledRuleConstraintsList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleConstraints, goodsId))
  return request
    .put(`/ecback/ruleRestraint/enabled/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleConstraints, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleConstraints, goodsId, payload))
      throw payload
    })
}

// 删除商品规则
export const deleteRuleConstraintsList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.ruleConstraints, goodsId))
  return request
    .delete(`/ecback/ruleRestraint/delete/${goodsId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.ruleConstraints, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.ruleConstraints, goodsId, payload))
      throw payload
    })
}

export const fetchRuleConstraints = (query) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = query
  dispatch(actions.load(schema.ruleConstraintsList, goodsId))
  return request
    .get('/ecback/ruleRestraint')
    .query(query)
    .then(payload => {
      dispatch(actions.loadSuccess(schema.ruleConstraintsList, goodsId, {list: payload.data}))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.ruleConstraintsList, goodsId, payload))
      throw payload
    })
}

export const insertRuleConstraints = (body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.insert(schema.ruleConstraintsList, goodsId))
  return request
    .post('/ecback/ruleRestraint')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.ruleConstraintsList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.ruleConstraintsList, goodsId, payload))
      throw payload
    })
}

export const updateRuleConstraints = (ruleId, body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.update(schema.ruleConstraintsList, goodsId))
  return request
    .put(`/ecback/ruleRestraint/${ruleId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleConstraintsList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleConstraintsList, goodsId, payload))
      throw payload
    })
}

export const deleteRuleConstraints = (goodsId, ruleId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.ruleConstraintsList, goodsId))
  return request
    .del(`/ecback/ruleRestraint/${ruleId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.ruleConstraintsList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.ruleConstraintsList, goodsId, payload))
      throw payload
    })
}

// selecter
export const ruleConstraintsSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.ruleConstraints, {list: [schema.ruleConstraints]}, entities)
}

export const ruleConstraintsEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleConstraints)
}

export const ruleConstraintsListSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleConstraintsList)
}
