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
const LOAD = 'mw/goodses/LOAD'
const LOAD_SUCCESS = 'mw/goodses/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/goodses/LOAD_FAILURE'

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

export const fetchGoodses = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .post('/ecback/goods/search')
    .send(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.goods]})

      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

export const fetchGoodsesOne = (goodsId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.load(schema.goods, goodsId))
  return request
    .get(`/ecback/goods/${goodsId}`)
    .then(payload => {
      payload.data = payload.data || {}
      dispatch(actions.loadSuccess(schema.goods, goodsId, payload.data))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.goods, goodsId, payload))
      throw payload
    })
}

export const insertGoodses = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.goods))
  return request
    .post('/ecback/goods')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.goods))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.goods, payload))
      throw payload
    })
}

export const updateGoodses = (goodsId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goods, goodsId))
  return request
    .put(`/ecback/goods/${goodsId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goods, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goods, goodsId, payload))
      throw payload
    })
}

export const deleteGoodses = goodsIds => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.goods))
  return request
    .del(`/ecback/goods`)
    .send(goodsIds)
    .then(payload => {
      dispatch(actions.delSuccess(schema.goods))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.goods, payload))
      throw payload
    })
}

// 上架
export const onShelfGoodses = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goods, 'shelf'))
  return request
    .put(`/ecback/goods/onShelf`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goods, 'shelf'))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goods, 'shelf', payload))
      throw payload
    })
}

// 下架
export const offShelfGoodses = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goods, 'offshelf'))
  return request
    .put(`/ecback/goods/offShelf`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goods, 'offshelf'))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goods, 'offshelf', payload))
      throw payload
    })
}

// 商品配置
export const fetchGoodsesStructures = (goodsId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.load(schema.goodsStructure, goodsId))
  return request
    .get(`/ecback/goods/${goodsId}/configs/search`)
    .then(payload => {
      dispatch(actions.loadSuccess(schema.goodsStructure, goodsId, payload.data))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.goodsStructure, goodsId, payload))
      throw payload
    })
}

export const fetchGoodsesConfigure = (goodsId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.load(schema.goodsConfigure, goodsId))
  return request
    .get(`/ecback/goods/${goodsId}/configs`)
    .then(payload => {
      dispatch(actions.loadSuccess(schema.goodsConfigure, goodsId, payload.data))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.goodsConfigure, goodsId, payload))
      throw payload
    })
}

export const insertGoodsesConfigure = (goodsId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.goodsConfigure, goodsId))
  return request
    .post(`/ecback/goods/${goodsId}/configs`)
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.goodsConfigure, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.goodsConfigure, goodsId, payload))
      throw payload
    })
}

export const updateGoodsesConfigure = (goodsId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goodsConfigure, goodsId))
  return request
    .put(`/ecback/goods/${goodsId}/configs`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goodsConfigure, goodsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goodsConfigure, goodsId, payload))
      throw payload
    })
}

// selecter
export const goodsesSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.goodses, {list: [schema.goods]}, entities)
}

export const goodsEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.goods)
}

export const goodsOneSelecter = (state, id) => {
  return entitiesSelecterById(state, schema.goods, id)
}

export const goodsStructureEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.goodsStructure)
}

export const goodsStructureSelecter = (state, goodsId) => {
  return entitiesSelecterById(state, schema.goodsStructure, goodsId)
}

export const goodsConfigureEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.goodsConfigure)
}
