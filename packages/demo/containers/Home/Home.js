import React from 'react'

import Title from '../../components/Title'

class Home extends React.Component {
  state = {
    title: 'this is Home Page!',
    visible: false
  }

  onVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  }

  render() {
    return (
      <div>
        <Title>{this.state.title}</Title>
        <button onClick={this.onVisible}>切换</button>
        {this.state.visible ? 'true' : 'false'}
      </div>
    )
  }
}

export default Home
