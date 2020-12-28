<template>
  <div id="logout" class="container-fluid pt-3">

    <div class="row mb-3 mx-1">
      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>

      <div class="col-lg-4 col-md-6 col-sm-8 col-12 border-bottom">
        <h4> Logout </h4>
      </div>

      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>
    </div>

    <div class="row px-1">
      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>

      <div class="col-lg-4 col-md-6 col-sm-8 col-12">

        <div v-if="error !== null" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <div v-if="userStore.loggedIn">
          currently logged in as {{name}}
          <button class="btn btn-primary" @click="logout">Logout</button>
        </div>

        <div v-else>
          You're already logged out. <router-link :to="{name: 'login'}">Login</router-link> instead
        </div>

      </div>

      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>
    </div>
  </div>
</template>

<script>
import UserStore from '@/stores/UserStore.js'
export default {
  name: 'Logout',
  data () {
    return {
      error: null,
      name: null,
      userStore: UserStore
    }
  },
  created () {
    if (this.isLoggedIn()) {
      UserStore.getCurUserInfo()
        .then((info) => {
          this.name = info.firstname
        })
        .catch((err) => {
          this.error = err.response.statusText
        })
    }
  },
  methods: {
    isLoggedIn () {
      return UserStore.isLoggedIn()
    },
    logout () {
      this.name = null
      UserStore.logout()
    }
  }
}
</script>

<style scoped>
#logout {
  min-height: 400px;
}
</style>
