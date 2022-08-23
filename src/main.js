import Vue from 'vue'
// import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import bootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// Global Components
import './global-components'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'    
// 3rd party plugins
import 'vue-good-table/dist/vue-good-table.css'
import '@/libs/portal-vue'
import './utils/rem.js'
import '@/libs/toastification'
import axios from 'axios'
// BSV Plugin Registration
// Vue.use(ToastPlugin)
// Vue.use(ModalPlugin)
Vue.use(bootstrapVue)
Vue.use(ElementUI)
Vue.use(VXETable)

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
