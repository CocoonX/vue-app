<template>
  <div class="home-wrapper">
    <div class="header home-header">
      <c-home-nav></c-home-nav>
      <div tag="div" class="search" @click="search">
        <i class="search-icon"></i>
      </div>
    </div>
    <div class="content" id="content">
      <c-loading v-show="loading" class="loading"></c-loading>
      <mt-loadmore
        :top-method="loadTop"
        ref="loadmore"
        :bottom-method="loadBottom"
        :auto-fill="false"
        :bottom-all-loaded="allLoaded"
        @bottom-status-change="handleBottomChange">
      <swiper ref="swiper-wrapper" id="swiper-container" @slideChangeTransitionStart="end">
        <swiper-slide v-for="(news, index) in channellist" :key="index">
          <c-newslist
          :listCon="list[$route.params.type]"
          v-show="!loading && ifReturnMsg"
          @event="loadmoreNews"
          :flag="loadmore"
          :ifFlag="ifReturnMore" @changeColor="changeColor"></c-newslist>
        </swiper-slide>
      </swiper>
        <!--<div slot="bottom" class="mint-loadmore-top">-->
          <!--<span v-show="bottomStatus === 'pull'">{{ allLoaded?'没有更多了':'上拉加载更多' }}</span>-->
          <!--<span v-show="bottomStatus === 'drop'">松开加载更多</span>-->
          <!--<span v-show="bottomStatus === 'loading'">加载中</span>-->
        <!--</div>-->
      </mt-loadmore>
      <div class="refresh" @click="refreshNews">
        <span :class="{'animation': isAnimation}"></span>
      </div>
    </div>
    <c-footer></c-footer>
  </div>
