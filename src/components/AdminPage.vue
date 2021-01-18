<template>
  <div id="home" class="container">
    <div class="row py-3 bottom-border">
      <div class="col-sm-2 d-none d-sm-block"></div>
      <div class="col-sm-8 col-12">
        <h4>Admin</h4>
      </div>
      <div class="col-sm-2 d-none d-sm-block"></div>
    </div>

    <div class="row py-3 mx-1">
      <div class="col-sm-2 d-none d-sm-block"></div>
      <div class="col-sm-8 col-12">
        <h4 class="mb-0"></h4>
      </div>
      <div class="col-sm-2 d-none d-sm-block"></div>
    </div>

    <div class="row text-center">
      <div class="col-12 text-center">
        <p v-if="!loggedIn">
          You're not logged in. <router-link :to="{name: 'login'}">Login</router-link>
        </p>

        <p v-else-if="!isAdmin">
          You're not an admin. <router-link :to="{name: 'logout'}">Logout</router-link>
        </p>

        <p v-else>
          Admin!
        </p>
      </div>

    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'AdminPage',
  computed: {
    ...mapGetters(['isAdmin', 'loggedIn'])
  }
}
</script>

<style scoped>

</style>
