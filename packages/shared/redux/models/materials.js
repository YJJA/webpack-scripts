import {normalize, denormalize} from 'normalizr'
import {createReducer, allEntitiesSelecter} from '../redux-normalizr'
import * as schema from '../schema'

// action type
const ADDLISTDATE_SUCCESS = 'mw/materials/ADDLISTDATE_SUCCESS'

const CANCELLISTDATE_SUCCESS = 'mw/materials/CANCELLISTDATE_SUCCESS'

const UNIT_REQUEST = 'mw/materials/UNIT_REQUEST'
const UNIT_SUCCESS = 'mw/materials/UNIT_SUCCESS'
const UNIT_FAILURE = 'mw/materials/UNIT_FAILURE'

const LOAD = 'mw/materials/LOAD'
const LOAD_SUCCESS = 'mw/materials/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/materials/LOAD_FAILURE'

const initialState = {
  isFetching: false,
  error: null,
  list: [],
  total: 0,
  unit: []
}

// reducer
export default createReducer(initialState, {
  [LOAD]: (state) => {
    return {...state, isFetching: true, error: null}
  },
  [UNIT_REQUEST]: (state) => {
    return {...state, isFetching: true, error: null}
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      isFetching: false,
      list: payload.list,
      total: payload.total
    }
  },
  [UNIT_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      isFetching: false,
      unit: payload.UNIT
    }
  },
  [ADDLISTDATE_SUCCESS]: (state, {payload}) => {
    return {...state, ...payload, isFetching: false}
  },
  [CANCELLISTDATE_SUCCESS]: (state, {payload}) => {
    return {...state, ...payload, isFetching: false}
  },
  [LOAD_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: false, error: payload}
  },
  [UNIT_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: false, error: payload}
  }
})

// action
export const fetchMaterials = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: LOAD})
  return request
    .get('/ecback/materials')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.materials]})

      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({type: LOAD_FAILURE, payload})
      throw payload
    })
}

export const addMaterials = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.materials))
  return request
    .post('/ecback/material')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.materials, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.materials, payload))
      return payload
    })
}

export const updateMaterials = (materialId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.materials, materialId))
  return request
    .put(`/ecback/material/${materialId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.materials, materialId, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.materials, materialId, payload))
      throw payload
    })
}

export const deleteMaterials = materialId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.materials, materialId))
  return request
    .del(`/ecback/material/${materialId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.materials, materialId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.materials, materialId, payload))
      throw payload
    })
}

export const addListData = materials => (dispatch, getState, {schema, actions}) => {
  const data = normalize(materials, {list: [schema.materials]})
  dispatch(actions.add(data.entities))
  dispatch({type: ADDLISTDATE_SUCCESS, payload: data.result})
}

export const cancelListData = materials => (dispatch, getState, {schema, actions}) => {
  const data = normalize(materials, {list: [schema.materials]})
  dispatch(actions.add(data.entities))
  dispatch({type: CANCELLISTDATE_SUCCESS, payload: data.result})
}

export const fetchUnit = () => (dispatch, getState, {schema, actions, request}) => {
  dispatch({type: UNIT_REQUEST})
  return request
    .get('/manufactory/datas')
    .query({dataType: 'UNIT'})
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.unit]})

      dispatch(actions.add(data.entities))
      dispatch({type: UNIT_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({ type: UNIT_FAILURE, payload })
      throw payload
    })
}

// selecter
export const materialsSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.materials, {list: [schema.materials]}, entities)
}
