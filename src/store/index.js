import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import myRequest from './request'
import verticalMenu from './vertical-menu'
import persistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
	myRequest,
  },
  plugins: [persistedState({
    reducer(store) {
      return {
        myRequest: store.myRequest,
        basicServiceManagement: store.basicServiceManagement
      }
    }
  })],
  strict: process.env.DEV,
})
