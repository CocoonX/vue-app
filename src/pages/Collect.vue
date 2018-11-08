<template>
  <div>
    <div class="content" style="padding-top: 10px;" v-if="collectListSource">
      <transition :name="direction">
        <c-newslist
          :listCon="collection"
          :ifLoadmore="false"
          v-if="collection_tag === 'initial'" @changeColor="changeColor"></c-newslist>
        <div v-else>
          <ul class="local_collection_items" v-if="localCollection.length">
            <li
              v-for="item in localCollection"
              :key="item.id"
              class="local_collection_item"
              @click="$router.push({path: '/content/' + item.id})"
              >
              <img v-lazy="item.src" alt="avatar" class="local_collection_img">
              <div class="local_collection_title">{{item.title}}</div>
              <div class="local_collection_remove" @click.stop="removeCollection(item.id)">
                <Icon type="ios-trash-outline" color="#fff"></Icon>
              </div>
            </li>
          </ul>
        </div>
      </transition>
      <div v-show="isEmpty" class="empty" v-if="!collection.length">
        <img src="../assets/image/empty.png"/>
        <p>还没有收藏文章，先去<a @click="goNewsList">看看</a>吧！</p>
      </div>
    </div>
    <c-footer v-if="collectListSource"></c-footer>
    <e-internet v-if="!collectListSource"></e-internet>
  </div>
</template>
<script>
import CNewslist from '../components/Newslist.vue'
import CFooter from '../components/Footer.vue'
import CBack from '../components/Back.vue'
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import { source } from '../utils/source'

import EInternet from '../components/ErrorInternet.vue'
import { timeLineShare, shareAppMessage, shareQQ } from '../utils/wxShare'

export default {
  data () {
    return {
      collection_tag: 'initial',
      direction: '',
      ifModal: false,
      isEmpty: true,
      id: ''
    }
  },
  mounted () {
    var title = '产业创客'
    var link = window.location.href.split('#')[0] + '#/home/0'
    var imgUrl = 'http://106.37.72.179/logo.png'
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
    this.getCollection()
  },
  watch: {
    $route (to, from) {
      if (to.name === 'collect') {
        this.getCollection()
      }
    }
  },
  methods: {
    changeColor (index) {
      this.collection[index].grey = true
      var collectionParse = JSON.parse(localStorage.collection)
      collectionParse[index].grey = true
      localStorage.setItem('collection', JSON.stringify(collectionParse))
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
    goNewsList () {
      this.$router.push({path: '/home'})
    },
    // 显示默认收藏标签
    initial () {
      this.collection_tag = 'initial'
      this.direction = 'collection-right'
      this.$refs.active.style.transform = 'translateX(0)'
    }
  },
  components: {
    CFooter,
    CBack,
    CNewslist,
    EInternet
  },
  computed: {
    ...mapState({
      collection: state => state.home.collection,
      localCollection: state => state.home.localCollection,
      positions: state => state.home.positions,
      source: state => state.home.source,
      collectListSource: state => state.home.collectListSource
    })
  }
}
</script>

<style lang="scss">
  @import '../assets/style/common.scss';
  .empty{
    margin: 320px auto;
    text-align: center;
    img{
      width: px2rem(180px);
    }
    p{
      font-size: 32px;
      margin-top: px2rem(30px);
      color: #393939;
    }
  }
  .collection_tag {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: px2rem(80px);
    z-index: 500;
    font-size: 0;
    .tag {
      display: inline-block;
      width: 2rem;
      height: 100%;
      font-size: px2rem(30px);
      line-height: px2rem(76px);
      text-align: center;
    }
    .active {
      display: inline-block;
      height: px2rem(4px);
      width: 2rem;
      background: #0056FF;
      position: absolute;
      left: 0;
      bottom: 0;
      transition: transform 0.6s ease;
    }
  }
</style>