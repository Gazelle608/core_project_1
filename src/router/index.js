import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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

export default router