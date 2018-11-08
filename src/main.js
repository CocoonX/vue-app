// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import mint from 'mint-ui'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'mint-ui/lib/style.css'
// import './mock/api.js'
// swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)
Vue.use(mint)

// Vue.prototype.$axios = axios
Vue.config.productionTip = false
// api基本URL
axios.defaults.baseURL = BASE_URL

Vue.use(VueLazyload, {
  loading: './static/imagloading.jpg',
  error: './static/imgerror.jpg',
  preLoad: 1,
  attempt: 1
})

// 动态设置微信网页中标题
Vue.use(require('vue-wechat-title'))

//全局图片分辨率过滤器
Vue.filter('ratioImg', function (value) {
  if (!value) {
    return ''
  }
  if (value.search(/^210_158$/g) === -1) {
    return value
  }
  let url = value.split('/')
  let pathArr = value.split('=')
  let path = pathArr[pathArr.length - 1]
  return `${url[0]}//${url[2]}/${path}`
})
const app = new Vue({
  el: '#app',
  router,
  store,
  axios,
  render: (h) => h(App)
})
// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
export default { app }
