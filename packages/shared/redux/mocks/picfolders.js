import superagent from 'superagent'
import mocker from 'superagent-mocker'

const mock = mocker(superagent)

const list = [
  {id: 1, parentId: 0, title: '文件夹1'},
  {id: 2, parentId: 1, title: '文件夹2'}
]

let id = list.length
const getId = () => {
  return ++id
}

mock.get('/manufactory/picfolders', function(req) {
  console.log(list)
  return {
    status: 2000,
    data: list
  }
})

mock.del('/manufactory/picfolders', function(req) {
  return {
    status: 2000
  }
})

mock.post('/manufactory/picfolders', function(req) {
  list.push({
    id: getId(),
    ...req.body
  })
  return {
    status: 2000
  }
})
