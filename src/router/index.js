import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Artisans from '../views/Artisans.vue'
import ArtisanDetail from '../views/ArtisanDetail.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    component: Home,
    name: 'Home'
  },
  {
    path: '/products',
    component: Products,
    name: 'Products'
  },
  {
    path: '/products/:id',
    component: ProductDetail,
    name: 'ProductDetail'
  },
  {
    path: '/artisans',
    component: Artisans,
    name: 'Artisans'
  },
  {
    path: '/artisans/:id',
    component: ArtisanDetail,
    name: 'ArtisanDetail'
  },
  {
    path: '/cart',
    component: Cart,
    name: 'Cart'
  },
  {
    path: '/checkout',
    component: Checkout,
    name: 'Checkout'
  },
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  {
    path: '/register',
    component: Register,
    name: 'Register'
  },
  {
    path: '/profile',
    component: Profile,
    name: 'Profile'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
