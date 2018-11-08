<template>
  <div>
    <!--<c-back class="header"></c-back>-->
    <div class="content search_content">
      <div class="search_box">
        <Icon type="ios-search" class="search_icon"></Icon>
        <input type="text" placeholder="输入你想搜索的内容" ref="search" v-model="keyword" @keyup.enter="getSearch(keyword)" @click="ifHistory = true">
        <!--<router-link class="cancel" to="/home">取消</router-link>-->
        <span class="cancel" @click="returnHome()">取消</span>
        <transition name="slide">
          <div class="history" v-show="ifHistory && history.items.length">
            <ul class="history_items">
              <li class="history_item"
                  v-for="item in history.items"
                  :key="item.id">
                <span class="history_item_content" @click="historySearch(item)">{{item.content}}</span>
                <span @click="REMOVE_HISTORY(item.id)">
                  <Icon type="ios-close-empty" class="history_item_close"></Icon>
                </span>
              </li>
            </ul>
            <div class="manage_history">
              <span class="clear_history" @click="CLEAR_HISTORY">清空历史</span>
              <span class="close_history" @click="ifHistory = false">关闭</span>
            </div>
          </div>
        </transition>
      </div>

      <c-loading v-if="loading"></c-loading>
      <c-warning v-else-if="!ifReturnSearch" @reload="reSearch"></c-warning>

      <mt-loadmore
        v-else-if="searchlist.length"
        :top-method="loadTop"
        ref="loadmore"
        :bottom-method="loadBottom"
        :auto-fill="false"
        :bottom-all-loaded="allLoaded"
        @bottom-status-change="handleBottomChange">
      <c-newslist :listCon="searchlist"
                  :flag="loadmoreSearch" :ifFlag="ifReturnMoreSearch"></c-newslist>
        <div slot="bottom" class="mint-loadmore-top">
          <span v-show="bottomStatus === 'pull'">{{ allLoaded?'没有更多了':'上拉加载更多' }}</span>
          <span v-show="bottomStatus === 'drop'">松开加载更多</span>
          <span v-show="bottomStatus === 'loading'">加载中</span>
        </div>
      </mt-loadmore>

      <div class="empty-con" v-else-if="!searchlist.length && !noMore">
        <div class="search-history" v-show="history.items.length">
          <div class="no-data" v-show="noDataFlag">未查询到相关新闻</div>
          <div class="search-title">搜索历史</div>
          <div class="clear" @click="CLEAR_HISTORY"><i class="trash"></i></div>
          <div class="history1">
            <ul class="history_items">
              <li class="history_item"
                  v-for="item in history.items"
                  :key="item.id">
                <span class="history_item_content" @click="historySearch(item)">{{item.content}}</span>
                <span @click="REMOVE_HISTORY(item.id)">
                  <Icon type="ios-close-empty" class="history_item_close"></Icon>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="search_img" v-show="!history.items.length">
          <img src="../assets/image/search-img.png"/>
          <p>搜索感兴趣的内容</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import CBack from '../components/Back.vue'
import CNewslist from "../components/Newslist.vue";
import CLoading from "../components/Loading.vue";
import CWarning from "../components/Warning.vue";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    // CBack,
    CNewslist,
    CLoading,
    CWarning
  },
  data() {
    return {
      keyword: "",
      offset: 0,
      cache: "",
      ifHistory: false,
      allLoaded: false,
      bottomStatus: ""
    };
  },
  // mounted () {
  //   window.addEventListener('scroll', this.handleScroll)
  // },
  watch: {
    $route(to, from) {
      if (to.path.includes("home")) {
        this.keyword = "";
        this.ifHistory = false;
      }
    }
  },
  methods: {
    ...mapMutations(["ADD_HISTORY", "REMOVE_HISTORY", "CLEAR_HISTORY"]),
    getSearch(keyword) {
      this.cache = keyword.trim();
      if (!this.cache) {
        return false;
      }
      this.keyword = keyword;
      this.offset = 0;
      this.$store.state.home.search = [];
      this.$store.dispatch("getSearch", {
        offset: this.offset,
        keyword: this.cache
      });
      this.ADD_HISTORY(this.cache);
      this.ifHistory = false;
      this.$refs.search.blur();
    },
    reSearch() {
      console.log("reSearch");
      console.log(this.offset, this.cache);
      this.$store.dispatch("getSearch", {
        offset: this.offset,
        keyword: this.cache
      });
    },
    getMoreSearch() {
      this.offset += 1;
      this.$store.dispatch("getMoreSearch", {
        offset: this.offset,
        keyword: this.cache
      });
    },
    historySearch(item) {
      this.REMOVE_HISTORY(item.id);
      this.getSearch(item.content);
    },
    returnHome() {
      this.$store.state.home.search = [];
      this.keyword = "";
      this.ifHistory = false;
      this.$router.push({ path: "/home" });
    },
    // handleScroll (e) {
    //   e.stopPropagation()
    //   let documentHeight = document.documentElement.offsetHeight
    //   let viewPortHeight = window.innerHeight
    //   let scrollHeight = window.pageYOffset ||
    //     document.documentElement.scrollTop ||
    //     document.body.scrollTop || 0
    //   // console.log(scrollHeight)
    //   let isScrollBottom = documentHeight - viewPortHeight - scrollHeight < 1
    //   if (isScrollBottom && !this.loading) {
    //     this.getMoreSearch()
    //   }
    // },
    loadTop() {
      let $this = this;
      this.allLoaded = false;
      this.$store.dispatch("getSearch", {
        offset: this.offset,
        keyword: this.cache
      });
      $this.$refs.loadmore.onTopLoaded();
    },
    // 此方法用于 上拉加载
    loadBottom() {
      if (!this.noMore) {
        this.getMoreSearch();
      } else {
        this.allLoaded = true;
      }
      this.$refs.loadmore.onBottomLoaded();
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    }
  },
  computed: {
    ...mapState({
      loading: state => state.home.loading,
      ifReturnSearch: state => state.home.ifReturnSearch,
      search: state => state.home.search,
      noDataFlag: state => state.home.noDataFlag,
      loadmoreSearch: state => state.home.loadmoreSearch,
      ifReturnMoreSearch: state => state.home.ifReturnMoreSearch,
      history: state => state.home.history,
      noMore: state => state.home.noMore
    }),
    searchlist() {
      return this.search;
    }
  }
};
</script>

<style lang="scss">
@import "../assets/style/common.scss";
.content {
  // 上拉加载bug ，需要给mt-loadmore 标签的父级加下面两个样式
  height: 100vh;
  overflow: scroll;
}
.search_content {
  background: #fff;
  padding-top: px2rem(100px);
  padding-bottom: 0;
  .search_img {
    margin: 0px auto;
    margin-top: px2rem(200px);
    width: 50%;
    width: 50%;
    text-align: center;
    img {
      width: 220px;
      height: 169px;
    }
    p {
      font-size: 30px;
      margin-top: 30px;
      color: #393939;
    }
  }
}
.search_box {
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
  height: px2rem(80px);
  text-align: center;
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px 0px;
  width: 100%;
  z-index: 100;
  .search_icon {
    font-size: 32px;
    font-weight: bold;
    position: absolute;
    left: 60px;
    top: 34px;
    color: #9a9ea1;
  }
  .cancel {
    font-size: 28px;
    line-height: px2rem(40px);
    margin-left: px2rem(20px);
    color: #4587f4;
  }
  input {
    font-size: 28px;
    width: 580px;
    height: 60px;
    background: #f5f5f5;
    text-indent: 60px;
    -webkit-border-radius: 28px;
    -moz-border-radius: 28px;
    border-radius: 28px;
    border-style: none;
  }
}
.history {
  position: absolute;
  top: px2rem(80px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: #fafafa;
  width: px2rem(600px);
  text-align: left;
  border: 1px solid #ddd;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  box-shadow: 0 px2rem(4px) px2rem(4px) #eee;
  overflow: hidden;
  font-size: px2rem(26px);
  .history_items {
    overflow: auto;
    height: px2rem(300px);
    overflow-x: hidden;
  }
  .history_item {
    overflow: hidden;
    text-overflow: ellipsis;
    padding: px2rem(10px) px2rem(20px);
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    height: px2rem(60px);
    line-height: px2rem(40px);
    transition: all 1s linear;
    .history_item_content {
      display: inline-block;
      width: px2rem(440px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .history_item_close {
      float: right;
      font-size: px2rem(50px);
      margin-top: -1 * px2rem(5px);
    }
    &:last-child {
      border-bottom: 0;
    }
  }
  .manage_history {
    height: px2rem(60px);
    background: #efefef;
    display: flex;
    align-items: center;
    span {
      flex-grow: 1;
      text-align: center;
      border-right: 1px solid #777;
      height: px2rem(40px);
      line-height: px2rem(40px);
      &:last-child {
        border-right: 0;
      }
    }
  }
}
.empty-con {
  width: 90%;
  margin: 0 auto;
  .search-title {
    float: left;
    font-size: 28px;
    color: #515155;
    line-height: px2rem(64px);
  }
  .clear {
    float: right;
    margin-top: 20px;
    .trash {
      display: block;
      width: 28px;
      height: 28px;
      background: url("../assets/image/trash.png") no-repeat;
      -webkit-background-size: 100%;
      background-size: 100%;
    }
  }
  .history1 {
    clear: both;
    display: block;
    font-size: px2rem(24px);
    color: #0b1a31;
    .history_item {
      float: left;
      margin-top: px2rem(15px);
      margin-right: px2rem(15px);
      padding: 0 px2rem(15px);
      height: px2rem(64px);
      line-height: px2rem(64px);
      background: rgba(245, 245, 245, 1);
      border-radius: 6px;
    }
  }
}
.no-data{
  text-align: center;
  padding: 40px 0 20px;
}
</style>

