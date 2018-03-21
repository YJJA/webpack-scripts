import {normalize, denormalize} from 'normalizr'
import {createReducer, allEntitiesSelecter} from '../redux-normalizr'
import * as schema from '../schema'

// action type
const MATERIALS_REQUEST = 'mw/capacitiesList/MATERIALS_REQUEST'
const MATERIALS_SUCCESS = 'mw/capacitiesList/MATERIALS_SUCCESS'
const MATERIALS_FAILURE = 'mw/capacitiesList/MATERIALS_FAILURE'

const TECHNOLOGIES_REQUEST = 'mw/capacitiesList/TECHNOLOGIES_REQUEST'
const TECHNOLOGIES_SUCCESS = 'mw/capacitiesList/TECHNOLOGIES_SUCCESS'
const TECHNOLOGIES_FAILURE = 'mw/capacitiesList/TECHNOLOGIES_FAILURE'

const ADDLISTDATE_SUCCESS = 'mw/capacitiesList/ADDLISTDATE_SUCCESS'

const CANCELLISTDATE_SUCCESS = 'mw/capacitiesList/CANCELLISTDATE_SUCCESS'

const initialState = {
  isFetching: false,
  error: null,
  list: [],
  total: 0
}

// reducer
export default createReducer(initialState, {
  [MATERIALS_REQUEST]: (state) => {
    return {...state, isFetching: true, error: null}
  },
  [TECHNOLOGIES_REQUEST]: (state) => {
    return {...state, isFetching: true, error: null}
  },
  [MATERIALS_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      list: payload.list,
      total: payload.total,
      isFetching: false
    }
  },
  [TECHNOLOGIES_SUCCESS]: (state, {payload}) => {
    return {
      ...state,
      list: payload.list,
      total: payload.total,
      isFetching: false
    }
  },
  [ADDLISTDATE_SUCCESS]: (state, {payload}) => {
    return {...state, ...payload, isFetching: false}
  },
  [CANCELLISTDATE_SUCCESS]: (state, {payload}) => {
    return {...state, ...payload, isFetching: false}
  },
  [MATERIALS_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: false, error: payload}
  },
  [TECHNOLOGIES_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: false, error: payload}
  }
})

// action
export const fetchCapacitysMaterials = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({ type: MATERIALS_REQUEST })
  return request
    .get('/ecback/capacitys/materia')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.capacities]})
      dispatch(actions.add(data.entities))
      dispatch({ type: MATERIALS_SUCCESS, payload: data.result })
      return payload
    })
    .catch(payload => {
      dispatch({ type: MATERIALS_FAILURE, payload })
      throw payload
    })
}

export const fetchCapacitysTechnologies = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({ type: TECHNOLOGIES_REQUEST })
  return request
    .get('/ecback/capacitys/technics')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.capacities]})
      dispatch(actions.add(data.entities))
      dispatch({ type: TECHNOLOGIES_SUCCESS, payload: data.result })
      return payload
    })
    .catch(payload => {
      dispatch({ type: TECHNOLOGIES_FAILURE, payload })
      throw payload
    })
}

export const updateCapacitiesList = (capacitiesId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.capacities, capacitiesId))
  return request
    .put(`/ecback/capacity/${capacitiesId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.capacities, capacitiesId, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.capacities, capacitiesId, payload))
      throw payload
    })
}

export const deleteCapacitiesList = capacitiesId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.capacities, capacitiesId))
  return request
    .del(`/ecback/capacity/${capacitiesId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.capacities, capacitiesId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.capacities, capacitiesId, payload))
      throw payload
    })
}

export const addListData = capacities => (dispatch, getState, {schema, actions}) => {
  const data = normalize(capacities, {list: [schema.capacities]})
  dispatch(actions.add(data.entities))
  dispatch({type: ADDLISTDATE_SUCCESS, payload: data.result})
}

export const cancelListData = capacities => (dispatch, getState, {schema, actions}) => {
  const data = normalize(capacities, {list: [schema.capacities]})
  dispatch(actions.add(data.entities))
  dispatch({type: CANCELLISTDATE_SUCCESS, payload: data.result})
}

export const addCapacitiesList = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.capacities))
  return request
    .post('/ecback/capacity')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.capacities, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.capacities, payload))
      throw payload
    })
}

export const capacitiesSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  console.log(state)
  console.log({list: [schema.capacities]})
  console.log(entities)
  return denormalize(state.capacities, {list: [schema.capacities]}, entities)
}
