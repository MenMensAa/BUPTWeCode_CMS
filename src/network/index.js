import originAxios from 'axios'
import qs from 'qs'
import router from '@/router/index.js'
import store from '@/store/index.js'
import { MessageBox } from 'element-ui'
import { codes } from '@/common/cnst.js'

export default function axios(options) {
    return new Promise((resolve, reject) => {
        const instance = originAxios.create({
            // baseURL: 'https://www.buptwecode.com',
            // baseURL: 'https://test.buptwecode.com',
            baseURL: "http://localhost:5000",
            timeout: 60000,
            xhrFields: {                        
                withCredentials: true                    
            }
        });
        
        // 请求拦截器
        instance.interceptors.request.use(config => {
                if (store.getters.hasToken) {
                    config.headers["Z-Token"] = store.getters.token
                }
                return config
            }, err => {
                return Promise.reject(err)
            })
        
        instance.interceptors.response.use(response => {
                const res = response.data
                let msg = null
                switch(res.code) {
                    case codes.OK:
                        return res
                    case codes.TOKEN_ERROR:
                        msg = res.message
                        break
                    default:
                        return Promise.reject(res)
                }
                if (store.getters.hasToken) {
                    MessageBox.alert(msg, "提示", {
                        confirmButtonText: 'Sign In',
                        callback: action => {
                            store.commit('clearAuth')
                            if (router.currentRoute.name !== 'login') {
                                router.replace({name: 'login'})
                            }
                        }
                    })
                }
                return Promise.reject(res)
            }, err => {
                console.log('请求出现错误');
                return Promise.reject(err)
            })
        
        //网络请求部分
        instance(options).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
        
    })
}