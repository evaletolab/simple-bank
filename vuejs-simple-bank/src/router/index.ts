import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Landing from '../views/Landing.vue'

import { $config, $user } from '@/services'

import About from '../views/About.vue'
import Home from '../views/Home.vue'
import Content from '../views/Content.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/content',
    name: 'Modules',
    component: Home,
  },
  {
    path: '/content/:slug',
    name: 'Modules',
    component: Home,
    // children:[{
    //   path: ':slug',
    //   name: 'Content',
    //   components: { l2 : Content}  
    // }]
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition: any) {
    //console.log("--DBG: route position",savedPosition);
    return savedPosition || {
      x:0,
      y:undefined
    };
  },

})

export default router
