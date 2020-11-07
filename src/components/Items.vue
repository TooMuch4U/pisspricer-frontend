<template>
    <div id="Items" class="container-fluid pt-3">
      <div class="row">
        <div class="col-1"/>
        <div class="col-3 text-left filter-div">

          <CategoryFilters @update="(catFilters) => {this.filterCats = catFilters}"/>
          <SearchRadiusFilters @updateMode="(newMode) => {this.radiusMode = newMode}"
                               @updateRadius="(rad, lati, long) => {this.filterRadius = rad; this.lat = lati; this.lng = long}"/>
          <RegionFilters @update="(regId) => {this.filterRegion = regId}"/>

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
                <p class="mb-0">
                  <router-link class="text-dark" :to="getLinkParams(item)">
                    {{ item.name }}
                  </router-link>
                </p>
                <p class="text-muted mb-0">In {{ item.storeCount }} store{{ item.storeCount == 1 ? '' : 's'}}</p></td>
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
import RegionFilters from '@/components/RegionFilters'
import CategoryFilters from '@/components/CategoryFilters'
import SearchRadiusFilters from '@/components/SearchRadiusFilters'

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
      filterCats: [],
      filterRegion: null,
      radiusMode: 'all',
      filterRadius: 50,
      lat: null,
      lng: null
    }
  },
  components: {
    Pagination,
    RegionFilters,
    CategoryFilters,
    SearchRadiusFilters
  },
  mounted: function () {
    this.setRadiusParams()
    this.getItems()
  },
  created: function () {
    eventBus.$on('setCurrentPage', (page) => {
      this.currentPage = page
      this.scrollToTop()
    })
    eventBus.$on('remoteUpdateItems', () => {
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
      this.searchTerm = this.$route.query.s

      let searchParams = {
        count: this.itemsPerPage,
        search: this.searchTerm,
        index: ((this.currentPage - 1) * this.itemsPerPage),
        order: this.order,
        catId: this.filterCats}

      if (this.regionFilter !== null) {
        searchParams.regionId = this.filterRegion
      }

      if (this.filterRadius !== null && this.lng !== null && this.lat !== null && this.radiusMode === 'near') {
        searchParams.r = this.filterRadius
        searchParams.lng = this.lng
        searchParams.lat = this.lat
      } else {
        eventBus.$emit('searchRadiusUpdateMode3', 'all')
      }

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
    setRadiusParams () {
      if ('r' in this.$route.query) {
        this.radiusMode = 'near'
        this.filterRadius = parseInt(this.$route.query.r)
        eventBus.$emit('getLatLng')
      }
    },
    getLinkParams (item) {
      let params = { name: 'item', params: { slug: item.slug }, query: {} }
      if (this.radiusMode === 'near') {
        params.query.r = this.filterRadius
      }
      return params
    },
    imageUrl: function (sku) {
      return process.env.VUE_APP_STATIC_URL + 'items/' + sku + '.jpeg'
    },
    orderChange: function () {
      this.getItems()
    },
    scrollToTop () {
      window.scrollTo(0, 0)
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

.bottom-border {
  border-bottom: 1px solid #dee2e6!important;
}

.pointer-cursor {
  cursor: pointer;
}

.filter-div {
  border-right: 1px solid #dee2e6!important;
}
</style>
