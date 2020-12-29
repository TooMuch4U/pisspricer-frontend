import axios from 'axios'
import Cookies from 'js-cookie'
const COOKIE_EXPIRE = 365

let state = {
  loggedIn: (typeof Cookies.get('authToken')) !== 'undefined'
}

let mutations = {
  setLoggedIn (state, bool) {
    state.loggedIn = bool
  }
}

let actions = {
  login ({commit}, reqBody) {
    return new Promise((resolve, reject) => {
      console.log(reqBody)
      axios.post(`${process.env.API_URL}/users/login`, reqBody)
        .then((res) => {
          // Set cookies
          Cookies.set('userId', res.data.userId, {expires: COOKIE_EXPIRE})
          Cookies.set('authToken', res.data.authToken, {expires: COOKIE_EXPIRE})

          // Set logged in state
          commit('setLoggedIn', true)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getUserInfo ({commit}, userId) {
    return new Promise((resolve, reject) => {
      let header = {
        'X-Authorization': Cookies.get('authToken')
      }

      axios.get(`${process.env.API_URL}/users/${userId}`, {headers: header})
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          if (err.response.status === 401) {
            commit('logout')
          }
          reject(err)
        })
    })
  },
  getCurUserInfo ({commit, dispatch}) {
    return new Promise((resolve, reject) => {
      dispatch('getUserInfo', Cookies.get('userId'))
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          commit('logout')
          reject(err)
        })
    })
  },
  logout ({commit}) {
    Cookies.remove('userId')
    Cookies.remove('authToken')
    commit('setLoggedIn', false)
    // Todo send logout to api
  }
}

let getters = {
  loggedIn: state => {
    state.loggedIn
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
