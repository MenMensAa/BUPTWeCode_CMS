import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Pagenator from './components/common/pagenator.vue'
import imageUploader from '@/components/common/imageUploader.vue'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component('my-pagenator', Pagenator)
Vue.component('image-uploader', imageUploader)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
