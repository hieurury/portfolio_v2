import {
    createWebHistory,
    createRouter,
} from 'vue-router'
import Home from '../views/HomeView.vue'
import Gsap from '../views/GsapView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/gsap',
        name: 'Gsap',
        component: Gsap
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
