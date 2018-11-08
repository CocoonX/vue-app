import * as type from '../mutations_type.js'
import axios from 'axios'
export default {
    state: {
        totalCountTime: 60,
        loginStatus: false,
        userName: '',
        mobile: '',
        agreementStatus: true,
        showAgreementWarn: false,
        fromPath: ''
    },
    mutations: {
        [type.LOGIN] (state, data) {
            state.userName = data
            state.loginStatus = true
            // localStorage.userName = data
        },
        [type.GET_USER_INFO] (state, data) {
            state.userName = data
            state.mobile = data
            localStorage.userName = data
        }
    },
    actions: {
        sendLoginMsg ({ commit, state }, payload) {
            return axios({
                method: 'post',
                url: '/sendLoginMsg',
                data: payload.data
            }).then(function (res) {
                return res
            })
        },
        checkMsg ({ commit, state }, payload) {
            return axios({
                method: 'post',
                url: '/checkMsg',
                data: payload.data
            }).then(function (res) {
                return res
            })
        },
        registerInWechat ({ commit, state }, payload) {
            return axios({
                method: 'post',
                url: '/registerInWechat',
                data: payload.data
            }).then(function (res) {
                return res
            })
        },
        login ({ commit, state }, payload) {
            var params = new URLSearchParams()
            params.append('userName', payload.data.HttpServletRequest.userName)
            params.append('password', '')
            params.append('clearSessionId', payload.data.HttpServletRequest.clearSessionId)
            params.append('smsSucceed', payload.data.HttpServletRequest.smsSucceed)
            return axios({
                method: 'post',
                url: '/login',
                data: params
            }).then(function (res) {
                if (res.data.msg === '登录成功') {
                    localStorage.setItem('userName', payload.data.HttpServletRequest.userName)
                }
                commit('LOGIN', payload.data.HttpServletRequest.userName)
                return res
            })
        },
        accountLogin ({ commit, state }, payload) {
            console.log(payload)
            var params = new URLSearchParams()
            params.append('userName', payload.data.HttpServletRequest.userName)
            params.append('password', payload.data.HttpServletRequest.password)
            params.append('clearSessionId', payload.data.HttpServletRequest.clearSessionId)
            params.append('smsSucceed', payload.data.HttpServletRequest.smsSucceed)
            return axios({
                method: 'post',
                url: '/login',
                data: params
            }).then(function (res) {
                if (res.data.msg === '登录成功') {
                    localStorage.setItem('userName', payload.data.HttpServletRequest.userName)
                }
                commit('LOGIN', payload.data.HttpServletRequest.userName)
                return res
            })
        },
        getUserInfo ({ commit, state }, payload) {
            return axios({
                method: 'post',
                url: '/getUserInfo',
                data: payload.data
            }).then(function (res) {
                console.log(res)
                commit('GET_USER_INFO', res.data.data)
                return res
            })
        }
    }
}
