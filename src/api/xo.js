import axios from 'axios'
import addressUtils from '../utils/address'

const url = (path = '') => `/api${path || ''}`

export default {

  listGames() {
    return axios.get(url(`/state?address=${addressUtils.getPrefix()}`))
  },

  submitTransaction(payload) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest
      xhr.open("POST", url(`/batches`), false)
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.onload = function (oEvent) {
        console.log('-------------------------------------------');
        console.log('-------------------------------------------');
        console.log('done!!!')
        console.dir(oEvent)
      }
      xhr.send(payload)
    })
  },

  url,

}