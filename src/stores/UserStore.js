import axios from 'axios'
import Cookies from 'js-cookie'
const COOKIE_EXPIRE = 365

export default {
  name: 'userStore',
  data: {
    userId: null,
    authToken: null,
    loggedIn: (typeof Cookies.get('authToken')) !== 'undefined'
  },
  login (email, password) {
    return new Promise((resolve, reject) => {
      let reqBody = {
        email: email,
        password: password
      }
      axios.post(`${process.env.API_URL}/users/login`, reqBody)
        .then((res) => {
          // Success
          this.data.loggedIn = true

          // Set cookies
          Cookies.set('userId', res.data.userId, { expires: COOKIE_EXPIRE })
          Cookies.set('authToken', res.data.authToken, { expires: COOKIE_EXPIRE })
          resolve()
        })
        .catch((err) => {
          reject(err.response.statusText)
        })
    })
  },
  isLoggedIn () {
    return this.data.loggedIn
  },
  getUserInfo (userId) {
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
            this.logout()
          }
          reject(err)
        })
    })
  },
  logout () {
    Cookies.remove('userId')
    Cookies.remove('authToken')
    this.data.loggedIn = false
    // Todo send logout
  },
  getCurUserInfo () {
    return new Promise((resolve, reject) => {
      this.getUserInfo(Cookies.get('userId'))
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          this.logout()
          reject(err)
        })
    })
  }
}
