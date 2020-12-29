import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import location from './modules/location'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    location
  },
  strict: debug
})
