import VueGeolocation from 'vue-browser-geolocation/src'

export default {
  name: 'locationStore',
  data: {
    lat: null,
    lng: null,
    radius: 50
  },
  updateLocation () {
    return new Promise((resolve, reject) => {
      VueGeolocation.getLocation()
        .then(coordinates => {
          this.data.lat = coordinates.lat
          this.data.lng = coordinates.lng
          resolve({lat: coordinates.lat, lng: coordinates.lng})
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getLocation (noPrompt = false) {
    return new Promise((resolve, reject) => {
      if (this.data.lat === null) {
        if (noPrompt) {
          const that = this
          navigator.permissions.query({name: 'geolocation'})
            .then(function (status) {
              if (status.state === 'granted') {
                that.updateLocation()
                  .then((loc) => {
                    resolve(loc)
                  }).catch((err) => {
                    reject(err)
                  })
              } else {
                reject(new Error('Location not available'))
              }
            })
        } else {
          this.updateLocation()
            .then((loc) => {
              resolve(loc)
            }).catch((err) => {
              reject(err)
            })
        }
      } else {
        resolve({lat: this.lat, lng: this.lng})
      }
    })
  },
  test () {
    return new Promise((resolve, reject) => {
      resolve({name: 'test'})
    })
  },
  setRadius (radius) {
    this.radius = radius
  },
  getRadius (radius) {
    return this.radius
  }
}
