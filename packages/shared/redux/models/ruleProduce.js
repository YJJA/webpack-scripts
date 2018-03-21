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
const LOAD = 'mw/ruleProduce/LOAD'
const LOAD_SUCCESS = 'mw/ruleProduce/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/ruleProduce/LOAD_FAILURE'

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
export const fetchRuleProduceList = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/ruleProduce/list')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.ruleProduce]})

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
export const disableRuleProduceList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleProduce, goodsId))
  return request
    .put(`/ecback/ruleProduce/disable/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleProduce, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleProduce, goodsId, payload))
      throw payload
    })
}

// 禁用商品规则
export const enabledRuleProduceList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleProduce, goodsId))
  return request
    .put(`/ecback/ruleProduce/enabled/${goodsId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleProduce, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleProduce, goodsId, payload))
      throw payload
    })
}

// 删除商品规则
export const deleteRuleProduceList = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.ruleProduce, goodsId))
  return request
    .delete(`/ecback/ruleProduce/delete/${goodsId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.ruleProduce, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.ruleProduce, goodsId, payload))
      throw payload
    })
}

export const fetchRuleProduce = ({goodsId}) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.load(schema.ruleProduceList, goodsId))
  return request
    .get(`/ecback/ruleProduce/${goodsId}`)
    .then(payload => {
      dispatch(actions.loadSuccess(schema.ruleProduceList, goodsId, {list: payload.data}))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.ruleProduceList, goodsId, payload))
      throw payload
    })
}

export const insertRuleProduce = (body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.insert(schema.ruleProduceList, goodsId))
  return request
    .post('/ecback/ruleProduce/add')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.ruleProduceList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.ruleProduceList, goodsId, payload))
      throw payload
    })
}

export const updateRuleProduce = (ruleId, body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.update(schema.ruleProduceList, goodsId))
  return request
    .put(`/ecback/ruleProduce/edit`)
    .send({...body, ruleId})
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleProduceList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleProduceList, goodsId, payload))
      throw payload
    })
}

export const deleteRuleProduce = (goodsId, ruleId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.ruleProduceList, goodsId))
  return request
    .del(`/ecback/ruleProduce/delete/ruleId/${ruleId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.ruleProduceList, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.ruleProduceList, goodsId, payload))
      throw payload
    })
}

// selecter
export const ruleProduceSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.ruleProduce, {list: [schema.ruleProduce]}, entities)
}

export const ruleProduceEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleProduce)
}

export const ruleProduceListSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleProduceList)
}
