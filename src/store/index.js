import Vue from 'vue'
import Vuex from 'vuex'
import { post_me_login, post_me_profile, get_me_login } from '@/network/functions.js'
import { Role } from '@/common/cnst.js'

Vue.use(Vuex)

const userModule = {
    state: {
        token: localStorage.getItem('token') || sessionStorage.getItem('token') ||'',
        userInfo: (!!localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo'))) ||
              (!!sessionStorage.getItem('userInfo') && JSON.parse(sessionStorage.getItem('userInfo'))) || {}
    },
    mutations: {
        setAuth(state, payload) {
            state.token = payload.token
            state.userInfo = payload.userInfo
            if (payload.remember) {
                localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
                localStorage.setItem('token', state.token)
            } else {
                sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo))
                sessionStorage.setItem('token', state.token)
            }
        },
        clearAuth(state) {
            state.token = ''
            state.userInfo = {}
            localStorage.removeItem('token')
            localStorage.removeItem("userInfo")
            sessionStorage.removeItem("token")
            sessionStorage.removeItem("userInfo")
        },
        updateUserInfo(state, payload) {
            state.userInfo.display_name = payload.display_name
            state.userInfo.desc = payload.desc
            if (!!sessionStorage.getItem('userInfo')) {
                sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo))
            }
            if (!!localStorage.getItem('userInfo')) {
                localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
            }
        }
    },
    actions: {
        checkSignIn(context) {
            get_me_login().then(res => {
                context.commit({
                    type: 'setAuth',
                    token: res.data.token,
                    userInfo: res.data.user
                })
            }).catch(err => {
                if (context.getters.debug) {
                    console.log("store checkSignIn", err)
                }
            })
        },
        setAuth(context, payload) {
            return new Promise((resolve, reject) => {
                post_me_login(payload.loginFormData).then(res => {
                    const token = res.data.token
                    const userInfo = res.data.user
                    context.commit({
                        type: 'setAuth',
                        token: token,
                        userInfo: userInfo,
                        remember: payload.loginFormData.remember
                    })
                    resolve(res)
                }).catch(err => {
                    if (context.getters.debug) {
                        console.log("store SignIn", err)
                    }
                    context.commit({
                        type: 'clearAuth'
                    })
                    reject(err)
                })
            })
        },
        clearAuth(context) {
            return new Promise((resolve, reject) => {
                try {
                    context.commit({
                        type: "clearAuth"
                    })
                    resolve()
                } catch(err) {
                    reject(err)
                }
            })
        },
        updateUserInfo(context, payload) {
            return new Promise((resolve, reject) => {
                post_me_profile(payload.profileFormData).then(() => {
                    context.commit({
                        type: 'updateUserInfo',
                        display_name: payload.profileFormData.display_name,
                        desc: payload.profileFormData.desc
                    })
                    resolve()
                }).catch(err => {
                    if (context.getters.debug) {
                        console.log("store refreshUser", err)
                    }
                    reject(err)
                })
            })
        }
    },
    getters: {
        // !! 将token转化为布尔值,如果token有值则返回true
        hasToken: state => !!state.token,
        token: state => state.token,
        userInfo: state => state.userInfo,
        permission: state => {
            if (!!state.token) {
                return Role[state.userInfo.role].perm
            }
            return 0
        },
        roleName: state => {
            if (!!state.token) {
                return Role[state.userInfo.role].name
            }
            return "未登录"
        },
        debug: () => true
    }
}


export default new Vuex.Store({
    state: {
        
    },
    mutations: {
        
    },
    actions: {
        
    },
    modules: {
        user: userModule,
    }
})
