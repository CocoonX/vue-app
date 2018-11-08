<template>
	<div class="maker">
		<div class="swiper-nav-con">
			<swiper :options="swiperOption" ref="columnnav" :class="columnClass">
				<swiper-slide v-for="item in navList" :class="{'active': activeKey == item.id}" :key="item.id">
					<router-link :to="{path: '/projectList/'+columnId+'/'+ item.id}" >{{item.name}}<i class="line"></i></router-link>
				</swiper-slide>
			</swiper>
		</div>
		<mt-loadmore
					:top-method="loadTop"
					ref="loadmore"
					:bottom-method="loadBottom"
					:auto-fill="false"
					:bottom-all-loaded="allLoaded"
					@bottom-status-change="handleBottomChange">
			<swiper :options="swiperOption2" ref="columnlist" class="swiper-list-con" @slideChangeTransitionStart="slideChangeTransitionStart">
		        <swiper-slide v-for="(item, index) in navList" :key="index">
					<column-news-list :content="partyList"></column-news-list>
		        </swiper-slide>
		    </swiper>
	    	<div slot="bottom" class="mint-loadmore-top">
				<span v-show="bottomStatus === 'pull'">{{ allLoaded?'没有更多了':'上拉加载更多' }}</span>
				<span v-show="bottomStatus === 'drop'">松开加载更多</span>
				<span v-show="bottomStatus === 'loading'">加载中</span>
			</div>
		</mt-loadmore>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { Loadmore } from 'mint-ui'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	import axios from 'axios'
	import { mapState } from 'vuex'
	import ColumnNewsList from '../components/ColumnNewsList.vue'
	Vue.component(Loadmore.name, Loadmore)

	export default{
		data () {
			return {
				swiperOption: {
					initialSlide: 2,
					slidesPerView: 4,
					spaceBetween: 30,
					observer: true
				},
				swiperOption2: {
					loop: true
				},
				columnClass: 'party-build-nav',
				activeKey: '',
				list: [],
				nowPage: 1,
				totalPage: 0,
				allLoaded: false,
				bottomStatus: '',
				activeIndex: ''
			}
		},
		components: {
			Loadmore,
			swiper,
			swiperSlide,
			ColumnNewsList
		},
		mounted () {
			// 微信中点返回回到党建或创客首页
			// window.addEventListener('popstate', function (e) {
			// 	if (window.location.hash.split('/')[2] === '1') {
			// 		window.location.hash = '#/partyBuild'
			// 	} else if (window.location.hash.split('/')[2] === '2') {
			// 		window.location.hash = '#/maker'
			// 	}
			// }, false)
			this.columnnav.init()
			this.columnnav.slideTo(5, 10, false)
			if (this.$route.params.dissertationId === '5' || this.$route.params.dissertationId > 9) {
				this.columnnav.init()
				this.columnnav.slideTo(2, 100, false)
				this.columnnav.realIndex = 2
			} else {
				this.columnnav.init()
			}
			this.$refs['columnlist'].swiper.activeIndex = this.$route.params.dissertationId -1
	    },
		computed: {
			columnnav () {
				return this.$refs.columnnav.swiper
			},
			columnlist () {
				return this.$refs.columnlist.swiper
			},
			...mapState({
				partyList: state => state.partyBuildStore.partyList,
				navList: state => state.partyBuildStore.navList
			})
		},
		created () {
			this.columnId = this.$route.params.columnId
			this.activeKey = this.$route.params.dissertationId
			this.getMakerplates(this.$route.params.dissertationId)
			this.getDissertationList(this.$route.params.columnId)
			// 初始化首次进入列表页类名
			if (this.columnId) {
				if (this.columnId === '2') {
					this.columnClass = 'maker-nav'
				} else {
					this.columnClass = 'party-build-nav'
				}
			}
		},
		watch: {
			// 如果路由有变化，会再次执行该方法 ，从专题页点击进列表页，然后返回到专题页，
			// 再点击另一个栏目进入列表页的时候，此页面没有重新加载，所以监听$route.params.dissertationId的变化来动态加载数据
			'$route.params.dissertationId': function (id) {
				if (id) {
					if (id === '5' || id > 9) {
						this.columnnav.init()
						this.columnnav.slideTo(4, 1000, false)
					} else {
						this.columnnav.init()
						this.columnnav.slideTo(0, 1000, false)
					}
					this.activeKey = id
					this.getMakerplates(id)
				}
			},
			'$route.params.columnId': function (id) {
				if (id) {
					if (id === '2') {
						this.columnClass = 'maker-nav'
					} else {
						this.columnClass = 'party-build-nav'
					}
					this.columnId = this.$route.params.columnId
					this.getDissertationList(id)
				}
			}
		},
		methods: {
			// 滑动更换频道
			slideChangeTransitionStart () {
				this.activeIndex = this.$route.params.dissertationId
				var direction = this.$refs['columnlist'].swiper.swipeDirection
				if (this.$route.params.columnId === '1') {
					if (direction === 'next') {
						if (this.activeIndex >= 5) {
							this.activeIndex = 1
						} else {
							this.activeIndex = parseInt(this.activeIndex) + 1
						}
					} else {
						if (this.activeIndex <= 1) {
							this.activeIndex = 5
						} else {
							this.activeIndex = parseInt(this.activeIndex) - 1
						}
					}
				} else {
					if (direction === 'next') {
						if (this.activeIndex >= 11) {
							this.activeIndex = 6
						} else {
							this.activeIndex = parseInt(this.activeIndex) + 1
						}
					} else {
						if (this.activeIndex <= 6) {
							this.activeIndex = 11
						} else {
							this.activeIndex = parseInt(this.activeIndex) - 1
						}
					}
				}
				this.$router.push({path: '/projectList/'+ this.$route.params.columnId +'/' + this.activeIndex})
			},
			// 已读新闻变色
			read (index) {
				console.log(index)
				// this.list[index].grey = true
		  //       var partyListParse = JSON.parse(sessionStorage.partyList)
		  //       partyListParse[index].grey = true
		  //       sessionStorage.setItem('partyList', JSON.stringify(partyListParse))
		  //       console.log(sessionStorage.partyList)
			},
			// 此方法用于 下拉刷新
			loadTop () {
				let $this = this
				this.nowPage = 1
				this.allLoaded = false
				this.getMakerplates(this.$route.params.dissertationId, 0)
				$this.$refs.loadmore.onTopLoaded()
			},
			// 此方法用于 上拉加载
			loadBottom () {
				if (this.nowPage < this.totalPage) {
					this.nowPage++
					this.getMakerplates(this.$route.params.dissertationId, 1)
				} else {
					this.allLoaded = true
				}
				this.$refs.loadmore.onBottomLoaded()
			},
			handleBottomChange (status) {
				this.bottomStatus = status
			},
			// 此方法用于加载顶部导航  id : 专题的 id（columnId）,写这个参数是为了 相似的专题都可以调用这个页面
			getDissertationList (id) {
				this.$store.dispatch({
					type: 'getDissertationList',
					id: id
				})
			},
			// 此方法用于加载栏目的新闻列表， 参数 id : 栏目 id (dissertationId)，nowPage 参数用于上划加载
			getMakerplates (id, more) {
				this.$route.params.dissertationId = id
				this.$store.dispatch({
					type: 'getMakerplates',
					data: {
						id: id,
						more: more,
						nowPage: this.nowPage
					}
				}).then((response) => {
					this.allLoaded = false
                    this.totalPage = response.data.totalPageCount
					// if (response.status === 200) {
	    //                 if (more) { // more = true 的时候用于 上划加载时给list添加下一页的news
	    //                     this.$store.state.partyBuildStore.partyList = this.$store.state.partyBuildStore.partyList.concat(response.data.news)
	    //                 } else { // more = false 的时候用于 下拉刷新
	    //                     this.$store.state.partyBuildStore.partyList = response.data.news
	    //                 }
	    //                 this.totalPage = response.data.totalPageCount
	    //             }
				})
			}
		}
	}
