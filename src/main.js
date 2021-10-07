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
import dotenv from 'dotenv'

dotenv.config()


Amplify.configure(config)
Vue.use(VueRouter)
Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(VModal)
Vue.config.productionTip = false

Vue.filter('formatDate', function(value) {
  if (value) {
    return new Date(value).toLocaleDateString(
      'en-gb',
      {
        year: 'numeric',
        month: 'long'
      }
    )
  }
});

new Vue({
  render: h => h(App),
  router,
  vuetify
}).$mount('#app')