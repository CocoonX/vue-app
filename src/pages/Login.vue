<template>
    <div class="login">
        <div class="icon-logo">
            <img src="../assets/image/logo.png">
        </div>
        <ul>
            <li :class="{errorInfo: showMobileError}">
                <input type="number" placeholder="请输入手机号" v-model="mobile">
                <span class="send" v-if="showSendBtn" @click="sendLoginMsg()">发送验证码</span>
                <span class="send send-again" v-if="!showSendBtn && !showRepeatSendBtn">重新发送(<span>{{countTime}}</span>s)</span>
                <span class="send" v-if="showRepeatSendBtn" @click="sendLoginMsg()">重新发送</span>
                <span class="error">{{mobileErrorMsg}}</span>
            </li>
            <li :class="{errorInfo: showCodeError}">
                <input type="number" placeholder="请输入验证码" v-model="msgCode">
                <span class="error" v-if="showCodeError">{{codeErrorMsg}}</span>
            </li>
        </ul>
        <div class="tip">未注册手机验证后自动登录</div>
        <span class="btn-enter" @click="checkUserByName" v-if="accessStatus && agreementStatus && msgCode.length === 4 && !showCodeError && !showMobileError">登录</span>
        <span class="btn-enter btn-enter-disabled" v-else>登录</span>
        <div class="agreement">
            <p>
                <span class="check" @click="changeAgreementStatus" v-if="agreementStatus" ></span>
                <span class="no-check" @click="changeAgreementStatus" v-else></span>
                我已经阅读并同意
                <a href="#/agreement">《用户协议》</a>
            </p>
        </div>
        <a href="#/AccountLogin">已有账号去登录</a>
        <div class="agreement-warn-wrapper" v-if="showAgreementWarn">
            <div class="agreement-warn">
                <span class="icon-close"></span>
                <p>尚未同意《用户协议》</p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { Toast } from 'mint-ui'
