import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

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
  }
})

class GameInfo extends React.Component {

  getPlayer(player, playerKeys) {
    const { 
      classes,
    } = this.props

    if(!playerKeys.game) {
      return (
        <Typography variant='body1'>
          Player{ player }: <b>unknown</b>
        </Typography>
      )
    }

    const playerType = playerKeys.game == playerKeys.local ? 'you' : 'someone else'
    return (
      <Typography variant='body1'>
        Player{ player }: <b className={ classes.smallText }>{ playerKeys.game.substring(0, 16) }</b> ({ playerType })
      </Typography>
    )
  }

  render() {
    const { classes } = this.props

    return (
      <Paper className={ classes.root }>
        <Typography variant='title' className={ classes.title }>
          { this.props.title }
        </Typography>

        { this.getPlayer(1, this.props.player1Keys) }
        { this.getPlayer(2, this.props.player2Keys) }

        <Button
          className={ classes.button }
          variant="raised" 
          onClick={ () => this.props.onBack() }
        >
          Back
        </Button>

      </Paper>
    )
  }
}

GameInfo.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(GameInfo)