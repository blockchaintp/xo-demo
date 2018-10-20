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
    cursor: 'pointer',
  },
  cellPaper: {
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

class GameBoard extends React.Component {

  getCellContents(cell) {
    const {
      classes,
    } = this.props
    return (
      <div className={ classes.cellContents }>
        { cell.code == '-' ? '' : cell.code }
      </div>
    )
  }

  getCell(cell, j) {
    const {
      classes,
    } = this.props
    return (
      <div 
        className={ classes.cell } 
        key={ j }
        onClick={ () => {
          this.clickCell(cell.index)
        } }
      >
        <Paper className={ classes.cellPaper }>
          { this.getCellContents(cell) }
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

  clickCell(index) {
    this.props.onMove(index)
  }

  render() {
    const { 
      classes,
      gameState,
    } = this.props

    const cells = gameState.split('')

    const rows = cells.reduce((all, code, index) => {
      if(index % 3 == 0) {
        all.push([])
      }
      const currentRow = all[all.length-1]
      currentRow.push({
        code,
        index,
      })
      return all
    }, [])

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