import React from 'react'

import Title from '../../components/Title'

class Home extends React.Component {
  render() {
    return (
      <div>
        <Title>{this.state.title}</Title>
      </div>
    )
  }
}

export default Home
