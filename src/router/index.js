import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store/index.js'

Vue.use(VueRouter)

const routes = [
    {
        path: '/manage',
        name: 'manage',
        component: () => import('@/views/Manage.vue'),
        meta: {
            title: '管理',
            loginRequired: true
        }
    },
    {
        path: '/block',
        name: 'block',
        component: () => import('@/views/Block.vue'),
        meta: {
            title: '小黑屋',
            loginRequired: true
        }
    },
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Profile.vue'),
        meta: {
            title: '我的',
            loginRequired: true
        }
    },
    {
          path: '/login',
          name: 'login',
          component: () => import('@/views/Login.vue'),
          meta: {
              title: '登陆',
          }
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    if (to.meta.loginRequired) {
        if (store.getters.hasToken) {
            next()
        } else {
            next({ path: '/login' })
        }
    } else if (store.getters.hasToken){
        next({ path: '/' })
    } else {
        next()
    }
})

export default router
