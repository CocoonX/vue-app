<template>
  <div class="home-topbar-wrapper border-half-bottom">
    <div class="top-menu-bar">
      <swiper :options="swiperOption" ref="homenav">
        <swiper-slide v-for="(item, index) in channellist" :class="{'active': homeNewsIndex === index}" @click.native="active(index)" :key="index">
          <span class="channelTitle">
            {{item.channelTitle}}
            <i class="line"></i>
          </span>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { mapState } from 'vuex'
  // import * as type from '../store/mutations_type.js'

  export default {
    components: {
      swiper,
      swiperSlide
    },
    data () {
      return {
        swiperOption: {
          slidesPerView: 6
        },
        navPosition: 0,
        lastClickTime: 0,
        clickTimer: Object
      }
    },
    // watch: {
    //   $route (to, from) {
    //     if (!to.path.includes('home') && from.path.includes('home')) {
    //       this.$store.commit(type.SAVE_POSITION, {
    //         name: 'homenav',
    //         position: this.$refs.homenav.scrollLeft
    //       })
    //     } else if (to.path.includes('home') && !from.path.includes('home')) {
    //       this.$refs.homenav.scrollLeft = this.$store.state.positions.homenav
    //     }
    //   }
    // },
    methods: {
      async active (index) {
        this.$store.state.home.newsIndex = index
        // this.$store.dispatch('getChannelId', this.homeNewsIndex)

        let _this = this
        var nowTime = new Date().getTime()
        if (nowTime - _this.lastClickTime < 400) {
          // 双击
          _this.lastClickTime = 0
          _this.clickTimer && clearTimeout(_this.clickTimer)
          console.log('双击')
          _this.$store.state.home.loading = true
          _this.$store.dispatch('refreshNews', {type: _this.$store.state.home.channelId})
        } else {
          // 单击
          _this.lastClickTime = nowTime
          _this.clickTimer = setTimeout(() => {
            console.log('单击')
            // if (Object.keys(_this.list[index]).length > 0) return false
            // _this.$store.dispatch('getNews', {type: _this.$store.state.home.channelId})
          }, 400)
        }
        // this.$store.state.home.newsIndex = index
        // this.$store.dispatch('getChannelId', this.homeNewsIndex)
        // if (Object.keys(this.list[index]).length > 0) return false
        // await this.$store.dispatch('getNews', {type: this.channelId})
      }
    },
    computed: {
      swiper () {
        return this.$refs['homenav'].swiper
      },
      ...mapState({
        channellist: state => state.home.channellist,
        homeNewsIndex: state => state.home.newsIndex,
        list: state => state.home.list
      })
    }
  }
</script>

<style lang="scss">
  @import '../assets/style/common.scss';
  .home-topbar-wrapper {
    position: fixed;
    top: 0;
    width: 750px;
    height: 88px;
    line-height: 88px;
    font-size: 32px;
    z-index: 200;
    color: #000;
    overflow: auto;
    .top-menu-bar {
      position: absolute;
      width: 100%;
      height: 88px;
      line-height: 88px;
    }
    .swiper-container {
      padding-left: 26px;
      padding-right: 65px
    }
    .swiper-wrapper {
      .swiper-slide{
        height: 88px;
        // width: auto !important;
        // margin-right: 40px;
        text-align: center;
        .channelTitle {
          position: relative;
          width: auto;
          .line {
            width: 80%;
            height: 4px;
            background: #2E79F4;
            position: absolute;
            bottom: -26px;
            left: 10%;
            display: none;
          }
        }
      }
      .swiper-slide:last-child {
        margin-right: 0;
      }
      .active {
        .channelTitle {
          position: relative;
          display: inline-block;
          color: #2E79F4;
          font-size: 36px;
          height: 88px;
          line-height: 88px;
          width: auto;
          .line {
            display: block;
            bottom: 0px;
          }
        }
      }
    }
    .top-bar-active-active {
      top: 0.1rem;
    }
  }
</style>
