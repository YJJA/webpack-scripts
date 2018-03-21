export const ADD_ENTITIES = '@@normalizr/ADD_ENTITIES'

export const LOAD_ENTITY = '@@normalizr/LOAD_ENTITY'
export const LOAD_ENTITY_SUCCESS = '@@normalizr/LOAD_ENTITY_SUCCESS'
export const LOAD_ENTITY_FAILURE = '@@normalizr/LOAD_ENTITY_FAILURE'

export const UPDATE_ENTITY = '@@normalizr/UPDATE_ENTITY'
export const UPDATE_ENTITY_SUCCESS = '@@normalizr/UPDATE_ENTITY_SUCCESS'
export const UPDATE_ENTITY_FAILURE = '@@normalizr/UPDATE_ENTITY_FAILURE'

export const DEL_ENTITY = '@@normalizr/DEL_ENTITY'
export const DEL_ENTITY_SUCCESS = '@@normalizr/DEL_ENTITY_SUCCESS'
export const DEL_ENTITY_FAILURE = '@@normalizr/DEL_ENTITY_FAILURE'

export const INSERT_ENTITY = '@@normalizr/INSERT_ENTITY'
export const INSERT_ENTITY_SUCCESS = '@@normalizr/INSERT_ENTITY_SUCCESS'
export const INSERT_ENTITY_FAILURE = '@@normalizr/INSERT_ENTITY_FAILURE'

export const add = (payload) => ({
  type: ADD_ENTITIES,
  payload
})

// load
export const load = (schema, id) => ({
  type: LOAD_ENTITY,
  schema,
  id
})

export const loadSuccess = (schema, id, payload) => ({
  type: LOAD_ENTITY_SUCCESS,
  schema,
  id,
  payload
})

export const loadFailure = (schema, id, payload) => ({
  type: UPDATE_ENTITY_FAILURE,
  schema,
  id,
  payload
})

// update
export const update = (schema, id) => ({
  type: UPDATE_ENTITY,
  schema,
  id
})

export const updateSuccess = (schema, id, payload) => ({
  type: UPDATE_ENTITY_SUCCESS,
  schema,
  id,
  payload
})

export const updateFailure = (schema, id, payload) => ({
  type: LOAD_ENTITY_FAILURE,
  schema,
  id,
  payload
})

// del
export const del = (schema, id) => ({
  type: DEL_ENTITY,
  schema,
  id
})

export const delSuccess = (schema, id) => ({
  type: DEL_ENTITY_SUCCESS,
  schema,
  id
})

export const delFailure = (schema, id, payload) => ({
  type: DEL_ENTITY_FAILURE,
  schema,
  id,
  payload
})

// insert
export const insert = (schema) => ({
  type: INSERT_ENTITY,
  schema
})

export const insertSuccess = (schema, payload) => ({
  type: INSERT_ENTITY_SUCCESS,
  schema,
  payload
})

export const insertFailure = (schema, payload) => ({
  type: INSERT_ENTITY_FAILURE,
  schema,
  payload
})

export default {
  add,
  load,
  loadSuccess,
  loadFailure,
  update,
  updateSuccess,
  updateFailure,
  del,
  delSuccess,
  delFailure,
  insert,
  insertSuccess,
  insertFailure
}
