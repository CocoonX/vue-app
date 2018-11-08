<template>
  <div class="footer">
    <router-link :to="home" class="navItem" :class="{'router-link-active': isActive}">
      <!-- <Icon type="home" class="navItem-icon"></Icon> -->
      <i class="icon-home"></i>
      <span class="text-home">首页</span>
    </router-link>
    <router-link to="/partyBuild" class="navItem">
      <i class="icon-party"></i>
      <span class="text-party">党建</span>
    </router-link>
    <router-link to="/maker" class="navItem">
      <i class="icon-maker"></i>
      <span class="text-maker">创客</span>
    </router-link>
    <router-link to="/my" class="navItem" v-if="isLogin">
      <i class="icon-my"></i>
      <span class="text-my">我的</span>
    </router-link>
    <router-link to="/login" class="navItem" v-else>
      <i class="icon-my"></i>
      <span class="text-my">我的</span>
    </router-link>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isActive: true
    }
  },
  created () {
    if (this.$route.name === 'home') {
      this.isActive = true
    } else {
      this.isActive = false
    }
  },
  computed: {
    home () {
      return '/home/' + this.$store.state.home.type || '/home/0'
    },
    isLogin () {
      return this.$store.state.loginStore.loginStatus || localStorage.getItem('userName')
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/style/common.scss';

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid #ddd;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: center;
    z-index: 200;
    .navItem {
      flex-grow: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #777;
      align-items: center;
      .navItem-icon {
        font-size: px2rem(35px);
      }
      i {
        display: inline-block;
        width: 50px;
        height: 50px;
        margin-top: 10px;
      }
      .icon-home {
        background: url(../assets/image/icon-home-grey.png);
        background-size: 100%;
      }
      .icon-party {
        background: url(../assets/image/icon-party-grey.png);
        background-size: 100%;
      }
      .icon-maker {
        background: url(../assets/image/icon-maker-grey.png);
        background-size: 100%;
      }
      .icon-my {
        background: url(../assets/image/icon-my-grey.png);
        background-size: 100%;
      }
      span {
        font-size: 20px;
      }
    }
    .router-link-active {
      // color: #2E79F4;
      align-items: center;
      i {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      .icon-home {
        background: url(../assets/image/icon-home.png);
        background-size: 100%;
      }
      .text-home {
        color: #2E79F4;
      }
      .icon-party {
        background: url(../assets/image/icon-party.png);
        background-size: 100%;
      }
      .text-party {
        color: #D40000;
      }
      .icon-maker {
        background: url(../assets/image/icon-maker.png);
        background-size: 100%;
      }
      .text-maker {
        color: #01ACAA;
      }
      .icon-my {
        background: url(../assets/image/icon-my.png);
        background-size: 100%;
      }
      .text-my {
        color: #2E79F4;
      }
    }
  }
</style>

