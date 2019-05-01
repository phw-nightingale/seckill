import VueRouter from "vue-router";
import Login from '../views/login'
import Index from '../views/index'

const router = new VueRouter({
    routes: [
        {path: '/login', name: 'login', component: Login},
        {path: '/', name: 'index', component: Index}
    ]
})

export default router