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
  }
})

class KeyEditor extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <Paper className={ classes.root }>
        <Typography variant='title' className={ classes.title }>
          { this.props.title }
        </Typography>

        <Typography variant='body1'>
          Private Key Hex: <b>{ this.props.privateKey }</b>
        </Typography>

        <Typography variant='body1'>
          Public Key Hex: <b>{ this.props.publicKey }</b>
        </Typography>

        <Button
          className={ classes.button }
          variant="raised" 
          color="secondary"
          onClick={ () => this.props.onRegenerate() }
        >
          Regenerate
        </Button>

      </Paper>
    )
  }
}

KeyEditor.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(KeyEditor)