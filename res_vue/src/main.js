import Vue from 'vue'
import App from './App.vue'
import App2 from './App_fire.vue';
import App3 from './App_static.vue';
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
