<template>
  <nav class="navbar navbar-expand-lg navbar-light border-bottom rounded text-center">
      <ul class="navbar-nav m-auto">
        <li class="nav-item">
          <router-link class="navbar-brand"
                       :to="{ name: 'home' }">
            Pisspricer
          </router-link>
        </li>
        <li class="nav-item">
            <input class="form-control mt-2 input-outline shadow-none"
                   type="text"
                   v-model="searchTerm"
                   placeholder="Search"
                   @keyup="getPreview"
                   @keyup.enter="searchItems">
        </li>
      </ul>
      <div class="mx-auto" id="suggestions">
        <ul class="list-group">
          <li class="list-group-item" v-for="item in items" :key="item.sku">
            {{ item.name }}
          </li>
        </ul>
      </div>
  </nav>
</template>

<script>
import {eventBus} from '@/main.js'
export default {
  data () {
    return {
      searchTerm: null,
      items: null,
      itemsCount: 0,
      itemsTotalCount: 0,
      itemLimit: 5
    }
  },
  methods: {
    searchItems: function () {
      this.$router
        .push({name: 'items', query: {s: this.searchTerm}}) // Change page to items page
        .catch(() => {}) // Catch error if already on items page
      if (this.$route.name === 'items') {
        eventBus.$emit('updateCurrentPage', 1)
        eventBus.$emit('remoteUpdateItems')
      }
    },
    getPreview () {
      if (this.searchTerm.length > 1) {
        // if current search term is longer than 1 char
        this.$http.get(process.env.API_URL + '/items',
          { params: {
            search: this.searchTerm,
            count: this.itemLimit
          } })
          .then((res) => {
            this.items = res.data.items
            this.itemsCount = res.data.count
            this.itemsTotalCount = res.data.totalCount
          })
      } else {
        // Don't get any items, search term not long enough
        this.items = null
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

.form-control:focus {
  border: 1px solid #ced4da;
}

.bg-custom {
  background-color: #00c5ba;
}

.border-bottom {
  border-bottom: black 1px;
}

#suggestions {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 35%;
  right: 35%;
  background-color: white;
}
</style>
