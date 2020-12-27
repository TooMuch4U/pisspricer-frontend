import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Items from '@/components/Items'
import ItemStores from '@/components/ItemStores'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
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
