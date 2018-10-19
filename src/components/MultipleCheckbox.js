import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
})

class MultipleCheckbox extends React.Component {

  handleChange = name => event => {
    const value = this.props.input.value || []
    const stripped = value.filter(v => v != name)
    if(event.target.checked) {
      stripped.push(name)
    }
    this.props.input.onChange(stripped)
  }

  render() {
    const {
      input,
      label,
      type,
      name,
      classes,
      inputProps,
      description,
      disabled,
      meta: { touched, error, warning },
      options,
    } = this.props

    const value = input.value || []

    return (
      <FormControl 
        required
        error={ touched && error ? true : false }
        component="fieldset"
        className={classes.formControl}
      >
        <FormLabel component="legend">{ label }</FormLabel>
        <FormGroup>
          {
            options.map((option, i) => (
              <FormControlLabel
                key={ i }
                control={
                  <Checkbox
                    checked={ value.indexOf(option.value) >= 0 }
                    onChange={ this.handleChange(option.value) }
                    value={ option.value }
                    disabled={ this.props.disabled }
                  />
                }
                label={ option.title }
              />
            ))
          }
        </FormGroup>
        {
          touched && error ? (
            <FormHelperText id={ name + "-helper" }>
              { error }
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
}

export default withStyles(styles)(MultipleCheckbox)