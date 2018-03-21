/**
 * 图片管理 文件夹
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

// action types
const LOAD = 'mw/picfolders/LOAD'
const LOAD_SUCCESS = 'mw/picfolders/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/picfolders/LOAD_FAILURE'

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
export const fetchPicfolders = query => {
  return (dispatch, getState, {schema, actions, request}) => {
    dispatch({type: LOAD})
    return request
      .get('/ecback/folders')
      .query(query)
      .then(payload => {
        const data = normalize({list: payload.data}, {list: [schema.picfolders]})
        dispatch(actions.add(data.entities))
        dispatch({type: LOAD_SUCCESS, payload: data.result})
        return payload
      })
      .catch(payload => {
        dispatch({type: LOAD_FAILURE, payload})
        throw payload
      })
  }
}

export const insertPicfolders = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.picfolders, 'insert'))
  return request
    .post('/ecback/folders')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.picfolders, 'insert'))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.picfolders, 'insert', payload))
      throw payload
    })
}

export const updatePicfolders = (picfolderId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.picfolders, picfolderId))
  return request
    .put(`/ecback/folders/${picfolderId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.picfolders, picfolderId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.picfolders, picfolderId, payload))
      throw payload
    })
}

export const deletePicfolders = picfolderId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.picfolders, picfolderId))
  return request
    .del(`/ecback/folders/${picfolderId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.picfolders, picfolderId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.picfolders, picfolderId, payload))
      throw payload
    })
}

const recursion = (list, pid = 0) => {
  const parent = list.filter(item => item.parentId === pid)
  return parent.map(item => {
    const children = recursion(list, item.id)
    if (children.length) {
      item = {...item, children}
    }
    return item
  })
}

// selecter
export const picfoldersSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  const picfolders = denormalize(state.picfolders, {list: [schema.picfolders]}, entities)
  const list = recursion(picfolders.list)
  return {...picfolders, list}
}
