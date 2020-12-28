<template>
  <div id="app">
    <HeaderNav :key="userStore.loggedIn"></HeaderNav>
    <router-view/>
    <Footer/>
  </div>
</template>

<script>
import HeaderNav from '@/components/HeaderNav'
import Footer from '@/components/Footer'
import UserStore from '@/stores/UserStore'
export default {
  components: {
    HeaderNav,
    Footer
  },
  data () {
    return {
      userStore: UserStore
    }
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
