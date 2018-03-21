import superagent from 'superagent'
import mocker from 'superagent-mocker'

const mock = mocker(superagent)

mock.get('/manufactory/pictures', function(req) {
  return {
    status: 2000,
    data: {
      list: [
        {id: '1', src: 'group1/M00/00/03/wKgAL1pB736AELOQAAd1UDK2ArI579.png'},
        {id: '2', src: 'group1/M00/00/03/wKgAL1pB736AELOQAAd1UDK2ArI579.png'},
        {id: '3', src: 'group1/M00/00/03/wKgAL1pB736AELOQAAd1UDK2ArI579.png'},
        {id: '4', src: 'group1/M00/00/03/wKgAL1pB736AELOQAAd1UDK2ArI579.png'},
        {id: '5', src: 'group1/M00/00/03/wKgAL1pB736AELOQAAd1UDK2ArI579.png'}
      ],
      total: 4
    }
  }
})

mock.del('/manufactory/pictures', function(req) {
  return {
    status: 2000
  }
})
