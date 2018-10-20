import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { connectStore } from 'redux-box'
import { reduxForm, Field, isValid } from 'redux-form'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import Grid from '@material-ui/core/Grid'
import OpenIcon from '@material-ui/icons/OpenInNew'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import xoModule from '../store/xo'
import keysModule from '../store/keys'
import validatorModule from '../store/validator'

import GameInfo from '../components/GameInfo'
import GameBoard from '../components/GameBoard'
import TransactionList from '../components/TransactionList'

import validators from '../utils/validators'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.unit * 4,
    },
    paperPadding: {
      padding: '10px',
    },
  }
}

@connect(state => ({
  gameName: state.location.payload.name,
}))
@connectStore({
  xo: xoModule,
  keys: keysModule,
  validator: validatorModule,
})
class ViewGame extends React.Component {

  componentDidMount() {
    this.props.xo.loadGameLoopStart(this.props.gameName)
    this.props.validator.loadTransactionsLoopStart()
  }

  componentWillUnmount() {
    this.props.xo.loadGameLoopStop()
    this.props.validator.loadTransactionsLoopStop()
  }

  render() {

    const { 
      xo,
      validator,
      keys,
      classes, 
    } = this.props
    
    if(!xo.currentGame) return null

    const player1Keys = {
      local: keys.player1.public,
      game: xo.currentGame.player1Key,
    }

    const player2Keys = {
      local: keys.player2.public,
      game: xo.currentGame.player2Key,
    }

    return (
      <div className={ classes.root }>
        <Grid 
          container 
          spacing={24}
        >
          <Grid item xs={12} sm={3}>
            <div className={ classes.paperPadding }>
              <GameInfo
                title={ xo.currentGame.name }
                onBack={ () => xo.viewGames() }
                player1Keys={ player1Keys }
                player2Keys={ player2Keys }
                state={ xo.currentGame.state }
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={9}>
            <GameBoard
              gameState={ xo.currentGame.board }
            />
          </Grid>
        </Grid>
        <Grid 
          container 
          spacing={24}
        >
          <Grid item xs={12}>
            <div className={ classes.paperPadding }>
              <TransactionList
                transactions={ validator.transactions }
              />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }

}

ViewGame.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewGame)