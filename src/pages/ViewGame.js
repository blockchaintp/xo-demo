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
import Divider from '@material-ui/core/Divider'

import xoModule from '../store/xo'
import keysModule from '../store/keys'
import validatorModule from '../store/validator'

import GameInfo from '../components/GameInfo'
import BatchInfo from '../components/BatchInfo'
import GameBoard from '../components/GameBoard'
import TransactionList from '../components/TransactionList'
import TransactionTable from '../components/TransactionTable'

import validators from '../utils/validators'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.unit * 4,
    },
    paperPadding: {
      padding: '10px',
    },
    board: {
      textAlign: 'center',
    },
    divider: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
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
    this.props.xo.loadBatchStatusLoopStop()
    this.props.xo.setCurrentGame(null)
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
          <Grid item sm={12} md={3}>
            <div className={ classes.paperPadding }>
              <GameInfo
                title={ xo.currentGame.name }
                player1Keys={ player1Keys }
                player2Keys={ player2Keys }
                state={ xo.currentGame.state }
                currentPlayer={ xo.currentPlayer }
                onChangeCurrentPlayer={ xo.updateCurrentPlayer }
              />
            </div>
          </Grid>
          <Grid item sm={12} md={6} className={ classes.board }>
            <GameBoard
              gameState={ xo.currentGame.board }
              onMove={ (index) => xo.makeMove(index) }
            />
          </Grid>
          <Grid item sm={12} md={3}>
            {
              xo.lastTransactionStatus ? (
                <BatchInfo
                  title='Batch Status'
                  id={ xo.lastTransactionStatus.id }
                  status={ xo.lastTransactionStatus.status }
                  error={ xo.lastTransactionStatus.error }
                />
              ) : null
            }
            
          </Grid>
        </Grid>
        <Grid 
          container 
          spacing={24}
        >
          <Grid item xs={12} sm={6}>
            <div className={ classes.paperPadding }>
              <TransactionTable
                transactions={ validator.transactions }
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
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