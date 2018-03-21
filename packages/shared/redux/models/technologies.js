import {normalize, denormalize} from 'normalizr'
import {createReducer, allEntitiesSelecter} from '../redux-normalizr'
import * as schema from '../schema'

// action type
const LOAD_REQUEST = 'mw/technologies/LOAD_REQUEST'
const LOAD_SUCCESS = 'mw/technologies/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/technologies/LOAD_FAILURE'

const ADDLISTDATE_SUCCESS = 'mw/technologies/ADDLISTDATE_SUCCESS'

const CANCELLISTDATE_SUCCESS = 'mw/technologies/CANCELLISTDATE_SUCCESS'

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
export const fetchTechnologies = query => (dispatch, getState, {schema, actions, request}) => {
  dispatch({ type: LOAD_REQUEST })
  return request
    .get('/ecback/technics')
    .query(query)
    .then(payload => {
      const data = normalize(payload.data, {list: [schema.technologies]})
      dispatch(actions.add(data.entities))
      dispatch({ type: LOAD_SUCCESS, payload: data.result })
      return payload
    })
    .catch(payload => {
      dispatch({ type: LOAD_FAILURE, payload })
      throw payload
    })
}

export const updateTechnologies = (technologiesId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.technologies, technologiesId))
  return request
    .put(`/ecback/technics/${technologiesId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.technologies, technologiesId, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.technologies, technologiesId, payload))
      throw payload
    })
}

export const deleteTechnologies = technologiesId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.technologies, technologiesId))
  return request
    .del(`/ecback/technics/${technologiesId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.technologies, technologiesId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.technologies, technologiesId, payload))
      throw payload
    })
}

export const addListData = technologies => (dispatch, getState, {schema, actions}) => {
  const data = normalize(technologies, {list: [schema.technologies]})
  dispatch(actions.add(data.entities))
  dispatch({type: ADDLISTDATE_SUCCESS, payload: data.result})
}

export const cancelListData = technologies => (dispatch, getState, {schema, actions}) => {
  const data = normalize(technologies, {list: [schema.technologies]})
  dispatch(actions.add(data.entities))
  dispatch({type: CANCELLISTDATE_SUCCESS, payload: data.result})
}

export const addTechnologies = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.technologies))
  return request
    .post('/ecback/technics')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.technologies, payload))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.technologies, payload))
      throw payload
    })
}

// selecter
export const technologiesSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  return denormalize(state.technologies, {list: [schema.technologies]}, entities)
}
