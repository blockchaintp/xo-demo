import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

const styles = theme => ({
  root: {
    
  },
})

class GenericTableSimple extends React.Component {

  render() {
    const { 
      classes,
      fields,
      data,
    } = this.props

    return (
      <Table>
        <TableHead>
          <TableRow>
            {
              fields.map((field, i) => {
                return (
                  <TableCell key={ i }>
                    { field.title }
                  </TableCell>
                )
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            data.map((dataRow, i) => {
              return (
                <TableRow
                  hover
                  key={ i }
                >
                  {
                    fields.map((field, i) => {
                      return (
                        <TableCell key={ i }>
                          { dataRow[field.name] }
                        </TableCell>
                      )
                    })
                  }
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )
  }
}

GenericTableSimple.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(GenericTableSimple)