import fly from '../fly'
import {Notification} from 'element-ui'

export default {

    async execSecKill(order) {
        if (order.orderDetails.length > 0) {
            let res = await fly.post('/orders', order)
            if (res.status === 0) {
                Notification.success({title: '成功', message: res.msg})
                return true
            }
        } else {
            Notification.error({title: '错误', message: '购物车为空'})
            return false
        }
    }

}