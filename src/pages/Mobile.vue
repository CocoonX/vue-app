<template>
	<div class="find-password">
		<ul>
			<li class="li msg-code clearfix" v-if="!showNext">
				<span class="num">+86</span>
				<input type="number" placeholder="请输入手机号" v-model="mobile">
				<!-- <span class="error" v-if="showMobileError">手机号未注册</span> -->
			</li>
		</ul>
		<span class="btn-next btn-next-disabled" v-if="!showNextBtn">下一步</span>
		<span class="btn-next" @click="checkUserByName" v-if="showNextBtn && !showNext">下一步</span>	
		<div class="send_msg_wrapper" v-if="showUnregisteWarn">
            <div class="send_msg">
                <p>手机号未注册，请使用验证码登录</p>
                <ul class="clearfix">
                    <li @click="showUnregisteWarn = false">取消</li>
                    <li @click="confrim">确定</li>
                </ul>
            </div>
        </div>
	</div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
    data () {
        return {
            countTime: sessionStorage.countTime ? sessionStorage.countTime : this.$store.state.loginStore.totalCountTime,
            mobile: '',
            password: '',
            msgCode: '',
            showCountTime: true,
            showNext: false,
            showNextBtn: false,
            showSendBtn: false,
            showCodeError: false,
            showPasswordError: false,
            showUnregisteWarn: false
        }
    },
    created () {
    },
    methods: {
		sendResetMsg () {
			this.$store.dispatch({
				type: 'sendResetMsg',
				data: {
					mobile: this.mobile
				}
			}).then((res) => {
				if (res.data.msg === '短信验证码发送成功') {
					sessionStorage.time = this.countTime = this.$store.state.loginStore.totalCountTime
					this.$store.commit('SHOW_COUNT_TIME', true)
					this.$router.push({path: '/findPassword#' + this.mobile})
					this.mobile = ''
				} else {
					Toast({
						message: '今日验证码发送次数已达上限'
					})
				}
			})
		},
		checkUserByName () {
			this.$store.dispatch({
				type: 'checkUserByName',
				data: {
					userName: this.mobile
				}
			}).then((res) => {
				if (res.data.data) {
					this.sendResetMsg()
				} else {
					this.showUnregisteWarn = true
				}
			})
		},
		confrim () {
            this.$router.push({path: '/login#' + this.mobile})
            this.showUnregisteWarn = false
            this.mobile = ''
        }
    },
    watch: {
		mobile: function () {
			var reg = /^[1][3|4|5|7|8][0-9]{9}$/
			if (reg.test(this.mobile)) {
				this.showNextBtn = true
			} else {
				this.showNextBtn = false
				// this.showMobileError = false
			}
        }
    }
}
</script>
<style lang="scss">
    .find-password{
		padding: 80px 44px 0 70px;
		text-align: center;
		ul {
			li.li {
				position: relative;
				margin-bottom: 40px;
				border: 2px solid #ccc;
				border-radius: 8px;
				input {
					height: 80px;
					width: 600px;
					padding-left: 16px;
					outline: none;
					border: 0;
					font-size: 28px;
				}
				input::-webkit-input-placeholder{
		            color: #cecece;
		            font-size: 28px;
		        }
		        .send-again {
		        	position: absolute;
		        	right: 0;
		        	top: 24px;
		        	width: 193px;
		        	height: 36px;
		        	line-height: 36px;
		        	border-left: 2px solid #ccc;
		        	text-align: center;
		        	color: #0056FF;
		        	font-size: 24px;
		        }
			}
			li.msg-code {
				position: relative;
				color: #CECECE;
				font-size: 28px;
				span.num {
					float: left;
					width: 96px;
					height: 36px;
					line-height: 36px;
					border-right: 2px solid #ccc;
					margin-top: 22px;
				}
				input {
					float: left;
					width: 507px;
				}
				.error {
		        	position: absolute;
		        	left: 16px;
		        	bottom: -38px;
		        	color: #CE3C3D;
		        	font-size: 20px;
		        }
			}
			li:last-child {
				margin-bottom: 0px;
			}
		}
		.btn-next {
			display: inline-block;
			height: 84px;
			line-height: 84px;
			width: 100%;
			border-radius: 10px;
			background: rgba(0, 86, 255, 1);
			color: #fff;
			font-size: 32px;
			margin-top: 72px;
		}
		.btn-next-disabled {
			background: #D8D8D8;
		}
		.btn-submit-disabled {
			background: rgba(0, 86, 255, 0.6);
		}
		.send_msg_wrapper {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.2);
            z-index: 300;
            .send_msg {
                position: absolute;
                left: 50%;
                margin-left: -305px;
                top: 50%;
                margin-top: -123px;
                width: 610px;
                height: 245px;
                background: #fff;
                border-radius: 3px;
            }
            p {
                height: 153px;
                line-height: 153px;
                color: #0B1A31;
                font-size: 24px;
                text-align: center;
                border-bottom: 1px solid #E3E3EE;
            }
            ul {
                li {
                    float: left;
                    width: 305px;
                    height: 90px;
                    line-height: 90px;
                    text-align: center;
                    color: #576CFF;
                    font-size: 28px;
                }
                li:last-child {
                    background: #EFF2F7;
                }
            }
        }
	}
	.success-warn {
		width: 342px;
		height: 84px; 
		background: rgba(49,49,49,0.9);
		border-radius: 40px;
		span {
			height: 84px;
			line-height: 50px;
			font-size: 28px;
		}
	}
</style>
