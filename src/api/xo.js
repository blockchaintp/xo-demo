import axios from 'axios'

const url = (path = '') => `/api${path || ''}`

export default {

  listGames() {
    return axios.get(url(`/state?address=5b7349`))
  },

  url,

}