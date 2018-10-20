import axios from 'axios'
import addressUtils from '../utils/address'

const url = (path = '') => `/api${path || ''}`

export default {

  listGames() {
    return axios.get(url(`/state?address=${addressUtils.getPrefix()}`))
  },

  listTransactions() {
    return axios.get(url(`/transactions?limit=100`))
  },

  loadGame(name) {
    return axios.get(url(`/state?address=${addressUtils.getGameAddress(name)}`))
  },

  submitTransaction(payload) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest
      xhr.open("POST", url(`/batches`), false)
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.onreadystatechange = function (oEvent) {  
        if (xhr.readyState === 4) {  
          if (xhr.status === 202) {  
            resolve()  
          } else {
            reject(oEvent.currentTarget.responseText)
          }  
        }  
      }
      xhr.send(payload)
    })
  },

  url,

}