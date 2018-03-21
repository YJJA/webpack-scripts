import {normalize, schema} from 'normalizr'
import createReducer from './createReducer'
import {
  ADD_ENTITIES,
  LOAD_ENTITY,
  LOAD_ENTITY_SUCCESS,
  LOAD_ENTITY_FAILURE,
  UPDATE_ENTITY,
  UPDATE_ENTITY_SUCCESS,
  UPDATE_ENTITY_FAILURE,
  DEL_ENTITY,
  DEL_ENTITY_SUCCESS,
  DEL_ENTITY_FAILURE,
  INSERT_ENTITY,
  INSERT_ENTITY_SUCCESS,
  INSERT_ENTITY_FAILURE
} from './actions'

const addEntitiesByKey = (state = {}, key, entities) => {
  const nextState = Object.keys(entities).reduce((result, id) => {
    result.entities[id] = {
      ...state.entities[id],
      ...entities[id]
    }
    result.fetchStatus[id] = false
    return result
  }, {entities: {}, fetchStatus: {}, errors: {}})
  return {
    entities: {...state.entities, ...nextState.entities},
    errors: {...state.errors, ...nextState.errors},
    fetchStatus: {...state.fetchStatus, ...nextState.fetchStatus}
  }
}

const addEntities = (state, {payload}) => {
  return Object.keys(payload).reduce((result, key) => {
    result = {
      ...result,
      [key]: addEntitiesByKey(result[key], key, payload[key])
    }
    return result
  }, state)
}

// getKey
const getKey = (schema) => {
  return typeof schema === 'object' ? schema.key : schema
}

// 更新单个实体的数据
const setDataBySchema = (state, schema, id, data) => {
  const key = getKey(schema)
  return {
    ...state,
    [key]: {
      ...state[key],
      entities: {
        ...state[key].entities,
        [id]: {
          ...state[key].entities[id],
          ...data
        }
      }
    }
  }
}

// 设置单个实体的错误
const setErrorsBySchema = (state, schema, id, error) => {
  const key = getKey(schema)
  let errors = state[key].errors
  if (error) {
    errors[id] = error
  } else {
    delete errors[id]
  }

  return {
    ...state,
    [key]: {
      ...state[key],
      errors: {...errors}
    }
  }
}

// 更新单个实体的状态
const setStatusBySchema = (state, schema, id, status) => {
  const key = getKey(schema)
  return {
    ...state,
    [key]: {
      ...state[key],
      fetchStatus: {
        ...state[key].fetchStatus,
        [id]: status
      }
    }
  }
}

// 删除单个实体的数据, 错误，状态
const deleteDataBySchema = (state, schema, id) => {
  const key = getKey(schema)
  const {entities, errors, fetchStatus} = state[key]

  // delete entities[id]
  delete errors[id]
  delete fetchStatus[id]

  return {
    ...state,
    [key]: {
      ...state[key],
      errors: {...errors},
      fetchStatus: {...fetchStatus}
    }
  }
}

// 创建初始化数据
const createInitialState = (schema) => {
  return Object.keys(schema).reduce((result, k) => {
    const key = schema[k].key
    result[key] = {
      entities: {},
      errors: {},
      fetchStatus: {}
    }
    return result
  }, {})
}

// reducer
export default (schema) => {
  const initialState = createInitialState(schema)

  return createReducer(initialState, {
    [ADD_ENTITIES]: addEntities,

    // load
    [LOAD_ENTITY]: (state, {schema, id}) => {
      let nextState = setErrorsBySchema(state, schema, id)
      return setStatusBySchema(nextState, schema, id, true)
    },
    [LOAD_ENTITY_SUCCESS]: (state, {schema, id, payload}) => {
      payload[schema.idAttribute] = payload[schema.idAttribute] || id
      let normalizeData = normalize(payload, schema)
      return addEntities(state, {payload: normalizeData.entities})
    },
    [LOAD_ENTITY_FAILURE]: (state, {schema, id, payload}) => {
      let nextState = setErrorsBySchema(state, schema, id, payload)
      return setStatusBySchema(nextState, schema, id, false)
    },

    // update
    [UPDATE_ENTITY]: (state, {schema, id}) => {
      let nextState = setErrorsBySchema(state, schema, id)
      return setStatusBySchema(nextState, schema, id, true)
    },
    // 更新数据
    [UPDATE_ENTITY_SUCCESS]: (state, {schema, id, payload}) => {
      if (typeof payload === 'object') {
        payload[schema.idAttribute] = payload[schema.idAttribute] || id
        let normalizeData = normalize(payload, schema)
        return addEntities(state, {payload: normalizeData.entities})
      } else {
        return setStatusBySchema(state, schema, id, false)
      }
    },
    [UPDATE_ENTITY_FAILURE]: (state, {schema, id, payload}) => {
      let nextState = setErrorsBySchema(state, schema, id, payload)
      return setStatusBySchema(nextState, schema, id, false)
    },

    // del
    [DEL_ENTITY]: (state, {schema, id = 'delete'}) => {
      let nextState = setErrorsBySchema(state, schema, id)
      return setStatusBySchema(nextState, schema, id, true)
    },
    [DEL_ENTITY_SUCCESS]: (state, {schema, id = 'delete'}) => {
      return deleteDataBySchema(state, schema, id)
    },
    [DEL_ENTITY_FAILURE]: (state, {schema, id = 'delete', payload}) => {
      let nextState = setErrorsBySchema(state, schema, id, payload)
      return setStatusBySchema(nextState, schema, id, false)
    },

    // insert
    [INSERT_ENTITY]: (state, {schema, id = 'insert'}) => {
      let nextState = setErrorsBySchema(state, schema, id)
      return setStatusBySchema(nextState, schema, id, true)
    },
    [INSERT_ENTITY_SUCCESS]: (state, {schema, id = 'insert', payload}) => {
      let nextState = state
      if (id === 'insert') {
        nextState = deleteDataBySchema(nextState, schema, id)
      }

      if (typeof payload === 'object') {
        payload[schema.idAttribute] = payload[schema.idAttribute] || id
        let normalizeData = normalize(payload, schema)
        return addEntities(state, {payload: normalizeData.entities})
      } else {
        return setStatusBySchema(nextState, schema, id, false)
      }
    },
    [INSERT_ENTITY_FAILURE]: (state, {schema, id = 'insert', payload}) => {
      let nextState = setErrorsBySchema(state, schema, id, payload)
      return setStatusBySchema(nextState, schema, id, false)
    }
  })
}
