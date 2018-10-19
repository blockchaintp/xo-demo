import { call } from 'redux-saga/effects'

const SagaErrorWrapper = (sagas) => {
  return Object.keys(sagas).reduce((all, key) => {
    const sagaFn = sagas[key]

    function* errorWrappedSaga(action) {
      try {
        yield call(sagaFn, action)
      }
      catch(e) {
        console.error(e)
      }
    }
    all[key] = errorWrappedSaga
    return all
  }, {})
}

export default SagaErrorWrapper