export default {
    data () {
        return {
            countTime: sessionStorage.countTime ? sessionStorage.countTime : this.$store.state.loginStore.totalCountTime,
            mobile: this.$route.hash.substring(1) || '',
            msgCode: '',
            showSendBtn: true,
            showMobileError: false,
            showCodeError: false,
            accessStatus: false,
            showRepeatSendBtn: false,
            codeErrorMsg: '',
            mobileErrorMsg: '手机号错误'
        }
    },
    created () {
		if (sessionStorage.countTime) {
			this.showSendBtn = false
			this.count()
		}
    },
    methods: {
		// 倒计时
		count () {
			var _this = this
			window.time = setInterval(function () {
				_this.countTime--
				sessionStorage.countTime = _this.countTime
				if (_this.countTime < 1) {
					_this.showRepeatSendBtn = true
					clearInterval(window.time)
					_this.countTime = _this.totalCountTime
					sessionStorage.removeItem('countTime')
				}
			}, 1000)
		},
		// 发送短信验证码
        sendLoginMsg () {
			this.$store.dispatch({
				type: 'sendLoginMsg',
				data: {
					mobile: this.mobile
				}
			}).then((res) => {
				var reg = /^[1][3|4|5|7|8][0-9]{9}$/
				if (reg.test(this.mobile)) {
					if (res.data.msg === '短信验证码发送成功') {
						Toast({
							message: '发送成功'
						})
						this.showRepeatSendBtn = false
	                    this.showMobileError = false
	                    this.showSendBtn = false
	                    sessionStorage.setItem('countTime', this.totalCountTime)
	                    this.countTime = sessionStorage.countTime
	                    this.count()
	                } else {
						Toast({
							message: '今日验证码发送次数已达上限，请改用账号登录'
						})
						this.showRepeatSendBtn = false
	                    this.showMobileError = true
	                    this.showSendBtn = true
	                    this.mobileErrorMsg = '今日验证码发送次数已达上限'
	                }
				} else {
					this.showMobileError = true
				}
			})
        },
        // 检验短信验证码
        checkMsg () {
			this.$store.dispatch({
				type: 'checkMsg',
				data: {
					mobile: this.mobile,
					code: this.msgCode
				}
			}).then((res) => {
				if (this.msgCode.length > 4) {
					this.showCodeError = true
					this.codeErrorMsg = '请输入4位数字'
				} else if (this.msgCode.length === 4) {
					if (res.data.msg === '验证成功') {
	                    this.showCodeError = false
						this.accessStatus = true
						// 检查协议
						if (!this.$store.state.loginStore.agreementStatus) {
							this.$store.state.loginStore.showAgreementWarn = true
							var _this = this
							setTimeout(function () {
								_this.$store.state.loginStore.showAgreementWarn = false
							}, 2000)
						}
	                } else if (res.data.msg === '验证失败') {
	                	this.showCodeError = true
	                    this.codeErrorMsg = '验证码错误'
	                } else {
	                    this.showCodeError = true
	                    this.codeErrorMsg = '验证码不存在或已过期'
	                }
                } else {
					this.showCodeError = false
					this.codeErrorMsg = '请输入4位数字'
				}
			})
        },
        changeAgreementStatus () {
            this.$store.state.loginStore.agreementStatus = !this.$store.state.loginStore.agreementStatus
        },
        closeAgreementWarn () {
			this.$store.state.loginStore.agreementStatus = true
			this.$store.state.loginStore.showAgreementWarn = false
        },
        checkUserByName () {
			this.$store.dispatch({
				type: 'checkUserByName',
				data: {
					userName: this.mobile
				}
			}).then((res) => {
				if (res.data.data) {
					this.login()
				} else {
					this.registerInWechat()
				}
			})
		},
        // 微信注册
        registerInWechat () {
			this.$store.dispatch({
				type: 'registerInWechat',
				data: {
					userName: this.mobile,
					password: '',
					openid: this.$route.query.openid || sessionStorage.openid
				}
			}).then((res) => {
				if (res.data.msg === '注册成功') {
					this.$store.state.home.isRegister = true
					this.login()
				}
			})
        },
        // 登录
        login () {
			this.$store.dispatch({
				type: 'login',
				data: {
					HttpServletRequest: {
						userName: this.mobile,
						password: '',
						clearSessionId: sessionStorage.clearSessionId || sessionStorage.sessionId,
						smsSucceed: true
					}
				}
			}).then((res) => {
				if (res.data.msg === '登录成功') {
			        // 清除验证码倒计时
			        sessionStorage.removeItem('countTime')
			        clearInterval(window.time)
			        // 页面跳转
			        this.$router.push({path: '/home/0'})
					localStorage.setItem('userId', res.data.data.userId)
					this.getUserInfo()
				}
			})
        },
        getUserInfo () {
          this.$store.dispatch({
            type: 'getUserInfo',
            data: {
              userId: localStorage.userId
            }
          })
        }
    },
    watch: {
		$route (to, from) {
			if (from.name !== 'agreement' && from.name !== 'login' && from.name !== 'accountLogin') {
				this.showMobileError = false
				this.showCodeError = false
				this.msgCode = ''
            	this.mobile = this.$route.hash.substring(1) || ''
			}
            if (!sessionStorage.countTime) {
            	this.showRepeatSendBtn = false
            	this.showSendBtn = true
            }
        },
        msgCode: function () {
			this.checkMsg()
        },
        mobile: function () {
			this.showMobileError = false
			if (this.mobile.length === 11) {
				this.checkMsg()
			}
        }
    },
    computed: {
		...mapState({
			totalCountTime: state => state.loginStore.totalCountTime,
			showAgreementWarn: state => state.loginStore.showAgreementWarn,
			agreementStatus: state => state.loginStore.agreementStatus,
      fromPath: state => state.loginStore.fromPath
		})
    }
}
</script>
<style lang="scss">
    .login{
		padding: 0 56px 0 58px;
		text-align: center;
		.icon-logo {
			text-align: center;
			margin: 62px 0 66px 0;
			img {
				width: 220px;
				height: 220px;
				border-radius: 50%;
			}
		}
		ul {
			li {
				position: relative;
				input {
					height: 80px;
					width: 618px;
					border: 2px solid #ccc;
				    border-radius: 8px;
					padding-left: 16px;
					outline: none;
				    -webkit-appearance: none;
				    font-size: 28px;
				}
				input::-webkit-input-placeholder{
		            color: #cecece;
		            font-size: 28px;
		        }
		        .send {
		        	position: absolute;
		        	right: 0;
		        	top: 24px;
		        	width: 193px;
		        	height: 36px;
		        	line-height: 36px;
		        	font-size: 28px;
		        	color: #000;
		        	border-left: 2px solid #ccc;
		        	text-align: center;
		        }
		        .send-again {
		        	color: #ccc;
		        	font-size: 24px;
		        }
		        .error {
		        	position: absolute;
		        	left: 16px;
		        	bottom: -40px;
		        	height: 40px;
		        	line-height: 40px;
		        	color: #CE3C3D;
		        	font-size: 20px;
		        	display: none;
		        }
			}
			li.errorInfo, li.errorInfo2 {
				input {
					border: 2px solid #CE3C3D;
				}
				.error {
					display: block;
				}
			}
			li:first-child {
				margin-bottom: 40px;
			}
		}
		.tip {
			color: #CECECE;
			font-size: 22px;
			margin: 52px 0 47px 0;
		}
		.btn-enter {
			display: inline-block;
			height: 84px;
			line-height: 84px;
			width: 100%;
			border-radius: 10px;
			background: rgba(0, 86, 255, 1);
			color: #fff;
			font-size: 32px;
		}
		.btn-enter-disabled {
			background: #D8D8D8;
		}
		.agreement {
			margin: 62px 0 135px 0;
			font-size: 24px;
			p {
				position: relative;
				display: inline-block;
				color: #2C2C2C;
				height: 40px;
				line-height: 40px;
				.check {
					position: absolute;
					left: -40px;
					top: 6px;
					width: 24px;
					height: 24px;
					background: url(../assets/image/check.png);
					background-size: 100%;
				}
				.no-check {
					position: absolute;
					left: -40px;
					top: 6px;
					width: 24px;
					height: 24px;
					border: 2px solid #d8d8d8;
				}
				a {
					color: #0056FF;
					font-size: 24px;
					text-decoration: none;
				}
			}
		}
		a {
			color: #0056FF;
		    font-size: 28px;
			text-decoration: none;
		}
		.agreement-warn-wrapper {
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			display: flex;
	        justify-content: center;
	        align-items: center;
			.agreement-warn {
				width: 440px;
				height: 136px;
				background:rgba(49,49,49,0.9);
				border-radius: 40px ;
				color: #fff;
				font-size: 28px;
				.icon-close {
					display: inline-block;
					width: 32px;
					height: 32px;
					background: url(../assets/image/icon-close.png);
					background-size: 100%;
					margin: 24px 0 20px 0;
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
