import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from './router/index'
import './assets/styles/index.scss'


Vue.config.productionTip = false

Vue.use(ElementUI)

import './assets/icons/index'

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
