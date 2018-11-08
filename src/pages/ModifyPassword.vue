<template>
	<div class="modify-password">
		<ul>
			<li class="clearfix" :class="{errorInfo: showCodeError,errorInfo2: showNumError}">
				<input type="number" placeholder="请输入验证码" v-model="msgCode">
				<span class="send" v-if="!showCountTime && !showRepeatSendBtn" @click="sendResetMsg">发送验证码</span>
				<span class="send send-again" v-if="showCountTime && !showRepeatSendBtn">重新发送(<span>{{countTime}}</span>s)</span>
				<span class="send" v-if="showRepeatSendBtn" @click="sendResetMsg()">重新发送</span>
				<span class="errorCode">{{codeErrorMsg}}</span>
			</li>
			<li :class="{errorInfo: showPasswordError}">
				<input type="password" placeholder="请输入新密码（6~20位英文或数字）" v-model="password">
				<span class="errorPassword">密码不符合规则</span>
			</li>
		</ul>
		<span class="btn-next" v-if="msgCode && msgCode.length === 4 && password && !showCodeError && !showPasswordError" @click="resetPassword">提交</span>
		<span class="btn-next btn-next-disabled" v-else>提交</span>
	</div>
</template>
<script>
import { Toast } from 'mint-ui'
import { mapState } from 'vuex'
export default {
    data () {
        return {
            countTime: sessionStorage.time ? sessionStorage.time : this.$store.state.loginStore.totalCountTime,
			mobile: this.$route.hash.substring(1),
			password: '',
            msgCode: '',
			showCodeError: false,
			showPasswordError: false,
			showNumError: false,
			showRepeatSendBtn: false,
			codeErrorMsg: ''
        }
    },
    created () {
		if (sessionStorage.time) {
			this.$store.state.passwordStore.showCountTime = true
			this.count()
		}
    },
    methods: {
		count () {
			var _this = this
			window.time = setInterval(function () {
				_this.countTime--
				sessionStorage.time = _this.countTime
				if (_this.countTime < 1) {
					_this.showRepeatSendBtn = true
					clearInterval(window.time)
					sessionStorage.removeItem('time')
					_this.$store.commit('SHOW_COUNT_TIME', false)
				}
			}, 1000)
		},
		sendResetMsg () {
			this.$store.dispatch({
				type: 'sendResetMsg',
				data: {
					mobile: this.mobile
				}
			}).then((res) => {
				if (res.data.msg === '短信验证码发送成功') {
					Toast({
						message: '发送成功'
					})
					sessionStorage.time = this.countTime = this.$store.state.loginStore.totalCountTime
					this.showRepeatSendBtn = false
					this.$store.commit('SHOW_COUNT_TIME', true)
					this.count()
				} else {
					Toast({
						message: '发送失败'
					})
					this.$store.commit('SHOW_COUNT_TIME', false)
				}
			})
		},
        checkMsg () {
			this.$store.dispatch({
				type: 'checkMsg',
				data: {
					mobile: this.mobile,
					code: this.msgCode
				}
			}).then((res) => {
				if (res.data.msg === '验证成功') {
                    this.showCodeError = false
					this.accessStatus = true
                } else if (res.data.msg === '验证失败') {
                	this.showCodeError = true
                    this.codeErrorMsg = '验证码错误'
                } else {
                    this.showCodeError = true
                    this.codeErrorMsg = res.data.msg
                }
			})
        },
		resetPassword () {
			this.$store.dispatch({
				type: 'resetPassword',
				data: {
					userName: this.mobile,
					password: this.password
				}
			}).then((res) => {
				if (res.data.msg === '修改密码成功') {
					Toast({
						message: '新密码设置成功!',
						duration: 2000
					})
					var _this = this
					setTimeout(function () {
						_this.login()
			            if (_this.fromPath.includes('content')) {
			              _this.$router.push({path: this.fromPath})
			            } else {
			              _this.$router.push({path: '/my'})
			            }
						sessionStorage.removeItem('countTime')
						_this.msgCode = ''
						_this.password = ''
					}, 2000)
				}
			})
		},
		login () {
            this.$store.dispatch({
				type: 'accountLogin',
                data: {
                    HttpServletRequest: {
                        userName: this.mobile,
                        password: this.password,
                        clearSessionId: sessionStorage.sessionId,
                        smsSucceed: false
                    }
                }
			}).then((res) => {
				if (res.data.msg === '登录成功') {
					// this.$router.push({path: '/my'})
          var _this = this
          if (this.fromPath.includes('content')) {
            _this.$router.push({path: this.fromPath})
          } else {
            _this.$router.push({path: '/my'})
          }
                    localStorage.setItem('userId', res.data.data.userId)
                    sessionStorage.setItem('sessionId', res.data.data.sessionId)
                    sessionStorage.setItem('userName', this.mobile)
				}
			})
        }
    },
    watch: {
		$route () {
			this.countTime = sessionStorage.time
			clearInterval(window.time)
			this.count()
		},
        msgCode: function () {
			if (this.msgCode.length > 4) {
				this.showCodeError = true
				this.codeErrorMsg = '请输入4位数字'
			} else if (this.msgCode.length === 4) {
				this.checkMsg()
            } else {
				this.showCodeError = false
				this.codeErrorMsg = '请输入4位数字'
            }
        },
        password: function () {
			var reg = /^[A-Za-z0-9_]{6,20}$/
			if (this.password) {
				if (reg.test(this.password)) {
					this.showPasswordError = false
				} else {
					this.showPasswordError = true
				}
			} else {
				this.showPasswordError = false
			}
        }
    },
    computed: {
      ...mapState({
        fromPath: state => state.loginStore.fromPath
      }),
		showCountTime () {
			return this.$store.state.passwordStore.showCountTime
		}
    }
}
</script>
<style lang="scss">
    .modify-password{
		padding: 80px 44px 0 70px;
		text-align: center;
		ul {
			li {
				position: relative;
				margin-bottom: 40px;
				border: 2px solid #ccc;
				border-radius: 8px;
				height: 80px;
				input {
					height: 76px;
					width: 600px;
					padding-left: 16px;
					outline: none;
					border: 0;
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
		        	border-left: 2px solid #ccc;
		        	text-align: center;
		        	color: #000000;
		        	font-size: 28px;
		        }
		        .send-again {
		        	color: #ccc;
		        	font-size: 24px;
		        }
		        .errorCode, .errorNum, .errorPassword {
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
			li.errorInfo {
				border: 2px solid #CE3C3D;
				.errorCode {
					display: block;
				}
				.errorPassword {
					display: block;
				}
			}
			li.errorInfo2 {
				border: 2px solid #CE3C3D;
				.errorNum {
					display: block;
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
			background: rgba(0, 86, 255, 0.61)
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
