import axios from 'axios'

export default {
  name: 'locationStore',
  data: {
    userId: null,
    authToken: null
  },
  login (email, password) {
    return new Promise((resolve, reject) => {
      let reqBody = {
        email: email,
        password: password
      }
      axios.post(`${process.env.API_URL}/users/login`, reqBody)
        .then((res) => {
          this.userId = res.data.userId
          this.authToken = res.data.authToken
          resolve()
        })
        .catch((err) => {
          reject(err.response.statusText)
        })
    })
  },
  isLoggedIn () {
    return (this.authToken != null)
  },
  getUserInfo (userId) {
    return new Promise((resolve, reject) => {
      let header = {
        'X-Authorization': this.authToken
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
    this.userId = null
    this.authToken = null
  },
  getCurUserInfo () {
    return new Promise((resolve, reject) => {
      this.getUserInfo(this.userId)
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
