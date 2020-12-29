<template>
    <div id="Items" class="container-fluid pt-3">
      <div class="row">
        <div class="col-md-1 d-none d-md-block"/>
        <div class="col-md-3 col-12 text-left">

          <CategoryFilters @update="(catFilters) => {this.filterCats = catFilters}"/>
          <SearchRadiusFilters/>

        </div>
        <div class="col-0 d-none d-md-block filter-div"></div>

        <div class="col-7" v-if="isLoading">Loading...</div>
        <div class="col-12 col-md-7" v-else>
          <div class="container-fluid">
            <div class="row">

              <div class="col-12 col-sm-5">
                <p class="text-sm-left mb-0">
                  Showing {{ (this.currentPage - 1) * this.actualCount + 1 }} -
                   {{ this.currentPage * this.actualCount }} of {{ this.totalCount }}
                </p>
              </div>

              <div class="col-12 col-sm-7">
                <div class="float-sm-right">
                  <label for="sortby">Sort by: </label>
                  <select id="sortby" v-model="order" class="float-sm-right no-outline pointer-cursor bg-white">
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
              <td class="text-center image-div">
                  <img v-if="item.hasImage" class="item-image align-middle" :src="imageUrl(item.sku)">
                  <img v-else class="item-image" src="../../static/favicon.png">
              </td>
              <td>
                <p class="mb-0">
                  <router-link class="text-dark" :to="getLinkParams(item)">
                    {{ item.name }}
                  </router-link>
                </p>
                <p class="text-muted mb-0">In {{ item.storeCount }} store{{ item.storeCount == 1 ? '' : 's'}}</p></td>
              <td>${{ roundPrice(item.bestPrice) }}</td>
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
import { mapGetters } from 'vuex'

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
      filterRegion: null
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
  },
  watch: {
    // Update items when search params update
    searchParams () {
      this.getItems()
    }
  },
  computed: {
    ...mapGetters(['lat', 'lng']),
    pages () {
      if (this.isLoading || this.totalCount <= this.itemsPerPage) {
        return [1]
      }
      return [
        ...Array(Math.ceil(this.totalCount / this.itemsPerPage)).keys()
      ].map(e => e + 1)
    },
    radius: {
      set (radius) {
        this.$store.commit('radius', radius)
      },
      get () {
        return this.$store.state.location.radius
      }
    },
    mode: {
      set (mode) {
        if (mode === 'all') {
          this.$store.commit('modeAll')
        } else {
          this.$store.commit('modeNear')
        }
      },
      get () {
        return this.$store.state.location.mode
      }
    },
    searchParams () {
      let searchParams = {
        count: this.itemsPerPage,
        search: this.$route.query.s,
        index: ((this.currentPage - 1) * this.itemsPerPage),
        order: this.order,
        catId: this.filterCats}

      if (this.regionFilter !== null) {
        searchParams.regionId = this.filterRegion
      }

      if (this.radius !== null && this.lng !== null && this.lat !== null && this.mode === 'near') {
        searchParams.r = this.radius
        searchParams.lng = this.lng
        searchParams.lat = this.lat
      }
      return searchParams
    }
  },
  methods: {
    getItems: function () {
      let searchParams = this.searchParams

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
        this.mode = 'near'
        this.radius = parseInt(this.$route.query.r)
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
    scrollToTop () {
      window.scrollTo(0, 0)
    },
    roundPrice (num) {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
  },
  name: 'Items'
}
</script>

<style scoped>
.item-image {
  max-width: 50px;
  height: auto;
  max-height: 50px
}

.image-div {
  width: 80px;
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
  min-height: 400px;
}
</style>
