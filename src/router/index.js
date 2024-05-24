import { createRouter, createWebHistory } from "vue-router"
import Welcome from '../views/Welcome.vue';
import Login from '../views/Login.vue'
import Shop from '../views/Shop.vue'
import Cart from '../views/Cart.vue'
import Signup from '../views/Signup.vue'
import Movies from '../views/Mymovies.vue'

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/mymovies',
    name: 'Mymovies',
    component: Movies
  },
  
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
