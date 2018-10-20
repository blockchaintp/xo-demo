import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  code: {
    fontSize: '0.8em'
  },
  codeWrapper: {
    overflow: 'auto'
  },
})

class TransactionList extends React.Component {

  render() {
    const { 
      classes,
      transactions,
    } = this.props

    return (
      <Paper className={ classes.root }>
        <Typography variant='title'>Raw Transactions</Typography>
        <Divider className={ classes.divider } />
        <div className={ classes.codeWrapper }>
          <pre className={ classes.code }>
            <code>
              { JSON.stringify(transactions, null, 4) }
            </code>
          </pre>
        </div>
      </Paper>
    )
  }
}

TransactionList.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(TransactionList)