import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VShowSlide from 'v-show-slide'
import VueClipboard from 'vue-clipboard2'
import VModal from 'vue-js-modal'
import { VuePlugin } from 'vuera'

import './assets/scss/app.scss'

Vue.config.productionTip = false
Vue.use(VueClipboard)
Vue.use(VShowSlide)
Vue.use(VModal, { componentName: 'window' })
Vue.use(VuePlugin)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

