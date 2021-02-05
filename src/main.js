import Vue from 'vue'
import App from './App.vue'
import VueSanitize from "vue-sanitize"

Vue.config.productionTip = false

const defOptions = {
  allowedTags: ["mark"]
}
new Vue({
  render: h => h(App),
}).$mount('#app')


Vue.use(VueSanitize, defOptions);