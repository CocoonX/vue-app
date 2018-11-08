<template>
    <div class="maker">
    	<div class="banner">
			<mt-swipe class="swiper" :auto="3000">
				<mt-swipe-item v-for="item in bannerList" :key="item.id" v-if="item.type === 'basic'">
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
		<div class="maker-background">
			<div class="maker-column clearfix">
				<router-link :to="{path: '/projectList/2/6'}">
					<div class="maker-column-left">
						<h5>前沿科技</h5>
						<p>行业前沿发展趋势</p>
					</div>
				</router-link>
				<div class="maker-column-right">
					<router-link :to="{path: '/projectList/2/7'}">
						<div class="rtkx">
							<h5>融投快讯</h5>
							<p>融投资讯早知道</p>
						</div>
					</router-link>
					<router-link :to="{path: '/projectList/2/8'}">
						<div class="rmxm">
							<!-- <h5>热门项目</h5>
							<p>发现发掘好项目</p> -->
						</div>
					</router-link>
				</div>
			</div>
			<div class="maker-banner" v-for="item in bannerList" :key="item.id" v-if="item.type === 'advertising'">
				<router-link :to="{path: '/content/' + item.newsId}">
			    	<img :src="item.picUrl">
			    </router-link>
			</div>
			<div class="maker-activity">
				<column :title="activityTitle" :columnId="plates.columnId"></column>
				<div class="maker-activity-con">
					<router-link :to="{path: '/projectList/2/9'}" >
						<div class="ckds">
							<!-- <p>创客大赛</p> -->
						</div>
					</router-link>
					<router-link :to="{path: '/projectList/2/10'}" >
						<div class="cksl">
							<!-- <p>创客沙龙</p> -->
						</div>
					</router-link>
				</div>
			</div>
			<column :content="plates.list" :title="plates.title" :link="plates.url" :columnId="plates.columnId"></column>
		</div>
		<c-footer></c-footer>
    </div>
</template>
<script>
	import Vue from 'vue'
	import { Swipe, SwipeItem } from 'mint-ui'
	import axios from 'axios'
	import Column from '../components/Column.vue'
	import CFooter from '../components/Footer.vue'
	Vue.component(Swipe.name, Swipe)
	Vue.component(SwipeItem.name, SwipeItem)
	
	export default{
		data () {
			return {
				bannerList: [],
				plates: {
					title: '',
					url: '/projectList/2/11',
					list: []
				},
				activityTitle: '创客活动'
			}
		},
		components: {
			Column,
			CFooter
		},
		created () {
			this.getMakerColumn()
			this.getMakerplates()
		},
		methods: {
			getMakerColumn () {
				let $this = this
				axios({
					method: 'get',
					url: '/column/getColumn?columnId=2&pageSize=2'
				}).then(function (response) {
					if (response.status === 200) {
						$this.bannerList = response.data.banner
						$this.plates.title = response.data.dissertation[5].name
						$this.plates.columnId = response.data.dissertation[5].columnId
					}
				})
			},
			getMakerplates () {
				let $this = this
				axios({
					method: 'get',
					url: '/column/getNewsList?dissertationId=11&startPage=1&pageSize=3'
				}).then(function (response) {
					if (response.status === 200) {
						$this.plates.list = response.data.news
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	.maker {
		padding-bottom: 100px;
		.banner {
			background: #ccc;
			position: relative;
			.swiper {
				height: 355px;
				.con {
					position: relative;
					img {
						height: 355px;
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
		.maker-background {
			background: #F3F3F5;
			.maker-column {
				background: #fff;
				width: 100%;
				height: 285px;
				padding: 18px 43px 31px 25px;
				h5 {
					color: #3A3B41;
					font-size: 34px;
					font-weight: bold;
					height: 48px;
					line-height: 48px;
				}
				p {
					color: #9A9A9A;
					font-size: 24px;
				}
				.maker-column-left {
					float: left;
					width: 354px;
					height: 100%;
					background: url(../assets/image/bg-qykj.png);
					background-size: 100%;
					padding: 14px 0 0 26px;
				}
				.maker-column-right {
					float: right;
					width: 318px;
					.rtkx, .rmxm {
						height: 114px;
						margin-bottom: 10px;
						padding: 22px 0 0 30px;
					}
					.rtkx {
						background: url(../assets/image/bg-rtkx.png);
						background-size: 100%;
					}
					.rmxm {
						background: url(../assets/image/bg-rmxm.png);
						background-size: 100%;
					}
				}
				// a {
				// 	display: block;
				// 	width: 49%;
				// 	height: 280px;
				// 	border: 1px solid #000;
				// }
				// div {
				// 	width: 49%;
				// 	height: 280px;
				// 	display: flex;
				// 	justify-content: space-between;
				// 	flex-direction: column;
				// 	a {
				// 		height: 135px;
				// 		width: 100%;
				// 	}
				// }
			}
			.maker-banner {
				display: block;
				width: 100%;
				height: 208px;
				img {
					height: 168px;
					width: 100%;
					margin-top: 20px;
				} 
			}
			.maker-activity {
				background: #fff;
				margin-bottom: 20px;
				.maker-activity-con {
					height: 230px;
					padding: 0 25px 30px;
					.ckds, .cksl {
						float: left;
						height: 200px;
						width: 345px;
						background: red;
						p {
							margin: 74px 20px 0 0;
							height: 48px;
							line-height: 48px;
							font-size: 34px;
							color: #FFF;
							text-align: right;
						}
					}
					.ckds {
						margin-right: 10px;
						background: url(../assets/image/bg-ckds.png);
						background-size: 100%;
					}
					.cksl {
						background: url(../assets/image/bg-cksl.png);
						background-size: 100%;
					}
				}
			}
		}
	}
	.mint-toast {
		.mint-toast-text {
			font-size: 24px;
		}
	}
</style>
