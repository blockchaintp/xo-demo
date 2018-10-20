import { createSagas } from 'redux-box'
import { call, put, select, fork, take, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { initialize, getFormValues } from 'redux-form'

import apiUtils from '../utils/api'
import snackbar from './snackbar'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'

import xoApi from '../api/xo'

const state = {
  transactions: [],
}

const actions = {
  loadTransactionsLoopStart: () => ({
    type: 'VALIDATOR_TRANSACTIONS_LOAD_LOOP_START',
  }),
  loadTransactionsLoopStop: () => ({
    type: 'VALIDATOR_TRANSACTIONS_LOAD_LOOP_STOP',
  }),
  setTransactions: (transactions) => ({
    type: 'VALIDATOR_SET_TRANSACTIONS',
    transactions,
  }),
}

const mutations = {
  VALIDATOR_SET_TRANSACTIONS: (state, action) => {
    state.transactions = action.transactions
  },
}

function* loadTransactionLoop() {
  while (true) {
    try {
      const response = yield call(xoApi.listTransactions)
      yield put(actions.setTransactions(response.data.data))
    } catch(e) {
      console.log('-------------------------------------------');
      console.error(e)
      yield put(actions.loadTransactionsLoopStop())
    }
    yield call(delay, 1000)
  }
}

const sagas = createSagas(sagaErrorWrapper({
  VALIDATOR_TRANSACTIONS_LOAD_LOOP_START: function* (action) {
    const loadTransactionLoopTask = yield fork(loadTransactionLoop)
    yield take(action => action.type == 'VALIDATOR_TRANSACTIONS_LOAD_LOOP_STOP')
    yield cancel(loadTransactionLoopTask)
  },
}))

const module = {
  name : 'validator',
  state, 
  actions, 
  mutations,
  sagas,
}

export default module