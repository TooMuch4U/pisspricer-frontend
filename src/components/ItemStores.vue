<template>
  <div>
    <Item :slug="slug"></Item>
    <div id="Stores" class="container-fluid pt-3">
      <div class="row">
        <div class="col-1"/>
        <div class="col-3 text-left filter-div">
          <SearchRadiusFilters @updateMode="(newMode) => {this.radiusMode = newMode}"
                               @updateRadius="(rad, lati, long) => {this.filterRadius = rad; this.lat = lati; this.lng = long}"/>
        </div>

        <div class="col-7">
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
                <p class="text-muted mb-0">{{ store.brandName }}</p></td>
              <td>{{ store.distance }}</td>
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
  },
  mounted () {
    this.setStoresCount()
    this.setRadiusParams()
    this.getStores()
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
    getStores () {
      let paramObj = {
        mode: 'slug',
        count: this.itemsPerPage,
        index: ((this.currentPage - 1) * this.itemsPerPage)
      }

      if ((this.filterRadius !== null || this.lng !== null || this.lat !== null) && this.radiusMode === 'near') {
        paramObj.r = this.filterRadius
      } else {
        eventBus.$emit('searchRadiusUpdateMode2', 'all')
      }

      paramObj.order = this.order
      paramObj.lat = this.lat
      paramObj.lng = this.lng

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
      if ('r' in this.$route.query) {
        this.radiusMode = 'near'
        this.filterRadius = parseInt(this.$route.query.r)
        eventBus.$emit('getLatLng')
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
    setStoresCount () {
      this.$http.get(`${process.env.API_URL}/items/${this.slug}/stores`,
        {
          params: {
            mode: 'slug'
          }
        })
        .then((res) => {
          this.totalCount = res.data.length
        })
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
