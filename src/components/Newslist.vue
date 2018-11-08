<template>
  <div class="newsList">
    <ul v-for="(item, index) in listCon"
        :key="index" @click="read(index)">
      <router-link :to="{path: '/content/' + item.newsId}" tag="li" :class="{'active': isActive}" class="news_box clearfix" v-if="item.title">
        <!-- 三个图片 -->
        <div class="news-three-image" v-if="item.showType === 3">
          <div class="news-title" v-html="item.title" :class="{ grey: item.grey }"></div>
          <div class="news-image">
            <img v-for="img in item.imageList" :src="img | ratioImg"/>
          </div>
          <div class="news-info clearfix">
            <span class="top" v-if="item.top>0">置顶</span>
            <span class="source-name">{{item.sourceName}}</span>
            <span class="date" v-if="item.publishTime !== '0'">{{item.publishTime}}</span>
          </div>
        </div>
        <!-- 一个图片 -->
        <div class="news-one-image clearfix" v-if="item.showType === 1">
          <div class="item-l">
            <div class="news-title" v-html="item.title" :class="{ grey: item.grey }"></div>
            <div class="news-info">
              <span class="top" v-if="item.top>0">置顶</span>
              <span class="source-name">{{item.sourceName}}</span>
              <span class="date" v-if="item.publishTime !== '0'">{{item.publishTime}}</span>
            </div>
          </div>
          <div class="item-r">
            <img :src="item.imageList[0] | ratioImg"/>
          </div>
        </div>
        <!-- 无图片 -->
        <div class="news-no-image clearfix" v-if="item.showType === 0" :class="{zk: item.expand}">
          <div class="news-title" v-html="item.title" :class="{ grey: item.grey }"></div>
          <div class="news-detail" :class="{ grey: item.grey }">
            {{item.abstracts}}
            <i>继续阅读</i>
          </div>
          <div class="news-info clearfix">
            <span class="top" v-if="item.top>0">置顶</span>
            <span class="source-name">{{item.sourceName}}</span>
          </div>
        </div>
      </router-link>
      <div class="expand" v-if="item.showType === 0 && !item.expand" @click.stop="expand(index)">
        <span class="zk">展开</span>
        <i></i>
      </div>
      <div class="retract" v-if="item.showType === 0 && item.expand" @click.stop="expand(index)">
        <span class="zk">收起</span>
        <i></i>
      </div>
    </ul>
    <div style="height: 30px;"></div>
    <c-loadmore :flag="flag" :ifFlag="ifFlag" @event="$emit('event')" v-if="ifLoadmore" v-show="!noMore && showLoadmore"></c-loadmore>
    <div class="nullData" v-if="ifLoadmore" v-show="!loading && noMore && showLoadmore">
      <p>暂无更多数据</p>
    </div>
    <c-warning v-show="!loading && !ifReturnMsg && !collectListSource" class="warning" @reload="getNews({type: channelId})">
    </c-warning>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import CLoadmore from './Loadmore.vue'
  import CWarning from './Warning.vue'
  import moment from 'moment'
  import 'moment/locale/zh-cn'
  moment.locale('zh-cn')

  export default {
    data () {
      return {
        listDetail: [],
        showLoadmore: false
      }
    },
    created () {
      if (this.$route.name === 'home') {
        this.listDetail = this.list[this.newsIndex]
        this.showLoadmore = true
      }
    },
    props: {
      // 新闻列表
      listCon: {
        require: true
      },
      // 是否可以请求更多
      ifLoadmore: {
        default: true
      },
      // 是否请求
      flag: {
        require: true
      },
      // 请求是否成功
      ifFlag: {
        require: true
      },
      isActive: true
    },
    computed: {
      ...mapState({
        channelId: state => state.home.channelId,
        loading: state => state.home.loading,
        ifReturnMsg: state => state.home.ifReturnMsg,
        loadmore: state => state.home.loadmore,
        ifReturnMore: state => state.home.ifReturnMore,
        collectListSource: state => state.home.collectListSource,
        noMore: state => state.home.noMore,
        list: state => state.home.list,
        newsIndex: state => state.home.newsIndex,
        search: state => state.home.search,
        collection: state => state.home.collection,
        test: state => state.home.test
      }),
      tabname () {
        return this.$route.name
      }
    },
    components: {
      CLoadmore,
      CWarning
    },
    methods: {
      read (index) {
        // console.log(this.tabname)
        if (this.listDetail[index]) {
          this.list[this.newsIndex][index].grey = true
        } else {
          this.$emit('changeColor', index)
        }
        this.$emit('changeColor', index)
      },
      expand (index) {
        if (this.tabname === 'home') {
          this.list[this.newsIndex][index].expand = !this.list[this.newsIndex][index].expand
        } else if (this.tabname === 'collect') {
          console.log(this.$store.state.home.collection)
          this.$store.state.home.collection[index].expand = !this.$store.state.home.collection[index].expand
          // this.collection[index].expand = !this.collection[index].expand
        } else {
          this.$store.state.home.search[index].expand = !this.$store.state.home.search[index].expand
          // this.search[index].expand = !this.search[index].expand
        }
      }
    },
    watch: {
      $route () {
        if (this.$route.name === 'home') {
          this.listDetail = this.list[this.newsIndex]
        }
      }
    },
    filters: {
      dateFormat (time) {
        return moment(time).startOf('hour').fromNow()
      }
    }
  }
