<template>
    <div class="party-build">
    	<div class="banner">
			<mt-swipe class="swiper" :auto="3000">
				<mt-swipe-item v-for="item in banner" :key="item.id" v-if="item.type === 'basic'">
					<router-link :to="{path: '/content/' + item.newsId}" class="clearfix">
				    	<div class="con">
				    		<img :src="item.picUrl">
				    		<div class="title">
				    			<span> {{item.name}}</span>
				    		</div>
				    	</div>
				    </router-link>
				</mt-swipe-item>
			</mt-swipe>
		</div>
		<div class="title-list">
			<ul class="clearfix">
				<li>
					<a href="javascript:;" @click.prevent="custormAnchor('1')"></a>
					<p>党建要闻</p>
				</li>
				<li>
					<a href="javascript:;" @click.prevent="custormAnchor('2')"></a>
					<p>学习路上</p>
				</li>
				<li>
					<a href="javascript:;" @click.prevent="custormAnchor('3')"></a>
					<p>党建讲堂</p>
				</li>
				<li>
					<a href="javascript:;" @click.prevent="custormAnchor('4')"></a>
					<p>先锋模范</p>
				</li>
				<li>
					<a href="javascript:;" @click.prevent="custormAnchor('5')"></a>
					<p>党建风采</p>
				</li>
			</ul>
		</div>
		<div class="single-banner" v-for="item in banner" :key="item.id" v-if="item.type === 'advertising'">
			<router-link :to="{path: '/content/' + item.newsId}">
		    	<img :src="item.picUrl">
		    </router-link>
		</div>
		<ul class="detail-list">
			<li v-for="item in dissertation" :id="item.id" :key="item.id">
				<column :content="item.news" :title="item.name" :link="'/projectList/1/' + item.id"></column>
			</li>
		</ul>
		<c-footer></c-footer>
    </div>
</template>
<script>
import Vue from 'vue'
import Column from '../components/Column.vue'
import { mapState } from 'vuex'
import CFooter from '../components/Footer.vue'
import { Swipe, SwipeItem } from 'mint-ui'
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
export default {
    data () {
        return {
			// swiperOption: {
			// 	autoplay: true,
			// 	pagination: {
			// 		el: '.swiper-pagination',
			// 		clickable: true
			// 	}
			// }
        }
    },
    components: {
      Column,
      CFooter
    },
    created () {
		this.getColumn()
    },
    methods: {
			getColumn () {
				this.$store.dispatch({
					type: 'getColumn',
					data: {
						columnId: 1,
						pageSize: 2
					}
				})
			},
			// 模拟锚点，vue中锚点和router冲突
			custormAnchor(anchorName) {
        // 找到锚点
        let anchorElement = document.getElementById(anchorName);
        // 如果对应id的锚点存在，就跳转到锚点
        if(anchorElement) { anchorElement.scrollIntoView(); }
    }
    },
    watch: {
    },
    computed: {
		// swiper () {
		// 	return this.$refs.mySwiper.swiper
		// },
		...mapState({
			banner: state => state.partyBuildStore.banner,
			dissertation: state => state.partyBuildStore.dissertation
		})
    }
}
</script>
<style lang="scss">
    .party-build{
    	background: #F3F3F5;
    	margin-bottom: 100px;
    	.banner {
    		background: #ccc;
    		position: relative;
    		.swiper {
				height: 344px;
				.con {
	    			position: relative;
	    			img {
	    				height: 344px;
	    				width: 100%;
	    				border: 0;
	    				display: block;
	    			}
	    			.title {
	    				width: 100%;
						height: 74px;
						line-height: 74px;
	    				position: absolute;
	    				bottom: 0;
	    				left: 0;
	    				background: rgba(0, 0, 0, 0.6);
	    				span {
	    					width: 80%;
	    					display: inline-block;
	    					height: 74px;
	    					line-height: 74px;
		    				font-size: 30px;
		    				color: #fff;
		    				margin-left: 30px;
		    				overflow: hidden;
						    white-space: nowrap;
						    text-overflow: ellipsis;
	    				}
	    			}
	    		}
	    		.mint-swipe-indicators {
	    			position: absolute;
	    			bottom: 16px;
	    			left: 90%;
	    			.mint-swipe-indicator {
	    				width: 12px;
	    				height: 12px;
	    				background: #CCCBC9;
	    			}
	    			.is-active {
	    				background: #E03231;
	    			}
	    		}
			}
    	}
    	.title-list {
    		background: #fff;
    		text-align: center;
    		padding: 36px 0 35px 0;
    		ul {
    			display: inline-block;
    			li {
    				float: left;
    				width: 100px;
    				margin-right: 50px;
    				a {
    					display: inline-block;
    					width: 94px;
    					height: 94px;
    					border-radius: 50%;
    				}
    				p {
    					margin-top: 12px;
    					color: #111111;
    					font-size: 24px;
    				}
    			}
    			li:first-child {
    				a {
    					background: url(../assets/image/icon1.png);
    					background-size: 100%;
    				}
    			}
    			li:nth-child(2) {
    				a {
    					background: url(../assets/image/icon2.png);
    					background-size: 100%;
    				}
    			}
    			li:nth-child(3) {
    				a {
    					background: url(../assets/image/icon3.png);
    					background-size: 100%;
    				}
    			}
    			li:nth-child(4) {
    				a {
    					background: url(../assets/image/icon4.png);
    					background-size: 100%;
    				}
    			}
    			li:last-child {
    				margin-right: 0;
    				a {
    					background: url(../assets/image/icon5.png);
    					background-size: 100%;
    				}
    			}
    		}
    	}
    	.single-banner {
    		height: 170px;
    		width: 100%;
    		// background: url(../assets/image/single-banner.png);
    		// background-size: 100%;
    		img {
    			height: 100%;
    			width: 100%;
    		}
    	}
    	.detail-list {
    		background: #F3F3F5;
    		margin-top: 20px;
    		li {
    			margin-bottom: 20px;
    			background: #fff;
    		}
    	}
	}
	.mint-toast {
		.mint-toast-text {
			font-size: 24px;
		}
	}
</style>
