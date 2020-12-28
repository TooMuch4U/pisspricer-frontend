<template>
  <div>
    <nav class="navbar flex-nowrap d-flex navbar-light border-bottom">
      <div class="d-flex w-50 order-0">
      </div>
      <div class="d-flex justify-content-center order-2" id="collapsingNavbar">
        <ul class="navbar-nav flex-sm-row">
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
                   id="search-input"
                   placeholder="Search"
                   @keyup="getPreview($event)"
                   @keyup.enter="searchClicked">
          </li>
        </ul>
      </div>
      <span class="text-right order-last w-50">
        <router-link to="logout" v-if="userStore.data.loggedIn">
          Log Out
        </router-link>
      </span>

    </nav>


    <div class="mx-auto" id="suggestions" v-if="items !== null" v-click-outside="hideWindow">
      <ul class="list-group">
        <li class="list-group-item suggestion-item text-left"
            v-for="item in items"
            :key="item.sku"
            v-on:click="itemClicked(item)">
          <div class="img-div mr-3 text-center">
            <img v-if="item.hasImage" class="item-image" :src="imageSrc(item.sku)">
            <img v-else class="item-image" src="../../static/favicon.png">
          </div>
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
import UserStore from '@/stores/UserStore.js'
export default {
  data () {
    return {
      searchTerm: null,
      items: null,
      itemsCount: 0,
      itemsTotalCount: 0,
      itemLimit: 5,
      hide: false,
      userStore: UserStore
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
    hideWindow () {
      this.hide = true
      document.getElementById('search-input').blur()
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
        eventBus.$emit('updateItemStoresPage')
      }
      this.hideWindow()
    },
    imageSrc (sku) {
      return process.env.VUE_APP_STATIC_URL + 'items/' + sku + '.jpeg'
    },
    getPreview (event) {
      if (this.searchTerm.length > 1 && event.key !== 'Enter') {
        // if current search term is longer than 1 char
        this.hide = false
        this.$http.get(process.env.API_URL + '/suggestions',
          { params: {
            search: this.searchTerm,
            count: this.itemLimit
          } })
          .then((res) => {
            this.items = res.data.items
            this.itemsCount = res.data.count
            this.itemsTotalCount = res.data.totalCount
            if (this.hide) {
              this.hideWindow()
            }
          })
      } else {
        // Don't get any items, search term not long enough
        this.items = null
      }
    },
    isLoggedIn () {
      return UserStore.isLoggedIn()
    }
  },
  name: 'HeaderNav'
}
</script>

<style>


.test_nav {
  -webkit-tap-highlight-color: transparent;
  --blue: #007bff;
  --indigo: #6610f2;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #dc3545;
  --orange: #fd7e14;
  --yellow: #ffc107;
  --green: #28a745;
  --teal: #20c997;
  --cyan: #17a2b8;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  --font-family-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  padding: .5rem 1rem;
  flex-flow: row nowrap;
  justify-content: flex-start;
  border-bottom: 1px solid #dee2e6!important;
}
.test_1 {
  -webkit-tap-highlight-color: transparent;
  --blue: #007bff;
  --indigo: #6610f2;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #dc3545;
  --orange: #fd7e14;
  --yellow: #ffc107;
  --green: #28a745;
  --teal: #20c997;
  --cyan: #17a2b8;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  --font-family-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
  order: 0;
  display: flex!important;
  width: 50%!important;
}
.test_2 {
  -webkit-tap-highlight-color: transparent;
  --blue: #007bff;
  --indigo: #6610f2;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #dc3545;
  --orange: #fd7e14;
  --yellow: #ffc107;
  --green: #28a745;
  --teal: #20c997;
  --cyan: #17a2b8;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  --font-family-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
  order: 2;
  flex-grow: 1;
  align-items: center;
  justify-content: center!important;
  display: flex!important;
  flex-basis: auto;
}
.test_3 {
  -webkit-tap-highlight-color: transparent;
  --blue: #007bff;
  --indigo: #6610f2;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #dc3545;
  --orange: #fd7e14;
  --yellow: #ffc107;
  --green: #28a745;
  --teal: #20c997;
  --cyan: #17a2b8;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  --font-family-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #2c3e50;
  box-sizing: border-box;
  order: 13;
  width: 50%!important;
  text-align: right!important;
}

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
  left: 10%;
  right: 10%;
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

#search-input {
  width: 200px;
}

.item-image {
  max-width: 40px;
  height: 20px;
}

.img-div {
  width: 40px;
  height: 20px;
  display: inline-block;
}

@media (min-width: 576px) {
  #suggestions {
    left: 20%;
    right: 20%;
  }
}

@media (min-width: 768px) {
  #suggestions {
    left: 25%;
    right: 25%;
  }
}

@media (min-width: 992px) {
  #suggestions {
    left: 35%;
    right: 35%;
  }
}

@media (min-width: 1200px) {
  #suggestions {
    left: 35%;
    right: 35%;
  }
}

</style>
