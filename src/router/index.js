import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import EmployeeList from '../components/EmployeeList.vue'
import Payroll from '../components/Payroll.vue'
// import Attendance from '../components/Attendance.vue'
import LeaveRequests from '../components/LeaveRequest.vue'
import PerformanceReviews from '../components/PerformanceReviews.vue'
/* eslint-disablex   */

const routes = [
  { path: '/', component: Dashboard },
  { path: '/employees', component: EmployeeList },
  { path: '/payroll', component: Payroll },
  // { path: '/attendance', component: Attendance },
  { path: '/leaves', component: LeaveRequests },
  { path: '/performance', component: PerformanceReviews }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router