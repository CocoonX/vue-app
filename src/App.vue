<template>
  <!-- v-wechat-title="$route.meta.title" -->
  <div id="app">
    <transition :name="page" v-if="source || (!source && isContent)">
      <keep-alive>
        <router-view class="container">
        </router-view>
      </keep-alive>
    </transition>
    <c-share v-if="!isContent && !source"></c-share>
  </div>
</template>

<script>
  import CFooter from './components/Footer.vue'
  import CTop from './components/Top.vue'
  import axios from 'axios'
  import CShare from './components/Share.vue'
  import { source } from './utils/source'
  import { hideMenuItems } from './utils/wxShare'

  export default {
    name: 'app',
    data () {
      return {
        page: '',
        source: true
      }
    },
    created () {
      if (source()) {
        this.source = true
      } else {
        this.source = false
      }
    },
    mounted () {
      this.checkConfig()
      hideMenuItems()
    },
    components: {
      CFooter,
      CTop,
      CShare
    },
    methods: {
      checkConfig () {
        const url = encodeURIComponent(document.location.href.split('#')[0])
        axios({
          method: 'get',
          url: '/getSign?url=' + url
        }).then(function (res) {
          var params = res.data.data
          // 接口入住权限验证配置
          window.wx.config({
            debug: false,
            appId: params.appid,
            timestamp: params.timestamp,
            nonceStr: params.nonceStr,
            signature: params.signature,
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              "hideMenuItems",
              'translateVoice'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        })
      }
    },
    watch: {
      $route (to, from) {
        // 设置title
        if (to.name === 'projectList' && to.params.columnId === '1') {
          document.title = '党建栏目'
        } else if (to.name === 'projectList' && to.params.columnId === '2') {
          document.title = '创客栏目'
        } else {
          document.title = to.meta.title
        }
        // 页面切换效果
        if (to.path.includes('content')) {
          this.page = 'content-right'
        } else if (from.path.includes('content')) {
          this.page = 'content-left'
        } else {
          this.page = 'fadeIn'
        }
        // 判断收藏按钮颜色
        if (from.name === 'home' || from.name === 'collect' || from.name === 'search') {
          this.$store.state.home.isColumnContent = 'home'
        } else if (from.name === 'partyBuild'){
          this.$store.state.home.isColumnContent = 'partyBuild'
        } else if (from.name === 'maker') {
          this.$store.state.home.isColumnContent = 'maker'
        }
        // 判断登录状态
        if (localStorage.getItem('userName')) {
          this.$store.state.loginStore.loginStatus = true
        } else {
          this.$store.state.loginStore.loginStatus = false
        }
        // 重置协议状态
        this.$store.state.loginStore.agreementStatus = true
        this.$store.state.loginStore.showAgreementWarn = false
        // 隐藏分享渠道按钮
        hideMenuItems()
      }
    },
    computed: {
      isContent () {
        if (this.$route.path.includes('content')) {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>

<style lang="scss">
  @import './assets/style/common.scss';
  @import './assets/style/global.scss';
  @import './assets/style/transition.scss';
</style>
