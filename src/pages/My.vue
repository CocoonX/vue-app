<template>
  <div class="about_template">
    <div class="personal_information">
      <span class="personal_portrait"></span>
      <span class="mobile">{{hideMobile}}</span>
    </div>
    <c-nav :list="list[0]" @click0="goCollect" class="nav0"></c-nav>
    <c-nav :list="list[1]" @click0="showSendMsg = true" class="nav1"></c-nav>
    <div class="btn_logout" @click="logout">退出登录</div>
    <div class="send_msg_wrapper" v-if="showSendMsg">
      <div class="send_msg">
        <p>将给手机{{hideMobile}}发送验证码</p>
        <ul class="clearfix">
          <li @click="showSendMsg = false">取消</li>
          <li @click="confrim">确定</li>
        </ul>
      </div>
    </div>
    <c-footer></c-footer>
  </div>
</template>
<script>
import CNav from '../components/Nav.vue'
import CFooter from '../components/Footer.vue'
import { Toast } from 'mint-ui'

export default {
  components: {
    CNav,
    CFooter
  },
  data () {
    return {
      list: [
        [
          {msg: '我的收藏'}
        ],
        [
          {msg: '修改密码'}
        ]
      ],
      showSendMsg: false,
      mobile: ''
    }
  },
  methods: {
    goCollect () {
      this.$router.push({path: '/collect'})
    },
    confrim () {
      this.sendResetMsg()
    },
    sendResetMsg () {
      this.$store.dispatch({
        type: 'sendResetMsg',
        data: {
          mobile: localStorage.userName
        }
      }).then((res) => {
        if (res.data.msg === '短信验证码发送成功') {
          Toast({
            message: '发送成功'
          })
          this.showSendMsg = false
          this.$router.push({path: '/modifyPassword#' + localStorage.userName})
          sessionStorage.time = this.$store.state.loginStore.totalCountTime
          this.$store.commit('SHOW_COUNT_TIME', true)
        } else {
          this.showSendMsg = false
          Toast({
            message: '今日验证码发送次数已达上限'
          })
        }
      })
    },
    toAccountLogin () {
      this.$router.push({path: '/accountLogin'})
    },
    logout () {
      this.$store.dispatch({
        type: 'logout'
      }).then((res) => {
        if (res.data.msg === '您已安全退出') {
          this.$router.push({path: '/home/0'})
          sessionStorage.removeItem('sessionId')
          localStorage.removeItem('userName')
          sessionStorage.removeItem('openid')
          localStorage.removeItem('collection')
          this.$store.state.loginStore.loginStatus = false
          this.$store.state.loginStore.userName = ''
          this.$store.state.home.collection = []
        }
      })
    },
    parseMobile (mobile) {
      return mobile.substring(0, 3) + '****' + mobile.substring(7)
    }
  },
  computed: {
    hideMobile () {
      if (this.$store.state.loginStore.userName || localStorage.userName) {
        return this.parseMobile(this.$store.state.loginStore.userName || localStorage.userName)
      }
    }
  }
}
</script>
<style lang="scss">
  // @import '../assets/style/common.scss';
   .about_template {
     background: #eee;
     overflow: auto;
     padding-bottom: 80px;
   }
  .personal_information {
    height: 264px;
    background: #fff;
    .personal_portrait {
      float: left;
      width: 160px;
      height: 160px;
      background: url('../assets/image/head.png');
      background-size: 100%;
      margin: 62px 19px 0 30px;
    }
    .mobile {
      font-size: 24px;
      color: #1E1E1E;
      line-height: 264px;
    }
  }
  .nav0 {
    .myNav_item {
      span:first-child {
        display: inline-block;
        float: left;
        width: 40px;
        height: 36px;
        background: url('../assets/image/icon-star.png');
        background-size: 100%;
        margin: 26px 0 0 20px;
      }
    }
  }
  .nav1 {
    .myNav_item {
      span:first-child {
        display: inline-block;
        float: left;
        width: 37px;
        height: 38px;
        background: url('../assets/image/icon-password.png');
        background-size: 100%;
        margin: 26px 0 0 20px;
      }
    }
  }
  .btn_logout {
    height: 92px;
    line-height: 92px;
    background: #fff;
    color: #363636;
    text-align: center;
    font-size: 30px;
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
</style>
