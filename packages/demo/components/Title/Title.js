import React from 'react'
import PropTypes from 'prop-types'

function Title(props) {
  return (
    <h1 data-testid="title">{props.children}</h1>
  )
}

Title.propTypes = {
  children: PropTypes.string
}

export default Title
