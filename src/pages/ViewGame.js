import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { connectStore } from 'redux-box'
import { reduxForm, Field, isValid } from 'redux-form'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import OpenIcon from '@material-ui/icons/OpenInNew'
import Button from '@material-ui/core/Button'

import xoModule from '../store/xo'

import validators from '../utils/validators'

const styles = theme => {
  return {
    
  }
}

@connectStore({
  xo: xoModule,
})
class ViewGame extends React.Component {

  componentDidMount() {
    
  }

  render() {

    const { 
      xo,
      classes, 
    } = this.props
    
    return (
      <div>
        View Game
      </div>
    )
  }

}

ViewGame.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewGame)