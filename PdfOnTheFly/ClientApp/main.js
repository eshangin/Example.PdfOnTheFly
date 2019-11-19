import Vue from 'vue'
import router from './router/index'
import App from './App.vue'

Vue.config.productionTip = false

const app = new Vue({
    router,
    ...App
})

export {
    app,
    router
}