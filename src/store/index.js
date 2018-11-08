import Vue from 'vue'
import Vuex from 'vuex'
import homeStore from './modules/homeStore.js'
import loginStore from './modules/loginStore.js'
import passwordStore from './modules/passwordStore.js'
import myStore from './modules/myStore.js'
import partyBuildStore from './modules/partyBuild.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        home: homeStore,
        loginStore: loginStore,
        passwordStore: passwordStore,
        myStore: myStore,
        partyBuildStore: partyBuildStore
    }
})
