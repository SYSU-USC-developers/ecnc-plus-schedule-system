import { createWebHistory, createRouter } from 'vue-router';
import ScheduleTableSubmit from '../views/ScheduleTableSubmit.vue';
import Schedule from '../views/Schedule.vue'

const routes = [
    {
        path: "/scheduleTableSubmit",
        component: ScheduleTableSubmit
    },
    {
        path: "/schedule",
        component: Schedule
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;