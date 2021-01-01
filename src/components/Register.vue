<template>
  <div id="register" class="container-fluid pt-3">

    <div class="row mb-3 mx-1">
      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>

      <div class="col-lg-4 col-md-6 col-sm-8 col-12 border-bottom">
        <h4> Register </h4>
      </div>

      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>
    </div>

    <div class="row px-1">
      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>

      <div class="col-lg-4 col-md-6 col-sm-8 col-12">

        <div v-if="error !== null" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <form v-on:submit.prevent>
          <div class="form-group text-left">
            <label for="email">Email address</label>
            <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="email">
          </div>

          <div class="form-group text-left">
            <label for="password">Password</label>
            <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
          </div>
          <div class="form-group text-left">
            <label for="password">Confirm Password</label>
            <input v-model="passwordConfirm" type="password" class="form-control" id="passwordConfirm"
                   placeholder="Confirm Password">
          </div>

          <div class="form-row">
            <div class="form-group col-6">
              <button type="button" class="btn btn-block btn-light">Login</button>
            </div>
            <div class="form-group col-6">
              <button class="btn btn-block btn-primary" @click="loginPressed">Register</button>
            </div>
          </div>
        </form>

      </div>

      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      email: null,
      password: null,
      passwordConfirm: null,
      error: null
    }
  },
}
</script>

<style scoped>

</style>
