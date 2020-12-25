<template>
  <div>
    <Item :slug="slug"></Item>
    <div id="Stores" class="container-fluid pt-3">
      <div class="row">
        <div class="col-md-1 d-none d-md-block"/>
        <div class="col-md-3 col-12 text-left text-left filter-div">
          <SearchRadiusFilters @updateMode="(newMode) => {this.radiusMode = newMode}"
                               @updateRadius="(rad, lati, long) => {this.filterRadius = rad; this.lat = lati; this.lng = long}"/>
        </div>

        <div class="col-12 col-md-7">
          <div class="container-fluid">
            <div class="row">

              <div class="col-6 px-0">
                <p class="text-left">
                  Showing {{ (this.currentPage - 1) * this.actualCount + 1 }} -
                  {{ this.currentPage * this.actualCount }} of {{ this.totalCount }}
                </p>
              </div>

              <div class="col-6 px-0">
                <div class="float-right">
                  <label for="sortby">Sort by: </label>
                  <select id="sortby" v-model="order" class="float-right no-outline pointer-cursor" @change="orderUpdated">
                    <option value="dist-asc">Distance low</option>
                    <option value="dist-desc">Distance high</option>
                    <option value="price-desc">Price high</option>
                    <option value="price-asc" selected="selected">Price low</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <table class="text-left table">
            <tr v-for="store in storeData" v-bind:key="store.storeId">
              <td class="text-center">
                <img class="item-image" :src="brandImageUrl(store.brandId)">
              </td>
              <td>
                <p class="mb-0">{{ store.storeName }}</p>
                <p class="text-muted mb-0" v-if="store.distance === 0">Updated {{ getDaysAgoStr(store.dateChecked) }}</p>
                <p class="text-muted mb-0" v-else>Updated {{ getDaysAgoStr(store.dateChecked) }}, {{ store.distance.toFixed(1) }}km</p>
              </td>
              <td v-if="store.salePrice !== null"><s>${{ store.price }}</s><br/> ${{ store.salePrice }}</td>
              <td v-else>${{ store.price }}</td>
            </tr>
          </table>

          <Pagination :pages="pages" :currentPage.sync="currentPage" />

        </div>
        <div class="col-1"/>
      </div>
    </div>
  </div>
</template>

<script>
import Item from '@/components/Item'
import Pagination from '@/components/Pagination'
import SearchRadiusFilters from '@/components/SearchRadiusFilters'
import {eventBus} from '@/main.js'
import LocationStore from '@/stores/LocationStore.js'
export default {
  data () {
    return {
      actualCount: 0,
      totalCount: 0,
      currentPage: 1,
      isLoading: 1,
      itemsPerPage: 24,
      slug: null,
      storeData: null,
      itemData: null,
      order: 'price-asc',
      lat: null,
      lng: null,
      radiusMode: 'all',
      filterRadius: 50
    }
  },
  components: {
    Item,
    Pagination,
    SearchRadiusFilters
  },
  created () {
    this.slug = this.$route.params.slug
    eventBus.$on('setCurrentPage', (page) => {
      this.currentPage = page
      this.scrollToTop()
    })
    eventBus.$on('remoteUpdateItems', () => {
      this.getStores()
    })
    eventBus.$on('updateItemStoresPage', () => {
      this.slug = this.$route.params.slug
      this.loadPage()
    })
  },
  mounted () {
    this.loadPage()
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
    loadPage () {
      let that = this
      LocationStore.getLocation(true).then((_) => { that.getStores() })
      this.setRadiusParams()
      this.getStores()
    },
    getStores () {
      let paramObj = {
        mode: 'slug',
        count: this.itemsPerPage,
        index: ((this.currentPage - 1) * this.itemsPerPage)
      }
      const lat = LocationStore.data.lat
      const lng = LocationStore.data.lng

      if ((this.filterRadius !== null || lat !== null || lng !== null) && this.radiusMode === 'near') {
        paramObj.r = this.filterRadius
      } else {
        eventBus.$emit('searchRadiusUpdateMode2', 'all')
      }

      paramObj.order = this.order
      paramObj.lat = lat
      paramObj.lng = lng

      this.$http.get(`${process.env.API_URL}/items/${this.slug}/stores`,
        {
          params: paramObj
        })
        .then((res) => {
          this.storeData = res.data.items
          this.actualCount = res.data.count
          this.totalCount = res.data.totalCount
          this.isLoading = 0
        })
    },
    setRadiusParams () {
      let that = this
      if (typeof this.$route.query.r !== 'undefined') {
        that.radiusMode = 'near'
        that.filterRadius = parseInt(that.$route.query.r)
        LocationStore.getLocation()
          .then((loc) => {
            that.getStores()
          }).catch((err) => {
            console.log(err)
          })
      } else {
        that.radiusMode = 'all'
      }
    },
    orderUpdated () {
      if (this.lat === null || this.lng === null) {
        this.$getLocation()
          .then(coordinates => {
            this.lat = coordinates.lat
            this.lng = coordinates.lng
            this.getStores()
          }).catch(() => {
            this.order = 'price-asc'
            this.getStores()
          })
      } else {
        this.getStores()
      }
    },
    getDaysAgoStr (dateStr) {
      let today = new Date()
      let past = new Date(dateStr)
      let days = (today - past) / (1000 * 3600 * 24)
      let hours = (today - past) / (1000 * 3600)
      if (hours < 1) {
        return 'in the last hour'
      } else if (days < 1) {
        return 'today'
      } else if (days < 2) {
        return 'yesterday'
      } else if (days < 7) {
        return parseInt(days) + ' days ago'
      } else if (days < 30) {
        return 'over a week ago'
      } else {
        return 'over a month ago'
      }
    },
    itemImageUrl (sku) {
      return process.env.VUE_APP_STATIC_URL + 'items/' + sku + '.jpeg'
    },
    brandImageUrl (brandId) {
      return `${process.env.VUE_APP_STATIC_URL}brands/${brandId}.jpeg`
    },
    scrollToTop () {
      window.scrollTo(0, 100)
    }
  },
  name: 'ItemStores'
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
