<template>
  <div id="Item" class="container-fluid pt-3">
    <div class="row my-1">
      <div class="col-1 d-none d-md-block"></div>
      <div class="col-12 col-md-10 bottom-border pb-3">
        <table class="m-auto" v-if="itemData !== null">
          <tr>
            <td>
              <img v-if="itemData.hasImage" class="mr-3 item-image-big" :src="`${staticUrl}items/${itemData.sku}.jpeg`">
              </td>
            <td class="text-left">
              <h5 class="m-0"><b>{{ itemData.name }}</b></h5>

              <p class="m-0 d-inline-block">Brand: </p>
              <p class="text-muted d-inline-block m-0">{{ itemData.brand ? itemData.brand : '?' }}</p>
              <br/>

              <p class="m-0 d-inline-block">Category: </p>
              <p class="text-muted d-inline-block m-0">{{ itemData.category ? itemData.category : '?' }}</p>
              <br/>

              <p class="m-0 d-inline-block">Volume Each: </p>
              <p class="text-muted d-inline-block m-0">
                {{ itemData.volumeEach ? itemData.volumeEach + 'ml' : '?' }}
              </p>
              <br/>

              <p class="m-0 d-inline-block">Pack Size: </p>
              <p class="text-muted d-inline-block m-0">
                {{ itemData.packSize ? itemData.packSize : '?' }}
              </p>
              <br/>

              <p class="m-0 d-inline-block">Abv: </p>
              <p class="text-muted d-inline-block m-0">
                {{ itemData.alcoholContent ? itemData.alcoholContent + '%' : '?' }}
              </p>
              <br/>

              <p class="m-0 d-inline-block">Std Drinks: </p>
              <p class="text-muted d-inline-block m-0">
                {{ itemData.stdDrinks ? itemData.stdDrinks : '?' }}
              </p>
              <br/>
            </td>
          </tr>
        </table>

      </div>
      <div class="col-1 d-none d-md-block"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      itemData: null,
      staticUrl: process.env.VUE_APP_STATIC_URL
    }
  },
  props: ['slug'],
  mounted () {
    this.getItem()
  },
  watch: { // Watch to see if the item slug changes
    slug: function () {
      this.getItem()
    }
  },
  methods: {
    getItem () {
      this.$http.get(`${process.env.API_URL}/items/${this.slug}`,
        {
          params: { mode: 'slug' }
        })
        .then((res) => {
          this.itemData = res.data
        })
    }
  },
  name: 'Item'
}
</script>

<style scoped>
.item-image-big {
  max-width: 80px;
}
.bottom-border {
  border-bottom: 1px solid #dee2e6!important;
}
</style>
