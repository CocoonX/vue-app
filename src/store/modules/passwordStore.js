import * as type from '../mutations_type.js'
import axios from 'axios'
export default {
    state: {
        showCountTime: false
    },
    mutations: {
        [type.SHOW_COUNT_TIME] (state, payload) {
          state.showCountTime = payload
        }
    },
    actions: {
        sendResetMsg ({ commit, state }, payload) {
            return axios({
                method: 'post',
                url: '/sendResetMsg',
                data: payload.data
            }).then(function (res) {
                return res
            })
        },
        resetPassword ({ commit, state }, payload) {
            console.log(payload)
            return axios({
                method: 'post',
                url: '/reset',
                data: payload.data
            }).then(function (res) {
                return res
            })
        },
        checkUserByName ({ commit, state }, payload) {
            return axios({
                method: 'post',
                url: '/checkUserByName',
                data: payload.data
            }).then(function (res) {
                return res
            })
        }
    }
}
