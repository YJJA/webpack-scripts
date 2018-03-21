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
const LOAD = 'mw/categories/LOAD'
const LOAD_SUCCESS = 'mw/categories/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/categories/LOAD_FAILURE'

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

const flattening = (list) => {
  if (!list || !list.length) {
    return []
  }
  return list.reduce((result, item) => {
    const {children, ...newItem} = item
    result.push(newItem)
    return [...result, ...flattening(children)]
  }, [])
}

const recursionCategory = (list, pid = 0) => {
  const parent = list.filter(item => item.categoryPid === pid)
  return parent.map(item => {
    const children = recursionCategory(list, item.id)
    if (children.length) {
      item = {...item, children}
    }
    return item
  })
}

// actions
export const fetchCategories = query => {
  return (dispatch, getState, {schema, actions, request}) => {
    dispatch({type: LOAD})
    return request
      .get('/manufactory/categories')
      .query(query)
      .then(payload => {
        payload.data.list = flattening(payload.data.list)
        const data = normalize(payload.data, {list: [schema.category]})
        dispatch(actions.add(data.entities))
        dispatch({type: LOAD_SUCCESS, payload: data.result})
      })
      .catch(payload => {
        dispatch({type: LOAD_FAILURE, payload})
        throw payload
      })
  }
}

export const fetchCategoriesOne = categoryId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.category, categoryId))
  return request
    .get(`/manufactory/categories/${categoryId}`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.category, categoryId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.category, categoryId, payload))
      throw payload
    })
}

export const insertCategories = body => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.insert(schema.category, 'insert'))
  return request
    .post('/manufactory/categories')
    .send(body)
    .then(payload => {
      dispatch(actions.insertSuccess(schema.category, 'insert'))
      return payload
    })
    .catch(payload => {
      dispatch(actions.insertFailure(schema.category, 'insert', payload))
      throw payload
    })
}

export const updateCategories = (categoryId, body) => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.category, categoryId))
  return request
    .put(`/manufactory/categories/${categoryId}`)
    .send(body)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.category, categoryId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.category, categoryId, payload))
      throw payload
    })
}

export const deleteCategories = categoryId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.del(schema.category, categoryId))
  return request
    .del(`/manufactory/categories/${categoryId}`)
    .then(payload => {
      dispatch(actions.delSuccess(schema.category, categoryId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.delFailure(schema.category, categoryId, payload))
      throw payload
    })
}

// 升序
export const orderUpCategories = categoryId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.category, categoryId))
  return request
    .put(`/manufactory/categories/${categoryId}/orderup`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.category, categoryId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.category, categoryId, payload))
      throw payload
    })
}

// 降序
export const orderDownCategories = categoryId => (dispatch, getState, {schema, actions, request}) => {
  dispatch(actions.update(schema.category, categoryId))
  return request
    .put(`/manufactory/categories/${categoryId}/orderdown`)
    .then(payload => {
      dispatch(actions.updateSuccess(schema.category, categoryId))
      return payload
    })
    .catch(payload => {
      dispatch(actions.updateFailure(schema.category, categoryId, payload))
      throw payload
    })
}

// selecter
export const categoriesSelecter = (state) => {
  const entities = allEntitiesSelecter(state)
  const categories = denormalize(state.categories, {list: [schema.category]}, entities)
  const list = recursionCategory(categories.list)
  return {...categories, list}
}

export const categorySelecter = (state) => {
  return entitiesSelecter(state, schema.category)
}
