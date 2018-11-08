import * as type from '../mutations_type.js'
import jsonp from 'jsonp'
import axios from 'axios'
import { source } from '../../utils/source.js'
// import moment from 'moment'
import api from '../../utils/api.js'
export default {
  state: {
    channellist: [],
    newsIndex: 0,
    newsPrevIndex: 0,
    end: false,
    channelId: 0,
    loading: false,                 // loading图片的切换
    ifReturnMsg: '',               // 是否返回数据
    loadmore: false,               // 是否加载更多新闻
    ifReturnMore: true,            // 是否返回更多新闻
    noMore: false,
    list: {},                    // 新闻
    article: {                      // 文章
      title: '',
      detail_source: '',
      content: ''
    },
    loadmoreSession: false,         // 是否加载更多段子
    ifReturnSession: true,          // 是否有段子返回
    collection: [],                 // 收藏
    isStar: false,
    search: [],                     // 搜索
    noDataFlag: false,                  // 没有search数据
    loadmoreSearch: false,          // 加载更多搜索
    ifReturnMoreSearch: true,       // 是否返回更多搜索
    ifReturnSearch: true,           // 是否返回搜索
    history: localStorage.getItem('chan_history')
      ? JSON.parse(localStorage.getItem('chan_history'))
      : { count: 0, items: [] },
    localCollection: localStorage.getItem('chan_collection')
      ? JSON.parse(localStorage.getItem('chan_collection'))
      : [],
    newsLength: 0,                  // 刷新返回的新闻数量
    ifReturnRefresh: false,         // 是否刷新成功
    type: '',                       // 记录从主页离开时的新闻类型
    positions: {},
    isRegister: false,
    loginStatus: false,
    openid: '',
    positionName: '',
    source: true,
    newsDetailsource: true,
    newsListSource: true,
    collectListSource: true,
    searchListSource: true,
    isColumnContent: '',
    isAnimation: false,
    title: ''
  },
  mutations: {
    [type.GET_CHANNELLIST](state, payload) {
      state.channellist = payload.data
      for (var i = 0; i < state.channellist.length; i++) {
        // var n = state.channellist[i].channelSite - 1
        if (!state.list[i]) {
          state.list[i] = []
        }
        state.channellist[i].url = '/home' + '/' + (state.channellist[i].channelSite - 1)
      }
    },
    [type.GET_CHANNELID](state, payload) {
      state.channelId = payload.data
    },
    [type.GET_NEWSLIST](state, payload) {
      let type = payload.type
      for (var i = 0; i < state.channellist.length; i++) {
        if (state.channellist[i].channelId === type + '') {
          let channelSite = (state.channellist[i].channelSite - 1)
          for (let item of payload.data) {
            state.list[channelSite].push(item)
          }
          return false
        }
      }
    },
    // 获取文章
    [type.GET_ARTICLE](state, payload) {
      for (let key in payload) {
        state.article[key] = payload[key]
        state.isStar = payload.isStar
      }
    },
    // 获取收藏
    [type.GET_COLLECTION](state, data) {
      state.collection = data
    },
    // 搜索
    [type.GET_SEARCH](state, { data, keyword }) {
      if (!data.length) {
        state.noDataFlag = true
        return
      }
      for (let item of data) {
        if (item.title && item.title.includes(keyword)) {
          item.title = item.title.replace(new RegExp(keyword, 'g'), `<b style="color: red">${keyword}</b>`)
        }
        state.search.push(item)
      }
    },
    // 是否返回搜索
    [type.RETURN_SEARCH](state, boolean) {
      state.ifReturnSearch = boolean
    },
    // 是否在加载中
    [type.IF_LOADING](state, boolean) {
      state.loading = boolean
    },
    // 添加历史
    [type.ADD_HISTORY](state, content) {
      const item = {
        id: state.history.count++,
        content
      }
      state.history.items.unshift(item)
      localStorage.setItem('chan_history', JSON.stringify(state.history))
    },
    // 删除历史
    [type.REMOVE_HISTORY](state, id) {
      let index = state.history.items.findIndex(item => {
        return item.id === id
      })
      state.history.items.splice(index, 1)
      localStorage.setItem('chan_history', JSON.stringify(state.history))
    },
    // 清空历史
    [type.CLEAR_HISTORY](state) {
      state.history.items = []
      localStorage.setItem('chan_history', JSON.stringify(state.history))
    },
    // 是否加载更多搜索
    [type.LOADMORE_SEARCH](state, boolean) {
      state.loadmoreSearch = boolean
    },
    // 是否返回更多搜索
    [type.RETURN_MORE_SEATCH](state, boolean) {
      state.ifReturnMoreSearch = boolean
    },
    // 添加收藏
    [type.ADD_COLLECTION](state, data) {
      state.localCollection.unshift(data)
      localStorage.setItem('chan_collection', JSON.stringify(state.localCollection))
    },
    // 删除收藏
    [type.REMOVE_COLLECTION](state, id) {
      const index = state.localCollection.findIndex(item => {
        return item.id === id
      })
      state.localCollection.splice(index, 1)
      localStorage.setItem('chan_collection', JSON.stringify(state.localCollection))
    },
    // 刷新消息
    [type.REFRESH_NEWS](state, payload) {
      if (payload.data.length > 0) {
        let type = payload.type
        for (var i = 0; i < state.channellist.length; i++) {
          if (state.channellist[i].channelId === type + '') {
            let channelSite = (state.channellist[i].channelSite - 1)
            state.list[channelSite] = []
            for (let item of payload.data) {
              state.list[channelSite].push(item)
            }
          }
        }
        state.isAnimation = false
      } else {
        state.noMore = true
      }
    },
    // 刷新消息的数量
    [type.REFRESH_LENGTH](state, length) {
      state.newsLength = length
      state.ifReturnRefresh = true
    },
    // 记录从主页离开时的新闻类型
    [type.LOG_TYPE](state, type) {
      state.type = type
    },
    // 保存网页离开时的位置
    [type.SAVE_POSITION](state, { name, position }) {
      state.positions[name] = position
      // state.positionName = name
      // console.log(state.positions)
    }
  },
  actions: {
    getChannelList({ commit, state }, payload) {
      let params = {
        userId: localStorage.getItem('userId')
      }
      axios.post('/news/getNewsChannelList', params).then((res) => {
        commit(type.GET_CHANNELLIST, {
          data: res.data.data.channelList
        })
      })
    },
    getChannelId({ commit, state }, index) {
      for (var i = 0; i < state.channellist.length; i++) {
        if (state.channellist[i].channelSite === (index + 1)) {
          commit(type.GET_CHANNELID, {
            data: state.channellist[i].channelId
          })
        }
      }
    },
    getNews({ commit, state }, payload) {
      state.noMore = false
      state.loading = true
      state.ifReturnMore = true
      let params = {
        userId: localStorage.getItem('userId'),
        channelId: payload.type,
        pageNum: 0,
        source: 'inside'
      }
      if (!source()) {
        // source为true是内部  false为外部
        params.userId = '0'
        params.source = 'outside'
      }
      // state.list[state.newsIndex] = []
      if (payload.type >= 0) {
        axios.post('/news/getNewsList', params)
          .then((res) => {
            console.log(res)
            if (res.data.data.isSuccessful) {
              state.loading = false
              state.ifReturnMsg = true
              state.ifReturnMore = true
              // if (res.data.data.newsList.length < 20) {
              //   state.noMore = true
              // }
              for (var i = 0; i < res.data.data.newsList.length; i++) {
                if (res.data.data.newsList[i].title.length > 28 && (res.data.data.newsList[i].showType === 1 || res.data.data.newsList[i].showType === 3)) {
                  res.data.data.newsList[i].title = res.data.data.newsList[i].title.substring(0, 28) + '...'
                } else if (res.data.data.newsList[i].title.length > 40 && res.data.data.newsList[i].showType === 3) {
                  res.data.data.newsList[i].title = res.data.data.newsList[i].title.substring(0, 40) + '...'
                }
                res.data.data.newsList[i].grey = false
                res.data.data.newsList[i].expand = false
                // res.data.data.newsList[i].publishTime = moment(new Date(res.data.data.newsList[i].publishTime * 1000)).format('YYYY-MM-DD')
              }
              commit(type.GET_NEWSLIST, {
                type: payload.type,
                data: res.data.data.newsList
              })
            } else {
              // 分享开关是否开启，true为开启，false为关闭
              state.newsListSource = false
            }
          })
      }
    },
    // 获取文章
    getArticle({ commit, state }, payload) {
      state.loading = true
      let params = {
        userId: localStorage.getItem('userId'),
        newsId: payload.id,
        source: 'inside'
      }
      if (!source()) {
        // source为true是内部  false为外部
        params.newsId = payload.id.split('&')[0]
        params.userId = '0'
        params.source = 'outside'
      }
      axios.get('http://106.37.72.179/reception/receptionBuried?u_id=' + localStorage.getItem('userId') + '&news_id=' + payload.id + '&rpage=detail&platform=WOA')
        .then((res) => {
        })
      return axios.post('/news/getNewsDetails', params)
        .then((res) => {
          if (res.data.data.isSuccessful) {
            state.loading = false
            let data = res.data.data.newsDetails
            state.ifReturnMsg = true
            commit(type.GET_ARTICLE, {
              title: data.title,
              detail_source: data.sourceName,
              content: data.details,
              isStar: data.isStar
            })
          } else {
            state.newsDetailsource = false
          }
        })
    },
    // 获取更多新闻
    getMoreNews({ commit, state }, payload) {
      // state.noMore = false
      state.loadmore = true
      let params = {
        userId: localStorage.getItem('userId'),
        channelId: payload.type,
        pageNum: 1,
        source: 'inside'
      }
      if (!source()) {
        // source为true是内部  false为外部
        params.userId = '0'
        params.source = 'outside'
      }
      axios.post('/news/getNewsList', params).then((res) => {
        if (res.data.data.isSuccessful) {
          state.loadmore = false
          // state.ifReturnMore = false
          if (res.data.data.newsList.length === 0) {
            state.noMore = true
          }
          for (var i = 0; i < res.data.data.newsList.length; i++) {
            if (res.data.data.newsList[i].title.length > 28 && res.data.data.newsList[i].showType === 1) {
              res.data.data.newsList[i].title = res.data.data.newsList[i].title.substring(0, 28) + '...'
            } else if (res.data.data.newsList[i].title.length > 40 && res.data.data.newsList[i].showType === 3) {
              res.data.data.newsList[i].title = res.data.data.newsList[i].title.substring(0, 40) + '...'
            }
            res.data.data.newsList[i].grey = false
            res.data.data.newsList[i].expand = false
            // res.data.data.newsList[i].publishTime = moment(new Date(res.data.data.newsList[i].publishTime * 1000)).format('YYYY-MM-DD')
          }
          commit(type.GET_NEWSLIST, {
            type: payload.type,
            data: res.data.data.newsList
          })
        } else {
          state.newsListSource = false
        }
      })
    },
    // 获取搜索
    getSearch({ commit, state }, { offset, keyword }) {
      commit('IF_LOADING', true)
      commit('RETURN_SEARCH', false)
      let params = {
        userId: localStorage.getItem('userId'),
        newsKeys: keyword,
        pageNum: offset,
        source: 'inside'
      }
      if (!source()) {
        params.source = 'outside'
        params.userId = '0'
      }
      axios.post('news/getSearchNewsList', params).then((res) => {
        if (res.data.data.isSuccessful) {
          for (var i = 0; i < res.data.data.newsList.length; i++) {
            if (res.data.data.newsList[i].title.length > 28 && res.data.data.newsList[i].showType === 1) {
              res.data.data.newsList[i].title = res.data.data.newsList[i].title.substring(0, 28) + '...'
            } else if (res.data.data.newsList[i].title.length > 40 && res.data.data.newsList[i].showType === 3) {
              res.data.data.newsList[i].title = res.data.data.newsList[i].title.substring(0, 40) + '...'
            }
            res.data.data.newsList[i].expand = false
          }
          commit('IF_LOADING', false)
          commit('RETURN_SEARCH', true)
          commit('GET_SEARCH', {
            data: res.data.data.newsList,
            keyword
          })
        } else {
          state.searchListSource = false
        }
      })
    },
    // 获取更多搜索
    getMoreSearch({ commit, state }, { offset, keyword }) {
      state.noMore = false
      state.loadmore = true
      commit('LOADMORE_SEARCH', false)
      let params = {
        userId: localStorage.getItem('userId'),
        newsKeys: keyword,
        pageNum: offset,
        source: 'inside'
      }
      if (!source()) {
        params.source = 'outside'
        params.userId = '0'
      }
      axios.post('news/getSearchNewsList', params).then((res) => {
        if (res.data.data.isSuccessful) {
          state.loadmore = false
          if (res.data.data.newsList === []) {
            state.noMore = true
          }
          for (var i = 0; i < res.data.data.newsList.length; i++) {
            res.data.data.newsList[i].expand = false
          }
          commit('GET_SEARCH', {
            data: res.data.data.newsList,
            keyword
          })
        } else {
          state.searchListSource = false
        }
      }).catch(error => {
        commit('RETURN_MORE_SEATCH', false)
        return false
      })
    },
    // 刷新新闻
    refreshNews({ commit, state }, payload) {
      state.ifReturnRefresh = false
      let params = {
        userId: localStorage.getItem('userId'),
        channelId: payload.type,
        pageNum: 0,
        source: 'inside'
      }
      if (!source()) {
        // source为true是内部  false为外部
        params.userId = '0'
        params.source = 'outside'
      }
      axios.post('/news/getNewsList', params)
        .then((res) => {
          if (res.data.data.isSuccessful) {
            state.loading = false
            state.ifReturnMsg = true
            state.ifReturnMore = true
            for (var i = 0; i < res.data.data.newsList.length; i++) {
              if (res.data.data.newsList[i].title.length > 28 && res.data.data.newsList[i].showType === 1) {
                res.data.data.newsList[i].title = res.data.data.newsList[i].title.substring(0, 28) + '...'
              } else if (res.data.data.newsList[i].title.length > 40 && res.data.data.newsList[i].showType === 3) {
                res.data.data.newsList[i].title = res.data.data.newsList[i].title.substring(0, 40) + '...'
              }
              res.data.data.newsList[i].grey = false
              res.data.data.newsList[i].expand = false
              // res.data.data.newsList[i].publishTime = moment(new Date(res.data.data.newsList[i].publishTime * 1000)).format('YYYY-MM-DD')
            }
            commit(type.REFRESH_LENGTH, res.data.data.pageSize)
            commit(type.REFRESH_NEWS, {
              type: payload.type,
              data: res.data.data.newsList
            })
          } else {
            state.newsListSource = false
          }
        })
    },
    // 获取收藏新闻
    getStarNewsList({ commit, state }, payload) {
      return axios({
        method: 'post',
        url: '/news/getStarNewsList',
        data: payload.data
      }).then(function (res) {
        for (var i = 0; i < res.data.data.newsList.length; i++) {
          res.data.data.newsList[i].grey = false
          res.data.data.newsList[i].expand = false
          if (localStorage.collection) {
            for (var j = 0; j < JSON.parse(localStorage.collection).length; j++) {
              if (JSON.parse(localStorage.collection)[j].newsId === res.data.data.newsList[i].newsId) {
                res.data.data.newsList[i].grey = JSON.parse(localStorage.collection)[j].grey
              }
            }
          }
        }
        commit('GET_COLLECTION', res.data.data.newsList)
        localStorage.setItem('collection', JSON.stringify(res.data.data.newsList))
        return res
      })
    }
  }
}
