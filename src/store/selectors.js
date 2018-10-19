const router = {
  payload: (state) => state.location.payload,
  currentPage: (state) => state.location.type,
  currentRoute: (state) => {
    const pageName = router.currentPage(state)
    return state.location.routesMap[pageName]
  }
}

const form = {
  data: (state, formName) => state.form[formName] || {},
  fieldNames: (state, formName) => {
    const formData = form.data(state, formName)
    const allFields = formData.registeredFields || {}
    return Object.keys(allFields)
  },
  values: (state, formName) => {
    const formData = form.data(state, formName)
    return formData.values || {}
  },
  errors: (state, formName) => {
    const formData = form.data(state, formName)
    return formData.syncErrors || {}
  },
  errorMessages: (state, formName) => {
    const errors = form.errors(state, formName)
    return Object.keys(errors).map(key => {
      return `${key}: ${errors[key]}`
    })
  },
  hasError: (state, formName) => {
    const errors = form.errors(state, formName)
    return Object.keys(errors).length > 0
  },
}

const module = {
  router,
  form,
}

export default module