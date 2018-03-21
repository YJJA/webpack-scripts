import {normalize, denormalize} from 'normalizr'
import {createReducer, allEntitiesSelecter} from '../redux-normalizr'
import * as schema from '../schema'

// action type
const LOAD_REQUEST = 'mw/equipments/LOAD_REQUEST'
const LOAD_SUCCESS = 'mw/equipments/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/equipments/LOAD_FAILURE'

const ADDLISTDATE_SUCCESS = 'mw/equipments/ADDLISTDATE_SUCCESS'

const CANCELLISTDATE_SUCCESS = 'mw/equipments/CANCELLISTDATE_SUCCESS'

const initialState = {
  isFetching: false,
  error: null,
  list: [],
  total: 0
}

// reducer
export default createReducer(initialState, {
  [LOAD_REQUEST]: (state) => {
    return {...state, isFetching: true, error: null}
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
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
  [LOAD_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: false, error: payload}
  }
})

// action
export const fetchEquipments = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({ type: LOAD_REQUEST })
  return request
    .get('/ecback/equipments')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.equipments]})
      dispatch(actions.add(data.entities))
      dispatch({type: LOAD_SUCCESS, payload: data.result})
      return payload
    })
    .catch(payload => {
      dispatch({ type: LOAD_FAILURE, payload })
      throw payload
    })
}

export const updateEquipments = (equipmentsId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.equipments, equipmentsId))
  return request
    .put(`/ecback/equipment/${equipmentsId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.equipments, equipmentsId, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.equipments, equipmentsId, payload))
      throw payload
    })
}

export const deleteEquipments = equipmentsId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.equipments, equipmentsId))
  return request
    .del(`/ecback/equipment/${equipmentsId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.equipments, equipmentsId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.equipments, equipmentsId, payload))
      throw payload
    })
}

export const addListData = equipments => (dispatch, getState, {schema, actions}) => {
  const data = normalize(equipments, {list: [schema.equipments]})
  dispatch(actions.add(data.entities))
  dispatch({type: ADDLISTDATE_SUCCESS, payload: data.result})
}

export const cancelListData = equipments => (dispatch, getState, {schema, actions}) => {
  const data = normalize(equipments, {list: [schema.equipments]})
  dispatch(actions.add(data.entities))
  dispatch({type: CANCELLISTDATE_SUCCESS, payload: data.result})
}

export const addEquipments = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.equipments))
  return request
    .post('/ecback/equipment')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.equipments, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.equipments, payload))
      throw payload
    })
}

// selecter
export const equipmentsSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.equipments, {list: [schema.equipments]}, entities)
}
