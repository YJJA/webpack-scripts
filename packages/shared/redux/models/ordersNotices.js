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

// reducer
export default createReducer({}, {})

// action
export const fetchOrderNotice = (noticeId, query) => {
  return (dispatch, getState, {schema, actions, request}) => {
    dispatch(actions.update(schema.produceNotice, noticeId))

    return request
      .get('/ecback/produceNotices/list')
      .query(query)
      .then(payload => {
        dispatch(actions.updateSuccess(schema.produceNotice, noticeId, {...payload.data, id: noticeId}))
        return payload
      })
      .catch(payload => {
        dispatch(actions.updateFailure(schema.produceNotice, noticeId, payload))
        throw payload
      })
  }
}

export const updateOrderNotice = (noticeId, body) => {
  return (dispatch, getState, {schema, actions, request}) => {
    const state = getState()
    const produceNotice = orderNoticesSelecter(state, noticeId)
    dispatch(actions.update(schema.produceNotice, noticeId))

    return request
      .put(`/ecback/produceNotices/${produceNotice.id}`)
      .send(body)
      .then(payload => {
        dispatch(actions.updateSuccess(schema.produceNotice, noticeId))
      })
      .catch(payload => {
        dispatch(actions.updateFailure(schema.produceNotice, noticeId, payload))
        throw payload
      })
  }
}

export const fetchOrdersNoticesOptions = (noticeId, goodsSnapshotId) => {
  return (dispatch, getState, {schema, actions, request}) => {
    dispatch(actions.update(schema.produceNoticeOptions, noticeId))

    return request
      .get(`/ecback/produceNotices/${goodsSnapshotId}`)
      .then(payload => {
        dispatch(actions.updateSuccess(schema.produceNoticeOptions, noticeId, {list: payload.data}))
        return payload
      })
      .catch(payload => {
        dispatch(actions.updateFailure(schema.produceNoticeOptions, noticeId, payload))
        throw payload
      })
  }
}

export const updateOrdersNoticesOptions = (noticeId, optionSnapshotId, body) => {
  return (dispatch, getState, {schema, actions, request}) => {
    dispatch(actions.update(schema.produceNoticeOptions, noticeId))

    return request
      .put(`/ecback/produceNotices/update/${optionSnapshotId}`)
      .send(body)
      .then(payload => {
        dispatch(actions.updateSuccess(schema.produceNoticeOptions, noticeId))
        return payload
      })
      .catch(payload => {
        dispatch(actions.updateFailure(schema.produceNoticeOptions, noticeId, payload))
        throw payload
      })
  }
}

// selecter
export const orderNoticesSelecter = (state, id) => {
  return entitiesSelecterById(state, schema.produceNotice, id)
}

export const orderNoticesOptionsSelecter = (state, id) => {
  return entitiesSelecterById(state, schema.produceNoticeOptions, id)
}
