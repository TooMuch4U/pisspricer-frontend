<template>
    <div id="Items" class="container-fluid pt-3">
      <div class="row">
        <div class="col-1"/>
        <div class="col-3 text-left filter-div">

          <div class="bottom-border pb-2 mb-3">
            <h5 class="mb-1">Categories</h5>
            <span :class="catClass(cat.categoryId)"
                  v-for="cat in categories"
                  v-bind:key="cat.categoryId"
                  @click="filterCategory(cat.categoryId)"
                  :id="'cat' + cat.categoryId">
              {{ cat.category }}
            </span>
          </div>

          <div>
            <h5 class="mb-1">Price</h5>
            <input type="range" min="0" max="1000">
          </div>
        </div>

        <div class="col-7" v-if="isLoading">Loading...</div>
        <div class="col-7" v-else>
          <div class="container-fluid">
            <div class="row">

              <div class="col-6">
                <p class="text-left">
                  Showing {{ (this.currentPage - 1) * this.actualCount + 1 }} -
                   {{ this.currentPage * this.actualCount }} of {{ this.totalCount }}
                </p>
              </div>

              <div class="col-6">
                <div class="float-right">
                  <label for="sortby">Sort by: </label>
                  <select id="sortby" v-model="order" class="float-right no-outline pointer-cursor" @change="orderChange">
                    <option value="best-match" selected="selected">Relevance</option>
                    <option value="price-desc">Price high</option>
                    <option value="price-asc">Price low</option>
                    <option value="alpha-asc">Alphabetical</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <table class="text-left table" v-if="item_list != null">
            <tr v-for="item in item_list" v-bind:key="item.sku">
              <td class="text-center">
                <img v-if="item.hasImage" class="item-image" :src="imageUrl(item.sku)">
                <img v-else class="item-image" src="@/assets/logo.png">
              </td>
              <td>
                <p class="mb-0">{{ item.name }}</p>
                <p class="text-muted mb-0">In {{ item.storeCount }} store{{ item.storeCount == 1 ? '' : 's'}}</p></td>
              <td></td>
              <td>${{ item.bestPrice }}</td>
            </tr>
          </table>

          <Pagination :pages="pages" :currentPage.sync="currentPage" />

        </div>
        <div class="col-1"/>
      </div>
    </div>
</template>

<script>
import {eventBus} from '@/main.js'
import Pagination from '@/components/Pagination'

export default {
  data () {
    return {
      item_list: null,
      static_url: process.env.VUE_APP_STATIC_URL,
      searchTerm: null,
      actualCount: 0,
      totalCount: 0,
      currentPage: 1,
      isLoading: 1,
      itemsPerPage: 24,
      order: 'best-match',
      categories: null,
      filterCats: []
    }
  },
  components: {
    Pagination
  },
  mounted: function () {
    this.getItems()
    this.getCategories()
  },
  created: function () {
    eventBus.$on('remoteUpdateItems', (page) => {
      this.currentPage = page
      this.getItems()
    })
  },
  computed: {
    pages () {
      if (this.isLoading || this.totalCount <= this.itemsPerPage) {
        return [1]
      }
      return [
        ...Array(Math.ceil(this.totalCount / this.itemsPerPage)).keys()
      ].map(e => e + 1)
    }
  },
  methods: {
    getItems: function () {
      this.isLoading = 1
      this.searchTerm = this.$route.query.s

      let searchParams = {
        count: this.itemsPerPage,
        search: this.searchTerm,
        index: ((this.currentPage - 1) * this.itemsPerPage),
        order: this.order,
        catId: this.filterCats}

      this.$http.get(process.env.API_URL + '/items',
        { params: searchParams })
        .then((res) => {
          this.item_list = res.data.items
          this.totalCount = res.data.totalCount
          this.actualCount = res.data.count
          this.isLoading = 0
        })
        .catch((res) => {
          console.log('Error ' + res)
        })
    },
    filterCategory: function (catId) {
      if (this.filterCats.includes(catId)) {
        this.filterCats.splice(this.filterCats.indexOf(catId), 1)
      } else {
        this.filterCats.push(catId)
      }
      this.getItems()
    },
    catClass: function (catId) {
      if (this.filterCats.includes(catId)) {
        return 'mr-1 mb-1 px-2 d-inline-block cat active'
      }
      return 'mr-1 mb-1 px-2 d-inline-block cat'
    },
    getCategories: function () {
      this.$http.get(process.env.API_URL + '/categories')
        .then((res) => {
          this.categories = res.data
        })
    },
    imageUrl: function (sku) {
      return process.env.VUE_APP_STATIC_URL + sku + '.jpeg'
    },
    orderChange: function () {
      this.getItems()
    }
  },
  name: 'Items'
}
</script>

<style scoped>
.item-image {
  max-width: 50px;
  height: 50px;
}
.no-outline {
  outline: none;
  border: 0;
}

.cat {
  display: inline-block;
  white-space: nowrap;
  background-color: #f8f9f8;
  border: 1px solid #d7d7d7;
  border-radius: 12px;
  cursor: pointer;
}

.bottom-border {
  border-bottom: 1px solid #dee2e6!important;
}

.pointer-cursor {
  cursor: pointer;
}

.cat.active {
  background-color: #e1e2e1;
  border: 1px solid #b7b7b7;
}

.filter-div {
  border-right: 1px solid #dee2e6!important;
}
</style>
