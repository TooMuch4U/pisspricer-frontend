import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Items from '@/components/Items'
import ItemStores from '@/components/ItemStores'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Register from '@/components/Register'
import VerifyUser from '@/components/VerifyUser'
import ResendCode from '@/components/ResendCode'
import AdminPage from '../components/AdminPage'

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
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/register/:userId/verify/:code',
      name: 'verify',
      component: VerifyUser
    },
    {
      path: '/register/resend',
      name: 'resend',
      component: ResendCode
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
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage
    }
  ],
  mode: 'history'
})
