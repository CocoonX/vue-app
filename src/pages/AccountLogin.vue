<template>
	<div class="account-login">
		<div class="icon-logo">
			<img src="../assets/image/logo.png">
		</div>
		<ul>
			<li :class="{errorInfo: showMobileError}">
				<input type="number" placeholder="请输入手机号" v-model="mobile">
				<span class="error">{{errorMobileMsg}}</span>
			</li>
			<li :class="{errorInfo: showPasswordError}">
				<input type="password" placeholder="请输入密码" v-model="password">
				<span class="btn-find" @click="goFindPassword()">找回密码</span>
				<span class="error">密码错误</span>
			</li>
		</ul>
		<span class="btn-enter2" v-if="mobile && mobile.length === 11 && !showMobileError && !showPasswordError" @click="login">登录</span>
		<span class="btn-enter2 btn-enter-disabled2" v-else>登录</span>
		<a href="#/login">免密码登录</a>
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
import { mapState } from 'vuex'
export default {
    data () {
        return {
            mobile: '',
            password: '',
            showMobileError: false,
            showPasswordError: false,
            errorMobileMsg: '',
            showUnregisteWarn: false
        }
    },
    methods: {
        goFindPassword () {
            this.$router.push({path: '/mobile'})
        },
        closeAgreementWarn () {
            this.showAgreementWarn = false
        },
        checkMobile () {
            var reg = /^[1][3|4|5|7|8][0-9]{9}$/
            if (!reg.test(this.mobile)) {
                this.showMobileError = true
                this.errorMobileMsg = '请输入正确的手机号'
            }
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
					// this.$router.push({path: '/home/0'})
                    // console.log(window.history)
                    // if (this.fromPath.includes('content')) {
                    //     this.$router.push({path: this.fromPath})
                    // } else {
                    //     this.$router.push({path: '/home/0'})
                    // }
                    this.$router.push({path: '/home/0'})
                    this.mobile = ''
                    this.password = ''
                    localStorage.setItem('userId', res.data.data.userId)
                    sessionStorage.setItem('sessionId', res.data.data.sessionId)
                    this.getUserInfo()
                    var _this = this
                    setTimeout(function () {
                        _this.mobile = ''
                        _this.password = ''
                    }, 2000)
				} else if (res.data.msg === '密码不正确') {
                    this.showPasswordError = true
                } else if (res.data.msg === '未知账户') {
                    this.showUnregisteWarn = true
                    // this.showMobileError = true
                    // this.errorMobileMsg = '手机号未注册'
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
        },
        confrim () {
            this.$router.push({path: '/login#' + this.mobile})
            this.showUnregisteWarn = false
            this.mobile = ''
        }
    },
    watch: {
        $route (to, from) {
            if (from.name !== 'login' && from.name !== 'accountLogin') {
                this.showMobileError = false
                this.showPasswordError = false
                this.mobile = ''
                this.password = ''
            }
        },
        mobile: function () {
            this.showMobileError = false
            if (this.mobile.length > 11) {
                this.showMobileError = true
                this.errorMobileMsg = '请输入11位数字'
            } else if (this.mobile.length === 11) {
                this.mobile.length > 11
                this.checkMobile()
            }
        },
        password: function () {
            this.showPasswordError = false
        }
    },
  computed: {
    ...mapState({
      fromPath: state => state.loginStore.fromPath
    })
  }
}
</script>
<style lang="scss">
    .account-login {
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
                .btn-find {
                    position: absolute;
                    right: 0;
                    top: 24px;
                    width: 193px;
                    height: 36px;
                    line-height: 36px;
                    font-size: 28px;
                    border-left: 2px solid #ccc;
                    text-align: center;
                    color: #000000;
                }
                .btn-find-disabled {
                    color: #D4D4D4;
                    font-size: 28px;
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
            li.errorInfo {
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
        .btn-enter2 {
            display: inline-block;
            height: 84px;
            line-height: 84px;
            width: 100%;
            border-radius: 10px;
            background: rgba(0, 86, 255, 1);
            color: #fff;
            font-size: 32px;
            margin-top: 131px;
        }
        .btn-enter-disabled2 {
            background: #D8D8D8;
        }
        a {
            display: inline-block;
            color: #0056FF;
            font-size: 28px;
            text-decoration: none;
            margin-top: 244px;
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
                border-radius: 15px;
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
                    border-radius: 0 0 15px 0;
                }
            }
        }
    }
</style>
