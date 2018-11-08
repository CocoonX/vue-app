// import * as type from '../mutations_type.js'
import axios from 'axios'
export default {
    state: {
        mobile: ''
    },
    // getters: {
    //     hideMobile: (state, getters) => {
    //         return state.mobile.substring(0, 3) + '****' + state.mobile.substring(7)
    //     }
    // },
    // mutations: {
    //     [type.GET_USER_INFO] (state, data) {
    //         console.log(data)
    //         state.mobile = data
    //         console.log(state)
    //     }
    // },
    actions: {
        logout ({ commit, state }, payload) {
            return axios({
                method: 'get',
                url: '/logout'
            }).then(function (res) {
                return res
            })
        }
    }
}
