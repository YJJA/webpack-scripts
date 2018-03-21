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
const LOAD = 'mw/ruleExhibitions/LOAD'
const LOAD_SUCCESS = 'mw/ruleExhibitions/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/ruleExhibitions/LOAD_FAILURE'

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
export const fetchRuleExhibitions = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/ruleDisplay/list')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.ruleExhibitions]})

      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

// 生成配置表
export const generateConfList = body => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  dispatch(actions.load(schema.ruleExhibitionsDenerate, goodsId))
  return request
    .post('/ecback/ruleDisplay/generate')
    .send(body)
    .then(payload => {
      dispatch(actions.loadSuccess(schema.ruleExhibitionsDenerate, goodsId, {list: payload.data}))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.ruleExhibitionsDenerate, goodsId, payload))
      throw payload
    })
}

// 启用商品规则
export const disableRuleExhibitions = (goodsId, ruleId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleExhibitions, goodsId))
  return request
    .put(`/ecback/ruleDisplay/disable/${ruleId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleExhibitions, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleExhibitions, goodsId, payload))
      throw payload
    })
}

// 禁用商品规则
export const enabledRuleExhibitions = (goodsId, ruleId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.ruleExhibitions, goodsId))
  return request
    .put(`/ecback/ruleDisplay/enabled/${ruleId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleExhibitions, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleExhibitions, goodsId, payload))
      throw payload
    })
}

// 删除商品规则
export const deleteRuleExhibitions = (goodsId, ruleId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.ruleExhibitions, goodsId))
  return request
    .delete(`/ecback/ruleDisplay/delete/${ruleId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.ruleExhibitions, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.ruleExhibitions, goodsId, payload))
      throw payload
    })
}

// 规则
export const fetchRuleExhibitionsOne = (goodsId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.load(schema.ruleExhibitions, goodsId))
  return request
    .get(`/ecback/ruleDisplay/${goodsId}`)
    .then(payload => {
      let nodeIdItem = []
      try {
        nodeIdItem = JSON.parse(payload.data.nodeIdItem)
      } catch (e) {}
      payload = {
        ...payload,
        data: {...payload.data, nodeIdItem}
      }

      const key = schema.ruleExhibitionsDenerate.key
      dispatch(actions.add({
        [key]: {
          [goodsId]: {list: payload.data.ruleDisplayGoodsSkuList || []}
        }
      }))
      dispatch(actions.loadSuccess(schema.ruleExhibitions, goodsId, payload.data))
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.ruleExhibitions, goodsId, payload))
      throw payload
    })
}

export const insertRuleExhibitionsOne = (body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  const nextBody = {
    ...body,
    nodeIdItem: JSON.stringify(body.nodeIdItem)
  }
  dispatch(actions.insert(schema.ruleExhibitions, goodsId))

  return request
    .post('/ecback/ruleDisplay/add')
    .send(nextBody)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.ruleExhibitions, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.ruleExhibitions, goodsId, payload))
      throw payload
    })
}

export const updateRuleExhibitionsOne = (ruleId, body) => (dispatch, getState, {schema, actions, request}) => {
  const {goodsId} = body
  const nextBody = {
    ...body,
    nodeIdItem: JSON.stringify(body.nodeIdItem)
  }
  dispatch(actions.update(schema.ruleExhibitions, goodsId))

  return request
    .put(`/ecback/ruleDisplay/edit`)
    .send(nextBody)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.ruleExhibitions, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.ruleExhibitions, goodsId, payload))
      throw payload
    })
}

// 下载前列表
export const downloadRuleExhibitions = (query) => {
  // return request
  //   .get(`/ecback/ruleDisplay/preDownload`)
  //   .query(query)
}

// selecter
export const ruleExhibitionsSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.ruleExhibitions, {list: [schema.ruleExhibitions]}, entities)
}

export const ruleExhibitionsEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleExhibitions)
}

export const ruleExhibitionsDenerateEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.ruleExhibitionsDenerate)
}
