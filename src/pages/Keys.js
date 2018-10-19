import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import KeyEditor from '../components/KeyEditor'
import xoModule from '../store/xo'
import keysModule from '../store/keys'

import keyUtils from '../utils/key'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.unit * 4,
    }
  }
}

@connectStore({
  xo: xoModule,
  keys: keysModule,
})
class Keys extends React.Component {
  
  render() {

    const {
      xo,
      keys,
      classes, 
    } = this.props

    const player1Keys = keyUtils.getHexKeys(keys.player1)
    const player2Keys = keyUtils.getHexKeys(keys.player2)

    return (
      <div className={ classes.root }>
        <Grid 
          container 
          spacing={24}
        >
          <Grid item xs={12} sm={6}>
            <KeyEditor
              title='Player 1'
              privateKey={ player1Keys.private }
              publicKey={ player1Keys.public }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <KeyEditor
              title='Player 2'
              privateKey={ player2Keys.private }
              publicKey={ player2Keys.public }
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