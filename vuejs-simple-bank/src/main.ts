

import Vue from 'vue';
import './registerServiceWorker'
import App from './App.vue'
import './ts/class-component-hooks.ts';
import router from './router'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.config.productionTip = false


import '@/main.scss'


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

