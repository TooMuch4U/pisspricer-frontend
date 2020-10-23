<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light rounded text-center">
      <ul class="navbar-nav m-auto">
        <li class="nav-item">
          <router-link class="navbar-brand"
                       :to="{ name: 'home' }">
            Pisspricer
          </router-link>
        </li>
        <li class="nav-item">
            <input class="form-control mt-2" type="text" v-model="searchTerm" placeholder="Search" @keyup.enter="searchItems" aria-label="Search">
        </li>
      </ul>
  </nav>
</template>

<script>
import {eventBus} from '@/main.js'
export default {
  data () {
    return {
      searchTerm: null
    }
  },
  methods: {
    searchItems: function () {
      this.$router
        .push({name: 'items', query: {s: this.searchTerm}}) // Change page to items page
        .catch(() => {}) // Catch error if already on items page
      if (this.$route.name === 'items') {
        eventBus.$emit('remoteUpdateItems')
      }
    }
  },
  name: 'HeaderNav'
}
</script>

<style>
.navbar-brand {
  font-size: 2rem;
}
</style>