</script>
<style lang="scss">
  .newsList {
    ul {
      position: relative;
      li {
        .news-three-image {
          padding: 24px 30px 21px;
          border-bottom: 2px solid #F5F5F5;
          .news-title {
            width: 680px;
            font-size: 32px;
            color: #000;
            max-height: 84px;
            line-height: 40px;
            overflow: hidden;
          }
          .news-image {
            margin: 20px 0 11px 0;
            img {
              width: 218px;
              height: 163px;
              margin-right: 18px;
            }
            img:last-child {
              margin-right: 0;
            }
          }
          .news-info {
            .top {
              float: left;
              width: 54px;
              height: 28px;
              line-height: 28px;
              margin: 6px 12px 0 0;
              border-radius: 6px;
              border: 2px solid #92B4F7;
              font-size: 20px;
              color: #2E79F4;
              text-align: center;
            }
            .source-name {
              float: left;
              height: 33px;
              line-height: 33px;
              color: #C6C6C6;
              font-size: 24px;
              margin-top: 4px;
            }
            .date {
              float: right;
              height: 33px;
              line-height: 33px;
              color: #C6C6C6;
              font-size: 24px;
            }
          }
          .grey {
            color: #ccc;
            b {
              color: #ccc !important;
            }
          }
        }
        .news-one-image {
          padding: 26px 30px;
          border-bottom: 2px solid #F5F5F5;
          .item-l {
            float: left;
            width: 450px;
            margin-right: 30px;
            .news-title {
              font-size: 32px;
              color: #000;
              height: 90px;
              line-height: 45px;
              overflow: hidden;
              margin-bottom: 38px;
            }
            .news-info {
              .top {
                float: left;
                width: 54px;
                height: 28px;
                line-height: 28px;
                margin: 2px 9px 0 0;
                border-radius: 6px;
                border: 2px solid #92B4F7;
                font-size: 20px;
                color: #2E79F4;
                text-align: center;
              }
              .source-name {
                float: left;
                height: 33px;
                line-height: 40px;
                color: #C6C6C6;
                font-size: 24px;
              }
              .date {
                float: right;
                height: 33px;
                line-height: 33px;
                color: #C6C6C6;
                font-size: 24px;
              }
            }
            .grey {
              color: #ccc;
              b {
                color: #ccc !important;
              }
            }
          }
          .item-r {
            float: right;
            width: 210px;
            img {
              display: block;
              width: 210px;
              height: 158px;
            }
          }
        }
        .news-no-image {
          padding: 26px 30px 21px;
          border-bottom: 2px solid #F5F5F5;
          .news-title {
            width: 680px;
            color: #000;
            font-size: 34px;
            max-height: 84px;
            overflow: hidden;
            line-height: 42px;
            margin-bottom: 45px;
          }
          .news-detail {
            color: #383838;
            font-size: 28px;
            line-height: 48px;
            padding-left: 30px;
            border-left: 2px solid #EEE;
            display: none;
            i {
              color: #2E79F4;
              font-style: normal;
            }
          }
          .grey {
            color: #ccc;
            b {
              color: #ccc !important;
            }
          }
          .news-info {
            position: relative;
            .top {
              float: left;
              width: 54px;
              height: 28px;
              line-height: 28px;
              margin: 7px 9px 0 0;
              border-radius: 6px;
              border: 2px solid #92B4F7;
              font-size: 20px;
              color: #2E79F4;
              text-align: center;
            }
            .source-name {
              float: left;
              height: 33px;
              line-height: 33px;
              color: #C6C6C6;
              font-size: 24px;
              margin-top: 5px;
            }
          }
          .grey {
            color: #ccc;
          }
        }
        .zk {
          .news-title {
            margin-bottom: 28px;
          }
          .news-detail {
            display: block;
          }
          .news-info {
            margin-top: 30px;
            .top {
              display: none;
            }
            .source-name {
              margin-left: 30px;
            }
          }
        }
      }
      .expand, .retract {
        position: absolute;
        right: 30px;
        bottom: 21px;
        height: 33px;
        line-height: 33px;
        color: #C6C6C6;
        font-size: 24px;
        span {
        }
        i {
          float: right;
          display: inline-block;
          width: 20px;
          height: 11px;
          background: url(../assets/image/icon-expand.png);
          background-size: 100%;
          margin: 10px 0 0 4px;
        }
      }
      .retract {
        i {
          background: url(../assets/image/icon-retract.png);
          background-size: 100%;
        }
      }
    }
  }
  .nullData {
    font-size: 26px;
    color: #999999;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
