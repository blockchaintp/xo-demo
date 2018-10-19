import { connect } from 'react-redux'
import { touch, initialize } from 'redux-form'

const ConnectForm = () => {
  return connect(
    state => ({
      
    }),
    dispatch => ({
      formTouch: (form, fields) => dispatch(touch(form, fields)),
      initialiseForm: (form, values) => dispatch(initialize(form, values)),
    })
  )
}

export default ConnectForm