<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light rounded text-center">
    <router-link class="navbar-brand m-auto"
                 :to="{ name: 'home' }">
      Pisspricer
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'HeaderNav'
}
</script>

<style>
.navbar-brand {
  font-size: 2rem;
}
</style>