</script>

<style scoped lang="scss">
  @import '../assets/style/common.scss';
  .maker {
    // 上拉加载bug ，需要给mt-loadmore 标签的父级加下面两个样式
    height: 100vh;
    overflow:scroll;
    .swiper-nav-con {
    	height: 80px;
    	background: #fff;
	    .swiper-container {
	      padding: 0 20px;
	      height: 80px;
	      line-height: 80px;
	      background: #F9F9F9;
	      position: fixed;
	      top: 0;
	      left: 0;
	      box-sizing: border-box;
	      width: 100%;
	      z-index: 1000;
	      .swiper-slide {
	        font-size: 28px;
	        text-align: center;
	        position: relative;
	        a {
	          color: #000000;
	          .line {
	            width: 48px;
	            height: 8px;
	            background: #2E79F4;
	            position: absolute;
	            bottom: -4px;
	            left: 50%;
	            margin-left: -24px;
	            display: none;
	          }
	        }
	      }
	      .swiper-slide.active {
	        a {
	          color: #DF3231;
	          .line {
	            display: block;
	            background: #DF3231;
	          }
	        }
	      }
	    }
	}
    .maker-nav .swiper-wrapper .swiper-slide.active {
      a {
        color: #01ACAA;
        .line {
          display: block;
          background: #01ACAA;
        }
      }
    }
    .swiper-list-con {
    	// margin-top: 80px;
    }
  }
  .mint-loadmore {
    // padding-top: 80px;
  }
  .column-con {
    li {
      height: 210px;
      padding: 26px 38px;
      border-bottom: 2px solid #F5F5F5;
      a {
        display: block;
      }
      .con-left {
        float: left;
        width: 450px;
        p {
          font-size: 32px;
          color: #000;
          line-height: 42px;
          margin-bottom: 38px;
          height: 84px;
        }
        p.grey {
        	color: #ccc;
        }
        .source-date {
          font-size: 24px;
          .top {
            float: left;
            height: 30px;
            line-height: 30px;
            color: #0056FF;
            border: 1px solid #0056FF;
            padding: 2px 4px;
            margin:2px 10px 0 0;
          }
          .source {
            float: left;
            color: rgba(0, 0, 0, 0.22);
          }
          .date {
            float: right;
            color: rgba(0, 0, 0, 0.22);
          }
        }
      }
      .con-right {
        float: right;
        width: 210px;
        img {
          width: 210px;
          height: 158px;
        }
      }
    }
    li:last-child {
      border-bottom: 0;
    }
  }
  .mint-loadmore-top {
    margin-top: 10px;
  }

</style>

