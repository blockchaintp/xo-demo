import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import KeyEditor from '../components/KeyEditor'
import xoModule from '../store/xo'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.unit * 4,
    }
  }
}

@connectStore({
  xo: xoModule,
})
class Keys extends React.Component {

  componentDidMount() {
    //this.props.xo.loadKeys()
  }
  
  render() {

    const { 
      xo,
      classes, 
    } = this.props

    return (
      <div className={ classes.root }>
        <Grid 
          container 
          spacing={24}
        >
          <Grid item xs={12} sm={6}>
            <KeyEditor
              title='Player 1'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <KeyEditor
              title='Player 2'
            />
          </Grid>
        </Grid>
      </div>
    )
  }

}

Keys.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Keys)