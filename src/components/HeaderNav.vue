<template>
  <div>
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
                   @keyup="getPreview($event)"
                   @keyup.enter="searchClicked">
        </li>
      </ul>
  </nav>
    <div class="mx-auto" id="suggestions" v-if="items !== null" v-click-outside="hideWindow">
      <ul class="list-group">
        <li class="list-group-item suggestion-item text-left"
            v-for="item in items"
            :key="item.sku"
            v-on:click="itemClicked(item)">
          <img v-if="item.hasImage" class="item-image float-left mr-3" :src="imageSrc(item.sku)">
          <img v-else class="item-image float-left mr-3" src="@/assets/logo.png">
          {{ item.name }}
        </li>
        <li class="list-group-item">
          <a id="search-link"
             v-on:click="searchClicked">
            Show all {{itemsTotalCount}} results →
          </a>
        </li>
      </ul>
    </div>
  </div>
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
      this.searchTerm = null
    },
    hideWindow () {
      this.items = null
    },
    searchClicked () {
      this.searchItems()
      this.hideWindow()
    },
    itemClicked (item) {
      this.$router
        .push({ name: 'item', params: { slug: item.slug } }) // Change page to items page
        .catch(() => {}) // Catch error if already on items page
      if (this.$route.name === 'item') {
        eventBus.$emit('updateItemPage')
      }
      this.hideWindow()
    },
    imageSrc (sku) {
      return process.env.VUE_APP_STATIC_URL + 'items/' + sku + '.jpeg'
    },
    getPreview (event) {
      if (this.searchTerm.length > 1 && event.key !== 'Enter') {
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

#ul {
  background-color: white;
}

#suggestions {
  position: absolute;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  left: 35%;
  right: 35%;
}

.suggestion-item:first-child {
  border-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.suggestion-item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

.suggestion-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#search-link {
  color: #007bff;
  cursor: pointer;
}

.item-image {
  max-width: 20px;
  height: 20px;
}
</style>
