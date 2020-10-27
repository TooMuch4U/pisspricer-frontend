import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Items from '@/components/Items'
import ItemStores from '@/components/ItemStores'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/items',
      name: 'items',
      component: Items
    },
    {
      path: '/items/:slug',
      name: 'item',
      component: ItemStores
    }
  ],
  mode: 'history'
})
