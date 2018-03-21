import superagent from 'superagent'
import mocker from 'superagent-mocker'

const mock = mocker(superagent)

const data = {
  list: [
    {
      id: 1,
      employeeName: '许褚1',
      employeeMobile: '18201010101',
      employeeRole: '运营管理员、库存管理元',
      status: 0
    },
    {
      id: 2,
      employeeName: '许褚2',
      employeeMobile: '13432343232',
      employeeRole: '运营管理员',
      status: 1
    },
    {
      id: 3,
      employeeName: '许褚3',
      employeeMobile: '13432343232',
      employeeRole: '库存管理元',
      status: 2
    }
  ]
}

let id = data.list.length
const getId = () => {
  return ++id
}

mock.get('/ecback/staff', function(req) {
  return {
    status: 2000,
    data: data
  }
})

mock.del('/ecback/staff', function(req) {
  return {
    status: 2000
  }
})

mock.post('/ecback/staff', function(req) {
  data.list.push({
    id: getId(),
    ...req.body
  })
  return {
    status: 2000
  }
})