</template>
<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import CFooter from '../components/Footer.vue'
  import CLoading from '../components/Loading.vue'
  import CWarning from '../components/Warning.vue'
  import CLoadmore from '../components/Loadmore.vue'
  import CHomeNav from '../components/HomeNav.vue'
  import CNewslist from '../components/Newslist.vue'
  import { mapActions, mapState } from 'vuex'
  import { timeLineShare, shareAppMessage, shareQQ } from '../utils/wxShare'
  import axios from 'axios'
  import api from '../utils/api.js'

  export default {
    data () {
      return {
        touchPosition: 0,
        allLoaded: false,
        bottomStatus: ''
      }
    },
    components: {
      swiper,
      swiperSlide,
      CFooter,
      CLoading,
      CWarning,
      CLoadmore,
      CHomeNav,
      CNewslist
    },
    mounted () {
      // window.addEventListener('scroll', this.yoScroll)
      var title = '产业创客'
      var link = window.location.href
      var imgUrl = ''
      var desc = '产业创客，聚焦互联网+产业赋能，在这里您可以了解产业动态和互联网融合的前沿信息'
      // 分享到朋友圈
      timeLineShare({
        title,
        link,
        imgUrl,
        success () {
        },
        cancel () {
        }
      })
      // 分享给朋友
      shareAppMessage({
        title,
        desc,
        link,
        imgUrl,
        success () {
        },
        cancel () {
        }
      })
      // 分享QQ朋友
      shareQQ({
        title,
        link,
        imgUrl,
        success () {
        },
        cancel () {
        }
      })
    },
    created () {
      if (!localStorage.getItem('userId')) {
        this.getOpenId()
      } else {
        this.getChannelList()
        // if (Object.keys(this.list[type]).length > 0) return false
        this.$store.dispatch('getChannelId', this.homeNewsIndex)
        this.getNews({
          type: this.channelId
        })
      }
    },
    watch: {
      $route (to, from) {
        if (to.path.includes('home')) {
          const type = to.params.type
          if (Object.keys(this.list[type]).length > 0) {
            this.$store.state.home.ifReturnMsg = true
            return false
          }
          // debugger
          // this.$store.dispatch('getChannelId', type)
          // this.$store.state.home.list[type] = []
          // this.getNews({
          //   type: this.channelId
          // })
        }
        if (to.path.includes('login') && from.path.includes('content')) {
          this.$store.state.loginStore.fromPath = from.path
        } else if (to.path === '/login') {
          this.$store.state.loginStore.fromPath = ''
        }
      },
      homeNewsIndex () {
        this.swiper.slideTo(this.homeNewsIndex)
      }
    },
    methods: {
      async end () {
        this.$store.state.home.newsIndex = this.swiper.activeIndex
        console.log(this.swiper.activeIndex)
        this.$store.dispatch('getChannelId', this.swiper.activeIndex)
        this.$router.push({path: '/home' + '/' + this.swiper.activeIndex})
        if (Object.keys(this.list[this.swiper.activeIndex]).length > 0) return false
        this.getNews({
          type: this.channelId
        })
      },
      ...mapActions([
        'getNews',
        'getMoreNews',
        'getChannelList',
        'getChannelId'
      ]),
      changeColor (index) {
        this.list[this.$store.state.home.newsIndex][index].grey = true
      },
      getOpenId () {
        var code = this.$route.query.code || window.location.href.split('&')[0].split('=')[1] || ''
        let params = {
          code: code
        }
        api.post('/getOpenId', params).then((res) => {
          var openid = res.data.openid
          this.$store.state.home.openid = openid
          sessionStorage.setItem('openid', openid)
          // 登录
          this.visitorLoginInWechat(openid)
        })
      },
      // 游客登录
      visitorLoginInWechat (openid) {
        let params = {
          openid: openid
        }
        api.postForm('/visitorLoginInWechat', params).then((res) => {
          localStorage.setItem('userId', res.data.userId)
          if (res.msg === '游客登录登录成功') {
            sessionStorage.setItem('clearSessionId', res.data.clearSessionId)
            this.getChannelList()
            this.$store.dispatch('getChannelId', this.homeNewsIndex)
            this.getNews({
              type: this.channelId
            })
          }
          if (res.msg === '自动登录登录成功') {
            sessionStorage.setItem('sessionId', res.data.sessionId)
            this.getChannelList()
            this.$store.dispatch('getChannelId', this.homeNewsIndex)
            this.getNews({
              type: this.channelId
            })
          }
          if (res.msg === '自动登录用户名或密码不正确') {
            this.$router.push({path: '/accountLogin'})
          }
        })
      },
      loadmoreNews () {
        this.getMoreNews({
          type: this.channelId
        })
      },
      touchmove (e) {
        if (!this.$route.params.type) return false
        const disY = e.touches[0].pageY - this.touchPosition
        const rotate = disY / 300 * 360
        if (disY < 30) return false
        this.$refs.refresh.style.transform = `translate(-50%, ${Math.min(disY, 200)}px) rotate(${rotate}deg)`
      },
      touchend (e) {
        document.body.removeEventListener('touchmove', this.touchmove)
        document.body.removeEventListener('touchend', this.touchend)
        if (!this.$route.params.type) return false
        const disY = e.changedTouches[0].pageY - this.touchPosition
        if (disY < 30) return false
        this.$refs.refresh.style.transform = ''
        this.$refs.refresh.style.transition = 'transform 0.5s linear'
        if (disY < 200) return false
        this.refreshNews({
          type: this.$route.params.type
        })
      },
      search () {
        this.$store.state.home.search = []
        this.$router.push({path: '/search'})
      },
      // yoScroll (e) {
      //   // let documentHeight = parseInt(document.getElementsByClassName('swiper-slide-active')[1].offsetHeight) + 88
      //   e.stopPropagation()
      //   let documentHeight = document.documentElement.offsetHeight
      //   let viewPortHeight = window.innerHeight
      //   let scrollHeight = window.pageYOffset ||
      //     document.documentElement.scrollTop ||
      //     document.body.scrollTop || 0
      //   let isScrollBottom = documentHeight - viewPortHeight - scrollHeight < 1
      //   if (isScrollBottom && !this.loading) {
      //     this.loadmoreNews()
      //   }
      // },
      refreshNews () {
        window.scrollTo(0, 0)
        // this.$store.state.home.loading = true
        this.$store.state.home.isAnimation = true
        this.$store.dispatch('refreshNews', {type: this.$store.state.home.channelId})
      },
      loadTop () {
        let $this = this
        this.allLoaded = false
        this.refreshNews()
        $this.$refs.loadmore.onTopLoaded()
      },
      // 此方法用于 上拉加载
      loadBottom () {
        if (!this.noMore) {
          this.loadmoreNews()
        } else {
          this.allLoaded = true
        }
        this.$refs.loadmore.onBottomLoaded()
      },
      handleBottomChange (status) {
        this.bottomStatus = status
      }
    },
    computed: {
      swiper () {
        return this.$refs['swiper-wrapper'].swiper
      },

      // 这里的三点叫做 : 扩展运算符,mapGetters、mapActions 和 mapState 类似 , mapGetters 一般也写在 computed 中 , mapActions 一般写在 methods 中。
      ...mapState({
        channellist: state => state.home.channellist,
        channelId: state => state.home.channelId,
        list: state => state.home.list,
        noMore: state => state.home.noMore,
        loading: state => state.home.loading,
        ifReturnMsg: state => state.home.ifReturnMsg,
        loadmore: state => state.home.loadmore,
        ifReturnMore: state => state.home.ifReturnMore,
        newsLength: state => state.home.newsLength,
        ifReturnRefresh: state => state.home.ifReturnRefresh,
        homeNewsIndex: state => state.home.newsIndex,
        newsListSource: state => state.home.newsListSource,
        isAnimation: state => state.home.isAnimation
      }),
      listCon () {
        return this.$store.state.home.list[this.$route.params.type]
        // return this.list[this.$route.params.type || '0']
      },
      isLogin () {
        return this.$store.state.loginStore.loginStatus || localStorage.getItem('userName')
      }
    },
    // 离开页面时，记录新闻的类型
    beforeRouteLeave (to, from, next) {
      this.$store.commit('LOG_TYPE', from.params.type)
      next()
    }
  }
</script>
<style lang="scss">
  @import '../assets/style/common.scss';
  .content {
    // 上拉加载bug ，需要给mt-loadmore 标签的父级加下面两个样式
    overflow: scroll;
  }
  .home-header {
    background: #fff;
    border-bottom: 2px solid #F5F5F5;
    height: 88px;
  }
  .search {
    position: absolute;
    z-index: 300;
    right: 0px;
    top: 15px;
    width: 65px;
    height: 60px;
    text-align: center;
    background: url(../assets/image/bg-search.png) no-repeat 100%;
    i {
      display: inline-block;
      width: 28px;
      height: 28px;
      background: url(../assets/image/search.png);
      background-size: 100%;
      margin-top: 12px;
    }
  }
  #swiper-container {
    width: 100%;
    height: 100%;
    .swiper-box {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
    }
  }
  .refresh{
    position: fixed;
    bottom: 140px;
    right: 60px;
    width: 100px;
    height: 100px;
    background: #fff;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    box-shadow: 0px 0px 20px 15px rgba(0,0,0,.1);
    z-index: 1000;
    span {
      display: inline-block;
      width: 100px;
      height: 100px;
      background: url("../assets/image/refresh.png") no-repeat;
      -webkit-background-size: 100%;
      background-size: 100%;
    }
  }
  @keyframes rotate {
    from {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animation{
    -webkit-animation: rotate 1s linear infinite;
    -o-animation: rotate 1s linear infinite;
    animation: rotate 1s linear infinite;
  }
</style>
