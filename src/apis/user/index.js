import fly from '../fly'
import {Notification} from 'element-ui'

export default {

    async login(user) {
        let res = await fly.post('/users/sign-in', user)
        if (res.status === 0) {
            let user = res.data
            localStorage.setItem('session_key', user.token);
            Notification({title: '成功', message: res.msg, type: 'success'})
            return true
        } else {
            Notification({title: '错误', message: res.msg, type: 'error'})
            return false
        }
    }

}