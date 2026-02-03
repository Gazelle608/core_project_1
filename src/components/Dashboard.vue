<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-2">
        <div class="bg-primary bg-gradient rounded-3 p-3 me-3">
          <i class="bi bi-speedometer2 text-white fs-3"></i>
        </div>
        <div>
          <h1 class="h2 mb-1 fw-bold" style="color: #2d3748;">HR Dashboard</h1>
          <p class="text-muted mb-0">ModernTech Solutions HR System Overview</p>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div class="col-xl-3 col-md-6">
        <div class="card border-0 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Total Employees</h6>
                <h2 class="fw-bold mb-0">{{ totalEmployees }}</h2>
                <span class="text-success small">
                  <i class="bi bi-arrow-up"></i> 12% this month
                </span>
              </div>
              <div class="bg-primary bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-people fs-4 text-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="card border-0 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Monthly Payroll</h6>
                <h2 class="fw-bold mb-0">R {{ totalPayroll.toLocaleString() }}</h2>
                <span class="text-success small">
                  <i class="bi bi-check-circle"></i> On budget
                </span>
              </div>
              <div class="bg-success bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-cash-stack fs-4 text-success"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="card border-0 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Pending Leaves</h6>
                <h2 class="fw-bold mb-0">{{ pendingLeaves }}</h2>
                <span class="text-warning small">
                  <i class="bi bi-clock-history"></i> Awaiting approval
                </span>
              </div>
              <div class="bg-warning bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-calendar-event fs-4 text-warning"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="card border-0 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Attendance Today</h6>
                <h2 class="fw-bold mb-0">{{ attendanceRate }}%</h2>
                <span class="text-success small">
                  <i class="bi bi-person-check"></i> {{ presentCount }} present
                </span>
              </div>
              <div class="bg-info bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-calendar-check fs-4 text-info"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Tables -->
    <div class="row g-4">
      <!-- Leave Requests -->
      <div class="col-lg-6">
        <div class="card border-0 h-100">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-calendar-event me-2 text-primary"></i>
              Recent Leave Requests
            </h5>
            <router-link to="/leaves" class="btn btn-sm btn-outline-primary">
              View All
            </router-link>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="request in recentLeaves" :key="request.date">
                    <td class="fw-semibold">{{ request.employeeName }}</td>
                    <td>{{ formatDate(request.date) }}</td>
                    <td>
                      <span class="badge" :class="getReasonClass(request.reason)">
                        {{ request.reason }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="getStatusClass(request.status)">
                        {{ request.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Overview -->
      <div class="col-lg-6">
        <div class="card border-0 h-100">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-graph-up me-2 text-primary"></i>
              Top Performers
            </h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Score</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="perf in topPerformers" :key="perf.employeeId">
                    <td class="fw-semibold">{{ perf.name }}</td>
                    <td>
                      <span class="badge" :style="{ backgroundColor: getDepartmentColor(perf.department), color: 'white' }">
                        {{ perf.department }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="progress flex-grow-1 me-2" style="height: 8px;">
                          <div class="progress-bar" :class="getScoreClass(perf.performanceScore)" 
                               :style="{ width: perf.performanceScore + '%' }"></div>
                        </div>
                        <span class="fw-semibold">{{ perf.performanceScore }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge" :class="getRatingClass(perf.rating)">
                        {{ perf.rating }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()
    return { store }
  },
  data() {
    return {
      departmentColors: {
        'Development': '#3498db',
        'HR': '#9b59b6',
        'QA': '#2ecc71',
        'Sales': '#e74c3c',
        'Marketing': '#f39c12',
        'Design': '#1abc9c',
        'IT': '#34495e',
        'Finance': '#27ae60',
        'Support': '#95a5a6'
      }
    }
  },
  computed: {
    totalEmployees() {
      return this.store.state.employees.length
    },
    totalPayroll() {
      return this.store.state.payrollData.reduce((sum, p) => sum + (p.finalSalary || 0), 0)
    },
    pendingLeaves() {
      return this.store.state.leaveRequests.filter(req => req.status === 'Pending').length
    },
    attendanceRate() {
      const allAttendance = this.store.state.attendanceData
      const totalDays = allAttendance.reduce((sum, emp) => sum + (emp.attendance?.length || 0), 0)
      const presentDays = allAttendance.reduce((sum, emp) => {
        const present = emp.attendance?.filter(a => a.status === 'Present').length || 0
        return sum + present
      }, 0)
      return totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
    },
    presentCount() {
      const allAttendance = this.store.state.attendanceData
      return allAttendance.reduce((sum, emp) => {
        const today = emp.attendance?.[emp.attendance.length - 1]
        return sum + (today?.status === 'Present' ? 1 : 0)
      }, 0)
    },
    recentLeaves() {
      return this.store.state.leaveRequests
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    },
    topPerformers() {
      // Reuse performance calculation from DataService via store.state.employees for demo
      return this.store.state.employees.map(e => ({
        employeeId: e.employeeId,
        name: e.name,
        department: e.department,
        performanceScore: Math.floor(Math.random() * 41) + 60,
        rating: 'Average'
      })).sort((a, b) => b.performanceScore - a.performanceScore).slice(0,5)
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-ZA')
    },
    getReasonClass(reason) {
      if (reason.includes('Sick') || reason.includes('Medical')) return 'bg-danger bg-opacity-10 text-danger'
      if (reason.includes('Vacation')) return 'bg-success bg-opacity-10 text-success'
      if (reason.includes('Personal') || reason.includes('Family') || reason.includes('Childcare')) return 'bg-warning bg-opacity-10 text-warning'
      if (reason.includes('Bereavement')) return 'bg-dark bg-opacity-10 text-dark'
      return 'bg-secondary bg-opacity-10 text-secondary'
    },
    getStatusClass(status) {
      if (status === 'Approved') return 'bg-success bg-opacity-10 text-success'
      if (status === 'Pending') return 'bg-warning bg-opacity-10 text-warning'
      return 'bg-danger bg-opacity-10 text-danger'
    },
    getDepartmentColor(dept) {
      return this.departmentColors[dept] || '#7f8c8d'
    },
    getScoreClass(score) {
      if (score >= 90) return 'bg-success'
      if (score >= 80) return 'bg-primary'
      if (score >= 70) return 'bg-warning'
      return 'bg-danger'
    },
    getRatingClass(rating) {
      if (rating === 'Excellent') return 'bg-success bg-opacity-10 text-success'
      if (rating === 'Good') return 'bg-primary bg-opacity-10 text-primary'
      if (rating === 'Average') return 'bg-warning bg-opacity-10 text-warning'
      return 'bg-danger bg-opacity-10 text-danger'
    }
  }
}
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>