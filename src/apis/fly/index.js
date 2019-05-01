import fly from 'flyio'
import { Loading } from "element-ui"
import { Notification } from "element-ui";

const host = 'http://four-road-titans.xyz:8081'

fly.config.baseURL = host
fly.config.timeout = 5000
let loaderIndex;

/**
 * 请求拦截器
 */
fly.interceptors.request.use(request => {
    loaderIndex = Loading.service({fullscreen: true})

    console.log(request)

    if (request.body) {
        request.body = JSON.stringify(request.body)
    }

    //添加token...
    let token = localStorage.getItem('session_key')
    if (token) {
        request.headers = {
            Authorization: token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    } else {
        request.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }

    return request
})

/**
 * 响应拦截器
 */
fly.interceptors.response.use(
    response => {

        loaderIndex.close()
        if (response.data.status === 401) {
            //跳转到登录页
            this.$router.push('/login')
        } else if (response.data.status !== 0) {
            Notification.error({title: '错误', message: response.data.msg})
        } else if (response.data.status === 0) {
            return response.data
        }
        return response.data
    }, err => {
        console.error(err)
        loaderIndex.close()
        return '请求服务器失败'
    })

export default fly;
