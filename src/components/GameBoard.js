import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    
  },
  cell: {
    display: 'inline-block',
    padding: '10px',
  },
  cellPaper: {
    width: '100px',
    height: '100px',

  }
})

class GameBoard extends React.Component {

  getCell(cell, j) {
    const {
      classes,
    } = this.props
    return (
      <div className={ classes.cell } key={ j }>
        <Paper className={ classes.cellPaper }>
          { cell }
        </Paper>
      </div>
    )
  }

  getRow(row, i) {
    const {
      classes,
    } = this.props
    return (
      <div key={ i }>
        {
          row.map((cell, j) => this.getCell(cell, j))
        }
      </div>
    )
  }

  render() {
    const { 
      classes,
      gameState,
    } = this.props

    const cells = gameState.split('')

    const rows = cells.reduce((all, cell, i) => {
      if(i % 3 == 0) {
        all.push([])
      }
      const currentRow = all[all.length-1]
      currentRow.push(cell)
      return all
    }, [])

    console.log('-------------------------------------------');
    console.dir(rows)

    return (
      <div>
        {
          rows.map((row, i) => this.getRow(row, i))
        }
      </div>
    )
  }
}

GameBoard.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(GameBoard)