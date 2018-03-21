/**
 * 图片管理
 */

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

import '../mocks/pictures'

// action types
const LOAD = 'mw/pictures/LOAD'
const LOAD_SUCCESS = 'mw/pictures/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/pictures/LOAD_FAILURE'

const initialState = {
  isFetching: false,
  list: [],
  total: 0,
  error: null
}

// reducer
export default createReducer(initialState, {
  [LOAD]: (state, action) => {
    return {...state, isFetching: true, error: null}
  },
  [LOAD_SUCCESS]: (state, {payload}) => {
    return {...state, list: payload.list, total: payload.total}
  },
  [LOAD_FAILURE]: (state, {payload}) => {
    return {...state, isFetching: true, error: payload}
  }
})

// actions
export const fetchPictures = query => {
  return (dispatch, getState, {schema, actions, request}) => {
    dispatch({type: LOAD})
    return request
      .get('/ecback/folders/pictures')
      .query(query)
      .then(payload => {
        const data = normalize({list: payload.data}, {list: [schema.pictures]})
        dispatch(actions.add(data.entities))
        dispatch({type: LOAD_SUCCESS, payload: data.result})
      })
      .catch(payload => {
        dispatch({type: LOAD_FAILURE, payload})
        throw payload
      })
  }
}

export const insertPictures = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.pictures, 'insert'))
  return request
    .post('/ecback/folders/pictures')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.pictures, 'insert'))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.pictures, 'insert', payload))
      throw payload
    })
}

export const deletePictures = pictureIds => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.pictures, 'delete'))
  return request
    .del(`/ecback/folders/pictures`)
    .send(pictureIds)
    .then(payload => {
      dispatch(actions.delSuccess(schema.pictures, 'delete'))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.pictures, 'delete', payload))
      throw payload
    })
}

// selecter
export const picturesSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  const pictures = denormalize(state.pictures, {list: [schema.pictures]}, entities)
  return pictures
}
