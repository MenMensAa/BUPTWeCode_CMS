import axios from './index.js'
import qs from 'qs'

let post = function(url, data, json=false) {
    if (json) {
        return axios({
            method: "post",
            url: url,
            headers: {
                'Content-Type':'application/json',
            },
            data: data
        })
    }
    else {
       return axios({
           method: 'post',
           url: url,
           headers: {
               'Content-Type':'application/x-www-form-urlencoded',
           },
           data: data,
           transformRequest: [data => qs.stringify(data)]
       }) 
    }
}

let get = function(url, data) {
    return axios({
        method: 'get',
        url: url,
        params: data
    })
}

// 视图专用函数
export function get_feedback(data) {
    return get('/cms/block/feedback/', data)
}

export function get_report(data) {
    return post('/cms/block/report/', data)
}

export function get_cms_user(data) {
    return get('/cms/manage/cms_user/', data)
}

export function post_cms_user(data) {
    return post('/cms/manage/cms_user/', data)
}

export function get_article(data) {
    return get('/cms/manage/article/', data)
}

export function post_article(data) {
    return post('/cms/manage/article/', data)
}

export function get_front_user(data) {
    return get('/cms/manage/front_user/', data)
}

export function post_front_user(data) {
    return post('/cms/manage/front_user/', data)
}

export function get_operator(data) {
    return get('/cms/manage/operator/', data)
}

export function post_operator(data) {
    return post('/cms/manage/operator/', data)
}

export function post_me_login(data) {
    return post('/cms/user/login/', data)
}

export function get_me_login() {
    return get('/cms/user/login/')
}

export function post_me_profile(data) {
    return post('/cms/user/profile/', data)
}

export function get_board_board(data) {
    return get('/cms/manage/board/', data)
}

export function post_board_board(data) {
    return post('/cms/manage/board/', data)
}

export function get_imageUploader() {
    return get('/cms/common/image/')
}
