import {denormalize} from 'normalizr'

export const allEntitiesSelecter = state => {
  return Object.keys(state.entities).reduce((result, key) => {
    result[key] = state.entities[key].entities
    return result
  }, {})
}

// entitiesSelecter
export const entitiesSelecter = (state, schema) => {
  const key = schema.key
  return state.entities[key].entities
}

// fetchStatusSelecter
export const fetchStatusSelecter = (state, schema) => {
  const key = schema.key
  return state.entities[key].fetchStatus
}

export const errorsSelecter = (state, schema) => {
  const key = schema.key
  return state.entities[key].errors
}

// entitiesSelecter
export const entitiesSelecterById = (state, schema, id) => {
  const key = schema.key
  const allEntities = allEntitiesSelecter(state)
  const entity = state.entities[key].entities[id] || {}
  return denormalize(entity, schema, allEntities)
}

// fetchStatusSelecter
export const fetchStatusSelecterById = (state, schema, id) => {
  const key = schema.key
  return state.entities[key].fetchStatus[id] || false
}

export const errorsSelecterById = (state, schema, id) => {
  const key = schema.key
  return state.entities[key].errors[id]
}
