<template>
  <div>
    <div class="content article-content" v-if="newsDetailsource">
      <c-loading v-show="loading" class="loading"></c-loading>
      <c-warning v-show="!loading && !ifReturnMsg"
        class="warning"
        @reload="getArticle({id: $route.params.id})"></c-warning>
      <div v-show="!loading && ifReturnMsg">
        <div class="title"> {{article.title}} </div>
        <div class="detail-source"> {{article.detail_source}} </div>
        <div class="collection clearfix" :class="{ active:
        isStar && isLogin && isColumnContent === 'home', active2:
          isStar && isLogin && isColumnContent === 'partyBuild', active3: isStar && isLogin && isColumnContent === 'maker', 'party-collect': isColumnContent === 'partyBuild', 'maker-collect': isColumnContent === 'maker'}" v-if="source">
          <i v-show="(!isStar && isLogin) || !isLogin"></i>
          <span v-show="isStar && isLogin" @click="addCollection">已收藏</span>
          <span v-show="!isStar && isLogin" @click="addCollection">收藏</span>
          <span v-show="!isLogin" @click="goLogin">收藏</span>
        </div>
        <div class="main-content" v-html="article.content"></div>
        <div class="source">来源：{{article.detail_source}}</div>
        <div class="wxcode clearfix">
          <div class="code"><img src="../assets/image/wxcode.png"/> </div>
          <div class="desc">
            <h4>产业创客</h4>
            <p>秉持科学至上，专注产业升级 <br/> 互联网+科技聚焦，高端人群都在这里！</p>
            <p><img src="../assets/image/wxcode-arrow.png"/></p>
          </div>
        </div>
      </div>
    </div>
    <e-internet v-else></e-internet>
  </div>
</template>
<script>
import {mapActions, mapState, mapMutations} from 'vuex'
import CLoading from '../components/Loading.vue'
import CWarning from '../components/Warning.vue'
import CComment from '../components/Comment.vue'
import axios from 'axios'
import { timeLineShare, shareAppMessage, shareQQ } from '../utils/wxShare'
import { source } from '../utils/source'
import { Toast } from 'mint-ui'
import EInternet from '../components/ErrorInternet.vue'

