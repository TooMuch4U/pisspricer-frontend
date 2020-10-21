<template>
    <div id="Items">
      <p>Items</p>
      <table v-if="item_list != null">
        <tr>
          <th>Name</th>
          <th>Brand</th>
          <th>Best Price</th>
        </tr>
        <tr v-for="item in item_list" v-bind:key="item.sku">
          <td>{{ item.name }}</td>
          <td>{{ item.brand }}</td>
          <td>${{ item.bestPrice }}</td>
        </tr>
      </table>
    </div>
</template>

<script>
export default {
  data () {
    return {
      item_list: null
    }
  },
  mounted: function () {
    this.getItems()
  },
  methods: {
    getItems: function () {
      this.$http.get(process.env.API_URL + '/items', { params: { count: 24 } })
        .then((res) => {
          this.item_list = res.data.items
        })
        .catch((res) => {
          console.log('Error ' + res)
        })
    }
  },
  name: 'Items'
}
</script>

<style scoped>

</style>
