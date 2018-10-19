import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
})

const TextField = ({
  input,
  label,
  type,
  name,
  classes,
  inputProps,
  description,
  disabled,
  storeError,
  meta: { touched, error, warning }
}) => {
  return (
    <FormControl
      fullWidth
      className={classes.margin}
      aria-describedby={ name + "-helper" }
      error={ touched && (error || storeError) ? true : false }
    >
      <InputLabel 
        htmlFor={ name }>{ label }</InputLabel>
      <Input
        id={ name }
        key={ name }
        type={ type }
        disabled={ disabled }
        error={ touched && (error || storeError) ? true : false }
        {...input}
        {...inputProps}
      />
      {
        touched && (error || storeError) ? (
          <FormHelperText id={ name + "-helper" }>
            { error || storeError }
          </FormHelperText>
        ) : null
      }
      {
        description ? (
          <FormHelperText error={ false } id={ name + "-description" }>
            { description }
          </FormHelperText>
        ) : null
      }
    </FormControl>
  )
}

export default withStyles(styles)(TextField)