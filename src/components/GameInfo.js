import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import Radio from './Radio'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
  },
  smallText: {
    fontSize: '0.7em'
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
})

class GameInfo extends React.Component {

  getPlayer(player, playerKeys) {
    const { 
      classes,
    } = this.props

    if(!playerKeys.game) {
      return (
        <Typography variant='body1'>
          P{ player }: <b>unknown</b>
        </Typography>
      )
    }

    const playerType = playerKeys.game == this.props.player1Keys.local || playerKeys.game == this.props.player2Keys.local ? 'you' : 'external'
    return (
      <Typography variant='body1'>
        P{ player }: <span>{ playerKeys.game.substring(0, 16) }...</span> ({ playerType })
      </Typography>
    )
  }

  getMoveDescription(keys) {
    if(!keys.game || keys.game == keys.local) {
      return 'You can move!'
    }
    else {
      return 'Waiting for other player...'
    }
  }

  getNextMoveDescription() {
    const {
      player1Keys,
      player2Keys,
      state,
    } = this.props

    if(state == 'P1-NEXT') {
      return null
    }
    else if(state == 'P2-NEXT') {
      return null
    }
    else if(state == 'P1-WIN') {
      return 'P1 has won the game!'
    }
    else if(state == 'P2-WIN') {
      return 'P2 has won the game!'
    }
    else if(state == 'TIE') {
      return 'The game was a draw.'
    }
    else {
      return null
    }
  }

  getNextMove() {
    const { classes } = this.props
    const desc = this.getNextMoveDescription()

    if(!desc) return null

    return (
      <div>
        <Divider className={ classes.divider } />
        <Typography variant='body2'>
          { desc }
        </Typography>
      </div>
    )
  }

  render() {
    const { classes } = this.props

    const PLAYER_OPTIONS = [{
      title: `Key ${this.props.player1Keys.local.substring(0, 16)}...`,
      value: '1',
    },{
      title: `Key ${this.props.player2Keys.local.substring(0, 16)}...`,
      value: '2',
    }]


    return (
      <Paper className={ classes.root }>
        <Typography variant='title' className={ classes.title }>
          { this.props.title }
        </Typography>

        <Divider className={ classes.divider } />

        { this.getPlayer(1, this.props.player1Keys) }
        { this.getPlayer(2, this.props.player2Keys) }

        <Typography variant='body1'>
          State: <b>{ this.props.state }</b>
        </Typography>

        <Divider className={ classes.divider } />

        <div>
          <Radio
            options={ PLAYER_OPTIONS }
            input={{
              value: this.props.currentPlayer,
              onChange: (ev) => this.props.onChangeCurrentPlayer(ev.target.value),
            }}
            name='currentPlayer'
            label='Submit transaction as'
            description='Choose the key to submit a transaction as'
            meta={{
              touched: false,
              error: '',
              warning: '',
            }}
            compact
          />
        </div>

        { this.getNextMove() }
        
      </Paper>
    )
  }
}

GameInfo.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(GameInfo)