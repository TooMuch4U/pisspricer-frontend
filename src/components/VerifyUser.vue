<template>
  <div id="verify" class="container-fluid pt-3">

    <div class="row mb-3 mx-1">
      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>

      <div class="col-lg-4 col-md-6 col-sm-8 col-12 border-bottom">
        <h4> Account Verification </h4>
      </div>

      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>
    </div>

    <div class="row px-1">
      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>

      <div class="col-lg-4 col-md-6 col-sm-8 col-12">

        <div v-if="error !== null" class="alert alert-danger" role="alert">
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success" role="alert">
          {{ success }}
        </div>



      </div>

      <div class="col-lg-4 col-md-3 col-sm-2 d-none d-sm-block"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerifyUser',
  data () {
    return {
      error: null,
      success: null
    }
  }
}
</script>

<style scoped>

</style>
