import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '../stores'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../components/Dashboard.vue')
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('../components/EmployeeList.vue')
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: () => import('../components/Attendance.vue')
  },
  {
    path: '/leaves',
    name: 'LeaveRequests',
    component: () => import('../components/LeaveRequest.vue')
  },
  {
    path: '/payroll',
    name: 'Payroll',
    component: () => import('../components/Payroll.vue')
  },
  {
    path: '/performance',
    name: 'Performance',
    component: () => import('../components/PerformanceReviews.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Simple navigation guard: require login for all routes except /login
router.beforeEach((to, from, next) => {
  const { state } = useStore()
  if (to.path !== '/login' && !state.auth.isAuthenticated) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router