import {
    createWebHistory,
    createRouter,
} from 'vue-router'
import Home from '../views/HomeView.vue'
import Gsap from '../views/GsapView.vue'
import FirstSlide from '../views/FirstSlide.vue'
import SecondSlide from '../views/SecondSlide.vue'

const routes = [
    {
        path: '/',
        name: 'FirstSlide',
        component: FirstSlide
    },
    {
        path: '/second',
        name: 'SecondSlide',
        component: SecondSlide
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
