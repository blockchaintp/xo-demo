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
  container: {
    overflowY: 'auto',
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
  error: {
    color: '#880000',
  },
})

const PLAYER_OPTIONS = [{
  title: 'Player1',
  value: '1',
},{
  title: 'Player2',
  value: '2',
}]

class BatchInfo extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <Paper className={ classes.root }>
        <div className={ classes.container }>
          <Typography variant='title' className={ classes.title }>
            { this.props.title }
          </Typography>

          <Divider className={ classes.divider } />

          <Typography variant='body1'>
            Id: <span>{ this.props.id.substring(0, 16) }</span>
          </Typography>

          <Typography variant='body1'>
            Status: <b>{ this.props.status }</b>
          </Typography>

          {
            this.props.error ? (
              <Typography variant='body1'>
                Error: <b className={ classes.error }>{ this.props.error }</b>
              </Typography>
            ) : null
          }
        </div>

      </Paper>
    )
  }
}

BatchInfo.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(BatchInfo)