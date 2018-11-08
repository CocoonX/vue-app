import * as type from '../mutations_type.js'
import axios from 'axios'
export default {
    state: {
        banner: [],
        dissertation: [],
        partyList: [],
        navList: []
    },
    mutations: {
        [type.GET_COLUMN] (state, data) {
            state.banner = data.banner
            state.dissertation = data.dissertation
        },
        [type.GET_MAKER_PLATES] (state, data) {
            state.partyList = data
        },
        [type.GET_DISSERTATION_LIST] (state, data) {
            console.log(data)
            state.navList = data
        }
    },
    actions: {
        getColumn ({ commit, state }, payload) {
            return axios({
                method: 'get',
                url: '/column/getColumn?columnId=' + payload.data.columnId + '&pageSize=' + payload.data.pageSize
            }).then(function (res) {
                commit('GET_COLUMN', res.data)
                // return res
            })
        },
        getDissertationList ({ commit, state }, payload) {
            return axios({
                method: 'get',
                url: '/column/getDissertationAndNews?columnId=' + payload.id + '&pageSize=1'
            }).then(function (res) {
                commit('GET_DISSERTATION_LIST', res.data.dissertation)
                return res
            })
        },
        getMakerplates ({ commit, state }, payload) {
            return axios({
                method: 'get',
                url: '/column/getNewsList?dissertationId=' + payload.data.id + '&startPage=' + payload.data.nowPage + '&pageSize=20'
            }).then(function (response) {
                if (response.status === 200) {
                    if (payload.data.more) { // more = true 的时候用于 上划加载时给list添加下一页的news
                        state.partyList = state.partyList.concat(response.data.news)
                        commit('GET_MAKER_PLATES', state.partyList)
                    } else { // more = false 的时候用于 下拉刷新
                        state.partyList = response.data.news
                        commit('GET_MAKER_PLATES', state.partyList)
                    }
                }
                // for(var i=0; i<response.data.news.length; i++){
                //     response.data.news[i].grey = false
                //     if (sessionStorage.collection) {
                //         for (var j=0; j<JSON.parse(sessionStorage.partyList).length; j++){
                //           if (JSON.parse(sessionStorage.partyList)[j].newsId === response.data.news[i].newsId) {
                //             response.data.news[i].grey = JSON.parse(sessionStorage.partyList)[j].grey
                //           }
                //         }
                //     }
                // }
                // sessionStorage.setItem('partyList', JSON.stringify(response.data.news))
                return response
            })
        }
    }
}
