import VueGeolocation from 'vue-browser-geolocation/src'

export default {

  data: {
    lat: null,
    lng: null,
    radius: 50
  },
  updateLocation () {
    VueGeolocation.$getLocation()
      .then(coordinates => {
        this.lat = coordinates.lat
        this.lng = coordinates.lng
        return {lat: coordinates.lat, lng: coordinates.lng}
      }).catch(() => {
        return {lat: null, lng: null}
      })
  },
  getLocation (noPrompt = false) {
    if (this.lat === null) {
      if (noPrompt) {
        navigator.permissions.query({name: 'geolocation'})
          .then(function (status) {
            if (status.state === 'granted') {
              return this.updateLocation()
            } else {
              return {lat: null, lng: null}
            }
          })
      } else {
        return this.updateLocation()
      }
    } else {
      return {lat: this.lat, lng: this.lng}
    }
  },
  setRadius (radius) {
    this.radius = radius
  },
  getRadius (radius) {
    return this.radius
  }
}
