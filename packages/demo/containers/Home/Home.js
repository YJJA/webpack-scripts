import React from 'react'

import Title from '../../components/Title'

class Home extends React.Component {
  state = {
    title: 'this is Home Page!'
  }
  render() {
    return (
      <div>
        <Title>{this.state.title}</Title>
        <div>Home Page</div>
      </div>
    )
  }
}

export default Home
