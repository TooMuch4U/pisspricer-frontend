<template>
  <div>
    <Item :slug="slug"></Item>
    <div id="Stores" class="container-fluid pt-3">
      <div class="row">
        <div class="col-1"/>
        <div class="col-3 text-left filter-div bg-dark">

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
                  <label >Sort by: </label>

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
      itemData: null
    }
  },
  components: {
    Item,
    Pagination
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
      this.$http.get(`${process.env.API_URL}/items/${this.slug}/stores`,
        {
          params: {
            mode: 'slug',
            count: this.itemsPerPage,
            index: ((this.currentPage - 1) * this.itemsPerPage)
          }
        })
        .then((res) => {
          this.storeData = res.data
          this.actualCount = res.data.length
          this.isLoading = 0
        })
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
