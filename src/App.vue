<template>
  <div id="app">
    <HeaderNav></HeaderNav>
    <router-view/>
  </div>
</template>

<script>
import HeaderNav from '@/components/HeaderNav'
export default {
  components: {
    HeaderNav
  },
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