export default {
  data () {
    return {
      ifModal: false,
      source: true
    }
  },
  components: {
    CLoading,
    CWarning,
    CComment,
    EInternet
  },
  created () {
    let id = this.$route.params.id
    this.getArticle({id: id})
    if (source()) {
      this.source = true
    } else {
      this.source = false
    }
  },
  beforeRouteEnter (to, from, next) {
    const id = to.params.id
    if (!id) return false
    next(vm => {
      vm.getArticle({id: id})
    })
    // 微信分享
    var params = {
      newsId: id,
      source: 'inside',
      userId: localStorage.getItem('userId')
    }
    if (!source()) {
      params.newsId = id.split('&')[0]
      params.source = 'outside'
      params.userId = '0'
    }
    axios.post('/news/getNewsDetails', params).then((res) => {
      if (res.data.data.isSuccessful) {
        // 获取标题  链接  图片地址  简介
        var title = '产业创客-' + res.data.data.newsDetails.title
        var link = window.location.href
        var qqlink = link.split('=')[0] + '=' + link.split('=')[1] + '=&from=qqshare=' + link.split('=')[2]
        var imgUrl = ''
        var desc = ''
        var el = document.createElement('html')
        el.innerHTML = res.data.data.newsDetails.details
        if (el.getElementsByTagName('img').length) {
          imgUrl = el.getElementsByTagName('img')[0].src
        } else {
          imgUrl = 'http://106.37.72.179/logo.png'
        }
        if (el.getElementsByTagName('p').length) {
          desc = el.getElementsByTagName('p')[0].innerHTML
          if (desc.length > 40) {
            desc = desc.replace(/<[^>]+>/g, '').replace(/&nbsp;/ig, '').substring(0, 40) + '...'
          }
        }
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
          desc,
          qqlink,
          imgUrl,
          success () {
          },
          cancel () {
          }
        })
      }
    })
  },
  methods: {
    ...mapMutations([
      'ADD_COLLECTION',
      'REMOVE_COLLECTION'
    ]),
    ...mapActions([
      'getArticle'
    ]),
    addCollection () {
      let id = this.$route.params.id
      axios.post('/news/starNews', {userId: localStorage.getItem('userId'), newsId: id}).then((res) => {
          if (res.status === 200) {
            this.$store.state.home.isStar = !(this.$store.state.home.isStar)
            Toast({
              message: res.data.msg
            })
            this.getCollection()
          }
        })
    },
    getCollection () {
      let params = {
        userId: localStorage.getItem('userId'),
        pageNum: 0,
        source: 'inside'
      }
      if (!source()) {
        params.source = 'outside'
        params.userId = '0'
      }
      this.$store.dispatch({
        type: 'getStarNewsList',
        data: params
      })
    },
    goLogin () {
      this.$router.push({path: '/login'})
    }
  },
  computed: {
    ...mapState({
      article: state => state.home.article,
      loading: state => state.home.loading,
      ifReturnMsg: state => state.home.ifReturnMsg,
      isStar: state => state.home.isStar,
      localCollection: state => state.home.localCollection,
      newsDetailsource: state => state.home.newsDetailsource,
      isColumnContent: state => state.home.isColumnContent,
      collection: state => state.home.collection
    }),
    isLogin () {
      return this.$store.state.loginStore.loginStatus || localStorage.getItem('userName')
    }
  }
}
</script>
<style lang="scss">
  @import '../assets/style/common.scss';
  @import '../assets/style/transition.scss';
  .article-content {
    padding-top: px2rem(20px);
    padding-left: px2rem(24px);
    padding-right: px2rem(24px);
    .title {
      font-size: 48px !important;
      color: #222222;
      line-height: 66px;
      font-weight: bold;
    }
    .detail-source {
      float: left;
      font-size: px2rem(24px) !important;
      line-height: px2rem(40px);
      margin: px2rem(30px) 0;
      color: #A7A7A9;
    }
    .source {
      margin-top: px2rem(50px);
      font-size: px2rem(24px) !important;
      color: #A7A7A9;
    }
    .collection {
      float: right;
      color: #0056FF;
      border: 2px solid #0056FF;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      margin: 30px 0;
      width: 98px;
      height: 48px;
      i {
        float: left;
        width: 20px;
        height: 19px;
        background: url(../assets/image/collect-blue1-star.png);
        background-size: 100%;
        margin: 14px 6px 0 10px;
      }
      span {
        float: left;
        font-size: 22px;
        height: 48px;
        line-height: 48px;
        width: auto;
      }
    }
    .party-collect {
      color: #DF3231;
      border: 2px solid #DF3231;
      i {
        background: url(../assets/image/collect-star.png);
        background-size: 100%;
      }
    }
    .maker-collect {
      color: #01ACAA;
      border: 2px solid #01ACAA;
      i {
        background: url(../assets/image/collect-blue-star.png);
        background-size: 100%;
      }
    }
    .active {
      background: #0056FF;
      color: #fff;
      span {
        height: 48px;
        width: 98px;
        text-align: center;
      }
    }
    .active2 {
      background: #DF3231;
      color: #fff;
      border: 1px solid #DF3231;
      span {
        height: 48px;
        width: 98px;
        text-align: center;
      }
    }
    .active3 {
      background: #01ACAA;
      color: #fff;
      border: 1px solid #01ACAA;
      span {
        height: 48px;
        width: 98px;
        text-align: center;
      }
    }
    .main-content {
      clear: both;
      line-height: px2rem(54px);
      color: #222222;
      font-size: 36px !important;
      p {
        padding: px2rem(20px) 0;
        span{
          font-size: 36px !important;
        }
      }
    }
    img {
      max-width: 100% !important;
      height: auto;
      display: block;
      margin: 0 auto;
      padding: px2rem(10px) 0;
    }
    .wxcode {
      margin-top: px2rem(30px);
      width: 100%;
      .code {
        float: left;
        width: 310px;
        img {
          width: 310px;
        }
      }
      .desc {
        float: left;
        width: 380px;
        h4 {
          margin-top: px2rem(25px);
          font-size: px2rem(36px);
          color: #0350CF;
        }
        p {
          font-size: px2rem(24px);
          color: #A2A4B4;
          line-height: px2rem(40px);
          img {
            margin: 0 !important;
            height: px2rem(67px);
          }
        }
      }
    }
  }
</style>

