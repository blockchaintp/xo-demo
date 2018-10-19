import React from 'react'

import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import IconButton from '@material-ui/core/IconButton'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu'

import settings from '../settings'
import withRouter from '../utils/withRouter'
import store from '../store'
import selectors from '../store/selectors'

const styles = (theme) => ({
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 250,
  },
})

@withRouter()
class SideMenu extends React.Component {
  state = {
    drawerOpen: false,
  }

  handleOpen = event => {
    this.setState({ drawerOpen: true })
  }

  handleClose = () => {
    this.setState({ drawerOpen: false })
  }

  openPage = (url) => {
    this.handleClose()
    this.props.routerPush(url)
  }

  getMenu() {
    return [
      <ListItem button key='games' onClick={ () => this.openPage('PAGE_HOME') }>
        <ListItemText primary="Games" />
      </ListItem>,
      <ListItem button key='keys' onClick={ () => this.openPage('PAGE_KEYS') }>
        <ListItemText primary="Keys" />
      </ListItem>
    ]
  }

  render() {
    const { classes } = this.props
    const { drawerOpen } = this.state

    return (
      <div>
        <IconButton 
          className={classes.menuButton} 
          color="inherit" 
          aria-label="Menu" 
          onClick={this.handleOpen}
        >
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          open={ drawerOpen }
          onClose={ this.handleClose }
          onOpen={ this.handleOpen }
        >
          <div
            tabIndex={0}
            role="button"
            onClick={ this.handleClose }
            onKeyDown={ this.handleClose }
          >
            <div className={classes.list}>
              <List component="nav">
                { this.getMenu() }
              </List>
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    )
  }
}

SideMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SideMenu)