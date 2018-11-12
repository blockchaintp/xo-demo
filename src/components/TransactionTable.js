import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import GenericTableSimple from './GenericTableSimple'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  tableContainer: {
    overflowX: 'auto',
  }
})

class TransactionTable extends React.Component {

  render() {
    const { 
      classes,
      transactions,
    } = this.props


    const fields =[{
      title: 'Payload',
      name: 'payload',
    },{
      title: 'Signer',
      name: 'signer',
    },{
      title: 'Signature',
      name: 'signature',
    }]

    const data = transactions
      .map(transaction => {
        return {
          payload: atob(transaction.payload),
          signature: transaction.header_signature.substring(0, 16),
          signer: transaction.header.signer_public_key.substring(0, 16),
        }
      })

    return (
      <Paper className={ classes.root }>
        <Typography variant='title'>Transaction List</Typography>
        <Typography variant='body1'>(the 10 most recent transactions)</Typography>
        <Divider className={ classes.divider } />
        <div className={ classes.tableContainer }>
          <GenericTableSimple
            fields={ fields }
            data={ data }
          />
        </div>
      </Paper>
    )
  }
}

TransactionTable.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(TransactionTable)