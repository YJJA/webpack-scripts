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

// reducer
export default createReducer({}, {})

// 结构列表
export const fetchStructures = goodsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.load(schema.goodsStructures, goodsId))
  return request
    .get(`/ecback/goods/${goodsId}/structures`)
    .then(payload => {
      dispatch(actions.loadSuccess(schema.goodsStructures, goodsId, {
        list: payload.data
      }))
      return payload
    })
    .catch(payload => {
      dispatch(actions.loadFailure(schema.goodsStructures, goodsId, payload))
      throw payload
    })
}

export const insertStructures = (goodsId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.goodsStructure))
  return request
    .post(`/ecback/goods/structures`)
    .send({...body, goodsId})
    .then(payload => {
      dispatch(actions.insertSuccess(schema.goodsStructure))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.goodsStructure, payload))
      throw payload
    })
}

export const updateStructures = (goodsId, structureId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goodsStructure, structureId))
  return request
    .put(`/ecback/goods/structures/${structureId}`)
    .send({...body, goodsId})
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goodsStructure, structureId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goodsStructure, structureId, payload))
      throw payload
    })
}

export const deleteStructures = (goodsId, structureId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.goodsStructure, structureId))
  return request
    .del(`/ecback/goods/structures/${structureId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.goodsStructure, structureId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.goodsStructure, structureId, payload))
      throw payload
    })
}

// 节点列表
export const fetchStructuresNodes = (goodsId, structureId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goodsStructure, structureId))
  return request
    .get(`/ecback/goods/structures/${structureId}/nodes`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goodsStructure, structureId, {
        nodes: payload.data
      }))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goodsStructure, structureId, payload))
      throw payload
    })
}

export const insertStructuresNodes = (goodsId, structureId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.goodsNode))
  return request
    .post(`/ecback/goods/structures/nodes`)
    .send({...body, goodsId, structureId})
    .then(payload => {
      dispatch(actions.insertSuccess(schema.goodsNode))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.goodsNode, payload))
      throw payload
    })
}

export const updateStructuresNodes = (goodsId, structureId, nodeId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goodsNode, nodeId))
  return request
    .put(`/ecback/goods/structures/nodes/${nodeId}`)
    .send({...body, goodsId, structureId})
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goodsNode, nodeId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goodsNode, structureId, payload))
      throw payload
    })
}

export const deleteStructuresNodes = (goodsId, structureId, nodeId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goodsNode, nodeId))
  return request
    .del(`/ecback/goods/structures/nodes/${nodeId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.goodsNode, nodeId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.goodsNode, nodeId, payload))
      throw payload
    })
}

// 选项列表
export const fetchStructuresOptions = (goodsId, structureId, nodeId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goodsNode, nodeId))
  return request
    .get(`/ecback/goods/structures/nodes/${nodeId}/options`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goodsNode, nodeId, {
        options: payload.data
      }))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goodsNode, nodeId, payload))
      throw payload
    })
}

export const insertStructuresOptions = (goodsId, structureId, nodeId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.goodsOption))
  return request
    .post(`/ecback/goods/structures/nodes/options`)
    .send({...body, goodsId, structureId, nodeId})
    .then(payload => {
      dispatch(actions.insertSuccess(schema.goodsOption))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.goodsOption, payload))
      throw payload
    })
}

export const updateStructuresOptions = (goodsId, structureId, nodeId, optionId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.goodsOption, optionId))
  return request
    .put(`/ecback//goods/structures/nodes/options/${optionId}`)
    .send({...body, goodsId, structureId, nodeId})
    .then(payload => {
      dispatch(actions.updateSuccess(schema.goodsOption, optionId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.goodsOption, optionId, payload))
      throw payload
    })
}

export const deleteStructuresOptions = (goodsId, structureId, nodeId, optionId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.goodsOption, optionId))
  return request
    .del(`/ecback//goods/structures/nodes/options/${optionId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.goodsOption, optionId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.goodsOption, optionId, payload))
      throw payload
    })
}

// selecter
export const goodsStructuresSelecter = (state, id) => {
  return entitiesSelecterById(state, schema.goodsStructures, id)
}

export const goodsStructureEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.goodsStructure)
}

export const goodsStructureSelecter = (state, id) => {
  return entitiesSelecterById(state, schema.goodsStructure, id)
}

export const goodsNodeSelecter = (state, id) => {
  return entitiesSelecterById(state, schema.goodsNode, id)
}

export const goodsNodeEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.goodsNode)
}

export const goodsOptionEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.goodsOption)
}
