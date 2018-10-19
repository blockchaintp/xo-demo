import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'

const styles = theme => {
  return {
    root: {
      width: '100%',
    },
    table: {
      
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    toolbarRoot: {
      paddingRight: theme.spacing.unit,
    },
    button: {
      margin: theme.spacing.unit,
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 100%',
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    actions: {
      color: theme.palette.text.secondary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    title: {
      flex: '0 0 auto',
    },
    checkboxCell: {
      width: '1px'
    },
    autoCell: {
      width: 'auto'
    },
  }

}

class GenericTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      page: 0,
      rowsPerPage: 25,
      deleteIds: [],
      deleteOpen: false,
    };
  }

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setSelected(this.props.data(n => n.id))
    }
    else {
      this.setSelected([])  
    }
  }

  handleClick = (event, id) => {
    if(this.props.noSelect) return
    const selected = this.props.selected
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    this.props.setSelected(newSelected)
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => this.props.selected.indexOf(id) !== -1

  onDelete(ids) {
    if(this.props.onDeleteClick) {
      this.props.onDeleteClick(ids)
      return
    }
    if(!this.props.noSelect) {
      this.props.setSelected(ids)
    }
    else {
      this.setState({
        deleteIds: ids
      })
    }
    
    this.setState({
      deleteOpen: true,
    })
    return false
  }

  cancelOnDelete() {
    this.setState({
      deleteOpen: false,
    })
  }

  confirmOnDelete() {

    const submitIds = this.props.noSelect ?
      this.state.deleteIds :
      this.props.selected

    this.props.onDelete(submitIds)
    this.setState({
      deleteOpen: false,
      deleteIds: [],
    })
  }


  deleteConfirmDialog() {
    const { classes, title } = this.props

    const selected = this.props.noSelect ?
      this.state.deleteIds :
      this.props.selected

    const dialogContent = this.props.getDeleteDialogContent ?
      this.props.getDeleteDialogContent(selected) :
      (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete { selected.length } { title }{selected.length==1 ? '' : 's'}?
          </DialogContentText>
        </DialogContent>
      )

    const deleteOkDisabled = this.props.getDeleteOKDisabled ?
      this.props.getDeleteOKDisabled(selected) :
      false
    
    return (
      <Dialog
        open={this.state.deleteOpen}
        onClose={() => this.cancelOnDelete()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">Delete { title }{selected.length==1 ? '' : 's'}</DialogTitle>
          { dialogContent }
        <DialogActions>
          <Button 
            color="primary"
            onClick={ () => this.cancelOnDelete() }
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            variant="raised"
            autoFocus
            disabled={ deleteOkDisabled }
            onClick={ () => this.confirmOnDelete() }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  getAddButton() {
    const { classes } = this.props
    return this.props.getAddButton ? this.props.getAddButton() : (
      <Button className={classes.button} variant="raised" color="secondary" aria-label="Add" onClick={ () => this.props.onAdd() }>
        { this.props.addTitle || 'Add' }
        <AddIcon className={classes.rightIcon} />
      </Button>
    )
  }

  getActions(ids, toolbar) {
    const { classes } = this.props

    const addButton = this.getAddButton()

    const icons = this.props.icons || {}
    const tooltips = this.props.tooltips || {}

    const UseDeleteIcon = icons.delete || DeleteIcon
    const UseEditIcon = icons.edit || EditIcon

    const useDeleteTooltip = tooltips.delete || 'Delete'
    const useEditTooltip = tooltips.edit || 'Edit'

    return (
      <div className={classes.actions}>
        {ids.length > 0 ? [
          this.props.noDelete ? null : (
            <Tooltip disableFocusListener key="delete" title={ useDeleteTooltip }>
              <IconButton aria-label={ useDeleteTooltip } onClick={ () => this.onDelete(ids) }>
                <UseDeleteIcon />
              </IconButton>
            </Tooltip>
          ),
          (ids.length  == 1 ? (
            this.props.noEdit ? null : (
              <Tooltip key="edit" title={ useEditTooltip }>
                <IconButton aria-label={ useEditTooltip } onClick={ () => this.props.onEdit(ids[0]) }>
                  <UseEditIcon />
                </IconButton>
              </Tooltip>
            )
          ) : null),
        ].filter(c => c) : (
          this.props.noAdd ? null : addButton
        )}
        {
          this.props.getOptions ? this.props.getOptions(ids) : null
        }
      </div>
    )
  }

  render() {
    const { classes, selected, data, fields, title, pageTitle } = this.props
    const { order, orderBy, rowsPerPage, page } = this.state

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    return (
      <div className={classes.root}>
        { this.deleteConfirmDialog() }
        <Toolbar
          className={classNames(classes.toolbarRoot, {
            [classes.highlight]: this.props.noSelect ? false : selected.length > 0,
          })}
        >
          <div className={classes.title}>
            {!this.props.noSelect && selected.length > 0 ? (
              <Typography color="inherit" variant="subheading">
                {selected.length} selected
              </Typography>
            ) : (
              <Typography variant="title">{ pageTitle || title + 's' }</Typography>
            )}
          </div>
          <div className={classes.spacer} />
          { 
            this.props.noSelect ? (
              <div className={classes.actions}>
                { this.getAddButton() }
              </div>
            ) : 
            this.getActions(selected, true) }
        </Toolbar>



        <div className={classes.tableWrapper}>
          <Table className={classes.table}>



            <TableHead>
              <TableRow>
                {
                  this.props.noSelect ? null : (
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < data.length}
                        checked={selected.length > 0 && selected.length === data.length}
                        onChange={this.handleSelectAllClick}
                      />
                    </TableCell>
                  )
                }
                
                {
                  fields.map((field, i) => {
                    return (
                      <TableCell key={ i } numeric={ field.numeric }>
                        { field.title }
                      </TableCell>
                    )
                  })
                }
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>



            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow, i) => {
                const isSelected = this.props.noSelect ? false : this.isSelected(dataRow.id)
                return (
                  <TableRow
                    hover
                    key={ i }
                    onClick={ event => this.handleClick(event, dataRow.id) }
                    role="checkbox"
                    aria-checked={ isSelected }
                    tabIndex={ -1 }
                    
                    selected={ isSelected }
                  >
                    {
                      this.props.noSelect ? null : (
                        <TableCell padding="checkbox" className={ classes.checkboxCell }>
                          <Checkbox checked={isSelected} />
                        </TableCell>
                      )
                    }
                    {
                      fields.map((field, i) => {
                        return (
                          <TableCell key={ i } numeric={ field.numeric } className={ classes.autoCell }>
                            { dataRow[field.name] }
                          </TableCell>
                        )
                      })
                    }
                    <TableCell padding="checkbox" className={ classes.checkboxCell }>
                      { this.getActions([dataRow.id], false) }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>



          </Table>
        </div>



        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />



      </div>
    );
  }
}

GenericTable.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  pageTitle: PropTypes.string,
  data: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  getOptions: PropTypes.func,
  getAddButton: PropTypes.func,
  noAdd: PropTypes.bool,
  noDelete: PropTypes.bool,
  noEdit: PropTypes.bool,
  noSelect: PropTypes.bool,
}

export default withStyles(styles)(GenericTable)