<template>
    <div id="Items">
      <table class="m-auto text-left" v-if="item_list != null">
        <tr>
          <th class="text-center">Image</th>
          <th>Name</th>
          <th>Store Count</th>
          <th>Best Price</th>
        </tr>
        <tr v-for="item in item_list" v-bind:key="item.sku">
          <td class="text-center">
            <img class="item-image" :src="imageUrl(item.sku)">
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.storeCount }}</td>
          <td>${{ item.bestPrice }}</td>
        </tr>
      </table>
    </div>
</template>

<script>
import {eventBus} from '@/main.js'
export default {
  data () {
    return {
      item_list: null,
      static_url: process.env.VUE_APP_STATIC_URL,
      searchTerm: null
    }
  },
  mounted: function () {
    this.getItems()
  },
  created: function () {
    /**
     * Creates event listener to update items from other components
     */
    eventBus.$on('remoteUpdateItems', () => {
      this.getItems()
    })
  },
  methods: {
    /**
     * Gets items from api and updates item_list
     */
    getItems: function () {
      this.searchTerm = this.$route.query.s
      this.$http.get(process.env.API_URL + '/items', { params: { count: 24, search: this.searchTerm } })
        .then((res) => {
          this.item_list = res.data.items
        })
        .catch((res) => {
          console.log('Error ' + res)
        })
    },
    /**
     * Returns the image url for a specified item based on sku
     * @param sku Sku of item image wanted
     * @returns {string} String of image url
     */
    imageUrl: function (sku) {
      return process.env.VUE_APP_STATIC_URL + sku + '.jpeg'
    }
  },
  name: 'Items'
}
</script>

<style scoped>
.item-image {
  max-width: 100px
}
</style>
