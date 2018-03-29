import React from 'react'
import styled from 'styled-components'

import Title from '../../components/Title'

import banner from './banner.jpg'

const Banner = styled.img`
  height: 210px;
`

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
        <Banner src={banner} />
        {this.state.visible ? 'true' : 'false'}
      </div>
    )
  }
}

export default Home
