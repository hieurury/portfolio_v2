import {
    createWebHistory,
    createRouter,
} from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
//views
import Home from '../views/HomeView.vue'
import Gsap from '../views/GsapView.vue'
import Overview from '../views/Overview.vue'
import Timeline from '../views/Timeline.vue'
import Experience from '../views/Experience.vue'

const routes = [
    {
        path: '/',
        name: 'Slides',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'overview',
                component: Overview
            },
            {
                path: 'timeline',
                name: 'timeline',
                component: Timeline
            },
            {
                path: 'experience',
                name: 'experience',
                component: Experience
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
