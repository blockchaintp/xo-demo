import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { connectStore } from 'redux-box'
import { reduxForm, Field, isValid } from 'redux-form'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import OpenIcon from '@material-ui/icons/OpenInNew'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'


import TextField from '../components/TextField'
import GenericTable from '../components/GenericTable'

import xoModule from '../store/xo'

import validators from '../utils/validators'

const styles = theme => {
  return {
    
  }
}

@reduxForm({
  form: 'gameForm',
  initialValues: {
    name: '',
  },
})
@connect(state => ({
  formValid: isValid('gameForm')(state),
}))
@connectStore({
  xo: xoModule,
})
class GameList extends React.Component {

  componentDidMount() {
    this.props.xo.loadGameLoopStart()
  }

  componentWillUnmount() {
    this.props.xo.loadGameLoopStop()
  }

  closeNewGameWindow() {
    const { xo } = this.props
    xo.setNewGameWindowOpen(false)
    xo.resetNewGameForm()
  }
  
  getNewGameDialog() {
    const { classes, formValid, xo } = this.props

    return (
      <Dialog
        open={ xo.newGameWindowOpen }
        onClose={ () => this.closeNewGameWindow() }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Game</DialogTitle>
        <DialogContent>
          <Field
            name="name"
            component={ TextField }
            label="Name"
            description="The name for your game"
            validate={ validators.required }
            disabled={ this.props.submitting }
            storeError={ xo.newGameError }
          />
        </DialogContent>
        <DialogActions>
          <Button 
            color="primary"
            onClick={ () => this.closeNewGameWindow() }
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            variant="raised"
            autoFocus
            onClick={ () => xo.submitNewGameForm() }
            disabled={ formValid ? false : true }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {

    const { 
      xo,
      classes, 
    } = this.props
    
    const fields =[{
      title: 'Name',
      name: 'id',
    },{
      title: 'Address',
      name: 'address',
    },{
      title: 'State',
      name: 'state',
    },{
      title: 'Board',
      name: 'board',
    }]


    const data = xo.games.map(gameData => {
      return {
        id: `${gameData.name}`,
        address: `${gameData.address}`,
        board: `${gameData.board}`,
        state: `${gameData.state}`,
      }
    })

    return (
      <div>
        <GenericTable
          title="Game"
          noSelect
          data={ data }
          fields={ fields }
          addTitle='Create'
          icons={{
            edit: OpenIcon
          }}
          tooltips={{
            edit: 'View'
          }}
          onAdd={ () => xo.setNewGameWindowOpen(true) }
          onDelete={ (ids) => xo.deleteGame(ids[0]) }
          onEdit={ (id) => xo.viewGame(id) }
          getOptions={ () => null }
        />
        { this.getNewGameDialog() }
      </div>
    )
  }

}

GameList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameList)