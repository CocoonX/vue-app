import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import Search from '../pages/Search'
import Collect from '../pages/Collect'
import My from '../pages/My'
import Content from '../pages/Content.vue'
import Login from '../pages/Login.vue'
import AccountLogin from '../pages/AccountLogin.vue'
import ModifyPassword from '../pages/ModifyPassword.vue'
import Mobile from '../pages/Mobile.vue'
import Agreement from '../pages/Agreement.vue'
import PartyBuild from '../pages/PartyBuild.vue'
import Maker from '../pages/Maker.vue'  // 创客
import ProjectList from '../pages/ProjectList.vue'  // 专题列表
import * as type from '../store/mutations_type.js'
import store from '../store/index.js'

Vue.use(Router)

const routes = [
  {
    path: '/home/:type',
    name: 'home',
    meta: {
      title: '首页'
    },
    component: Home
  },
  {
    path: '/search',
    name: 'search',
    meta: {
      title: '搜索'
    },
    component: Search
  },
  {
    path: '/collect',
    name: 'collect',
    meta: {
      title: '我的收藏'
    },
    component: Collect
  },
  {
    path: '/my',
    name: 'my',
    meta: {
      title: '个人中心'
    },
    component: My
  },
  {
    path: '/content/:id',
    name: 'content',
    meta: {
      title: '产业创客'
    },
    component: Content
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: Login
  },
  {
    path: '/accountLogin',
    name: 'accountLogin',
    meta: {
      title: '登录'
    },
    component: AccountLogin
  },
  {
    path: '/findPassword',
    name: 'findPassword',
    meta: {
      title: '找回密码'
    },
    component: ModifyPassword
  },
  {
    path: '/modifyPassword',
    name: 'modifyPassword',
    meta: {
      title: '修改密码'
    },
    component: ModifyPassword
  },
  {
    path: '/mobile',
    name: 'mobile',
    meta: {
      title: '找回密码'
    },
    component: Mobile
  },
  {
    path: '/agreement',
    name: 'agreement',
    meta: {
      title: '用户协议'
    },
    component: Agreement
  },
  {
    path: '/partyBuild',
    name: 'partyBuild',
    meta: {
      title: '党建'
    },
    component: PartyBuild
  },
  {
    path: '/maker',
    name: 'maker',
    meta: {
      title: '创客'
    },
    component: Maker
  },
  {
    path: '/projectList/:columnId/:dissertationId',
    name: 'projectList',
    meta: {
      title: '栏目列表'
    },
    component: ProjectList
  },
  {
    path: '*',
    meta: {
      title: '首页'
    },
    redirect: '/home/0'
  }
]

const router = new Router({
  routes
})

// 滚动条控制的部分
router.afterEach((to, from) => {
  store.commit(type.SAVE_POSITION, {
    name: from.path,
    position: document.body.scrollTop || document.documentElement.scrollTop
  })
  if (store.state.home.positions[to.path]) {
    setTimeout(() => {
      window.scrollTo(0, store.state.home.positions[to.path])
    }, 80)
  } else {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 80)
  }
})
export default router
