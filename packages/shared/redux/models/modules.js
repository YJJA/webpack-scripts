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
const LOAD = 'mw/modules/LOAD'
const LOAD_SUCCESS = 'mw/modules/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/modules/LOAD_FAILURE'

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
      isFetching: true,
      list: payload.list,
      total: payload.total
    }
  },
  [LOAD_FAILURE]: (state, action) => {
    return {...state, isFetching: false, error: action.payload}
  }
})

// 模块列表
export const fetchModules = modelConfigId => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get(`/manufactory/models/${modelConfigId}/groups`)
    .then(payload => {
      const data = normalize({list: payload.data || []}, {list: [schema.modules]})

      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

export const insertModules = (modelConfigId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.modules))
  return request
    .post(`/manufactory/models/groups`)
    .send({...body, modelConfigId})
    .then(payload => {
      dispatch(actions.insertSuccess(schema.modules))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.modules, payload))
      throw payload
    })
}

export const updateModules = (modelConfigId, id, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.modules, id))
  return request
    .put(`/manufactory/models/groups`)
    .send({...body, modelConfigId, id})
    .then(payload => {
      dispatch(actions.updateSuccess(schema.modules, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.modules, id, payload))
      throw payload
    })
}

export const deleteModules = (modelConfigId, id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.modules, id))
  return request
    .del(`/manufactory/models/groups/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.modules, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.modules, id, payload))
      throw payload
    })
}

// 节点列表
export const fetchOptions = (modelConfigId, id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.modules, id))
  return request
    .get(`/manufactory/models/groups/${id}/items`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.modules, id, {
        options: payload.data
      }))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.modules, id, payload))
      throw payload
    })
}

export const insertOptions = (modelConfigId, modelId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.modulesOption))
  return request
    .post(`/manufactory/models/groups/items`)
    .send({...body, modelId})
    .then(payload => {
      dispatch(actions.insertSuccess(schema.modulesOption))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.modulesOption, payload))
      throw payload
    })
}

export const updateOptions = (modelConfigId, modelId, id, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.modulesOption, id))
  return request
    .put(`/manufactory/models/groups/items`)
    .send({...body, modelId, id})
    .then(payload => {
      dispatch(actions.updateSuccess(schema.modulesOption, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.modulesOption, id, payload))
      throw payload
    })
}

export const deleteOptions = (modelConfigId, modelId, id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.modulesOption, id))
  return request
    .del(`/manufactory/models/groups/items/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.modulesOption, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.modulesOption, id, payload))
      throw payload
    })
}

// 选项值列表
export const fetchValues = (modelConfigId, modelId, modelItemId) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.modulesOption, modelItemId))
  return request
    .get(`/manufactory/models/groups/${modelItemId}/values`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.modulesOption, modelItemId, {
        values: payload.data
      }))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.modulesOption, modelItemId, payload))
      throw payload
    })
}

export const insertValues = (modelConfigId, modelId, modelItemId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.modulesValue))
  return request
    .post(`/manufactory/models/groups/items/values`)
    .send({...body, modelId, modelItemId})
    .then(payload => {
      dispatch(actions.insertSuccess(schema.modulesValue))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.modulesValue, payload))
      throw payload
    })
}

export const updateValues = (modelConfigId, modelId, modelItemId, id, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.modulesValue, id))
  return request
    .put(`/manufactory/models/groups/items/values`)
    .send({...body, modelId, modelItemId, id})
    .then(payload => {
      dispatch(actions.updateSuccess(schema.modulesValue, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.modulesValue, id, payload))
      throw payload
    })
}

export const deleteValues = (modelConfigId, modelId, modelItemId, id) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.modulesValue, id))
  return request
    .del(`/manufactory/models/groups/items/values/${id}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.modulesValue, id))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.modulesValue, id, payload))
      throw payload
    })
}

// selecter
export const modulesSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.modules, {list: [schema.modules]}, entities)
}

export const modulesEntitiesSelecter = (state) => {
  return entitiesSelecter(state, schema.modules)
}
