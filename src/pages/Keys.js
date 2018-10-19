import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

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
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      regenerateWindowOpen: false,
      regeneratePlayer: null,
    };
  }

  onRengenerateWindowClose() {
    this.setState({
      regenerateWindowOpen: false,
      regeneratePlayer: null,
    })
  }

  onRengenerateWindowConfirm() {
    const {
      keys,
    } = this.props
    keys.createKey(this.state.regeneratePlayer, true)
    this.setState({
      regenerateWindowOpen: false,
      regeneratePlayer: null,
    })
  }

  regenerateKeys(player) {
    this.setState({
      regenerateWindowOpen: true,
      regeneratePlayer: player,
    })
  }

  getRegenerateConfirmDialog() {
    const { classes } = this.props

    return (
      <Dialog
        open={ this.state.regenerateWindowOpen ? true : false }
        onClose={ () => this.onRengenerateWindowClose() }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Regenerate Keys?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Any games you are current playing as <strong>player{ this.state.regeneratePlayer }</strong> will no longer be playable.
          </DialogContentText>
          <DialogContentText>
            Are you sure you want to regenerate these keys?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            color="primary"
            onClick={ () => this.onRengenerateWindowClose() }
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            variant="raised"
            autoFocus
            onClick={ () => this.onRengenerateWindowConfirm() }
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }



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
              onRegenerate={ () => this.regenerateKeys(1) }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <KeyEditor
              title='Player 2'
              privateKey={ player2Keys.private }
              publicKey={ player2Keys.public }
              onRegenerate={ () => this.regenerateKeys(2) }
            />
          </Grid>
        </Grid>
        { this.getRegenerateConfirmDialog() }
      </div>
    )
  }

}

Keys.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Keys)