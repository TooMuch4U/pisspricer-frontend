<template>
    <div id="Items">
      <p>Items</p>
      <table v-if="item_list != null">
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Store Count</th>
          <th>Best Price</th>
        </tr>
        <tr v-for="item in item_list" v-bind:key="item.sku">
          <td><img :src="imageUrl(item.sku)"></td>
          <td>{{ item.name }}</td>
          <td>{{ item.storeCount }}</td>
          <td>${{ item.bestPrice }}</td>
        </tr>
      </table>
    </div>
</template>

<script>
export default {
  data () {
    return {
      item_list: null,
      static_url: process.env.VUE_APP_STATIC_URL
    }
  },
  mounted: function () {
    this.getItems()
  },
  methods: {
    getItems: function () {
      this.$http.get(process.env.API_URL + '/items', { params: { count: 24, search: 'flame' } })
        .then((res) => {
          this.item_list = res.data.items
        })
        .catch((res) => {
          console.log('Error ' + res)
        })
    },
    imageUrl: function (sku) {
      return process.env.VUE_APP_STATIC_URL + sku + '.jpeg'
    }
  },
  name: 'Items'
}
</script>

<style scoped>

</style>
