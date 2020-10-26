<template>
  <div class="bottom-border pb-2 mb-3">
    <h5 class="mb-1">Stores</h5>
    <span class="mr-1 mb-1 px-2 d-inline-block cat"
          v-bind:class="{ active: this.mode !== 'all' }"
          @click="nearMeClicked">
              near me
    </span>
    <span class="mr-1 mb-1 px-2 d-inline-block cat"
          v-bind:class="{ active: this.mode === 'all' }"
          @click="allClicked">
              all
    </span>
    <div v-if="this.mode !== 'all'">
      <input id="radius-slider"
             type="range"
             min='1' :max="max"
             v-model="radius"
             class="d-inline-block"
             @change="rangeUpdated">
      <p class="d-inline-block">{{ radius }} km</p>
    </div>

  </div>
</template>

<script>
import {eventBus} from '@/main.js'
export default {
  name: 'SearchRadiusFilters',
  data () {
    return {
      radius: '50',
      mode: 'all',
      max: 50,
      min: 1,
      lat: null,
      lng: null
    }
  },
  created: function () {
    eventBus.$on('searchRadiusUpdateMode', (mode) => {
      if (mode === 'all') {
        this.mode = 'all'
        return
      }
      this.mode = 'near'
    })
  },
  methods: {
    allClicked () {
      this.mode = 'all'
      this.$emit('updateMode', this.mode)
      eventBus.$emit('remoteUpdateItems')
    },
    nearMeClicked () {
      this.mode = 'near'
      this.$getLocation()
        .then(coordinates => {
          this.lat = coordinates.lat
          this.lng = coordinates.lng
          this.$emit('updateMode', this.mode)
          this.rangeUpdated()
        }).catch(() => {
          this.allClicked()
        })
    },
    rangeUpdated () {
      this.$emit('updateRadius', parseInt(this.radius), this.lat, this.lng)
      eventBus.$emit('remoteUpdateItems')
    }
  }
}
</script>

<style scoped>
#radius-slider {
  color: black;
}
</style>
