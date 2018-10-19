import React from 'react'

import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVert from '@material-ui/icons/MoreVert'

import settings from '../settings'
import withRouter from '../utils/withRouter'

const styles = (theme) => ({
  
})

@withRouter()
class AppBarMenu extends React.Component {
  state = {
    anchorEl: null,
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  openPage = (url) => {
    this.handleClose()
    this.props.routerPush(url)
  }

  getMenu() {
    return [
      <MenuItem key='games' onClick={ () => this.openPage('PAGE_HOME') }>Games</MenuItem>,
      <MenuItem key='keys' onClick={ () => this.openPage('PAGE_KEYS') }>Keys</MenuItem>,
    ]
  }

  render() {
    const { classes } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div className={classes.root}>
        <IconButton
          aria-owns={open ? 'appbar-menu' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="appbar-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
          { this.getMenu() }
        </Menu>
      </div>
    )
  }
}

AppBarMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AppBarMenu)