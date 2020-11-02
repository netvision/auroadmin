import Vue from 'vue'
import VueRouter from 'vue-router'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import './registerServiceWorker'
import App from './App'
import router from './router'
import config from './aws-exports'
import vuetify from './plugins/vuetify'
import VModal from 'vue-js-modal'
import 'vue-search-select/dist/VueSearchSelect.css'


Amplify.configure(config)
Vue.use(VueRouter)
Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(VModal)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  vuetify
}).$mount('#app')

/*

import Vue from 'vue'
import VueRouter from 'vue-router'
import './plugins/axios'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import '@aws-amplify/ui-vue'
import aws_exports from './aws-exports'

Amplify.configure(aws_exports)

Vue.use(VueRouter)
Vue.use(AmplifyPlugin, AmplifyModules)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
*/