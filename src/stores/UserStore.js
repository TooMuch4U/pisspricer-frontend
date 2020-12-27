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
  }
}
