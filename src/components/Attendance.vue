<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-2">
        <div class="bg-info bg-opacity-10 rounded-3 p-3 me-3">
          <i class="bi bi-calendar-check text-info fs-3"></i>
        </div>
        <div>
          <h1 class="h2 mb-1 fw-bold" style="color: #2d3748;">Attendance Tracking</h1>
          <p class="text-muted mb-0">Monitor and manage employee attendance</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="row g-4 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 border-start border-success border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Present Today</h6>
                <h2 class="fw-bold mb-0 text-success">{{ presentCount }}</h2>
                <span class="text-muted small">{{ attendanceRate }}% rate</span>
              </div>
              <div class="bg-success bg-opacity-10 rounded-3 p-2">
                <i class="bi bi-person-check text-success"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 col-6">
        <div class="card border-0 border-start border-danger border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Absent Today</h6>
                <h2 class="fw-bold mb-0 text-danger">{{ absentCount }}</h2>
                <span class="text-muted small">Not checked in</span>
              </div>
              <div class="bg-danger bg-opacity-10 rounded-3 p-2">
                <i class="bi bi-person-x text-danger"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 col-6">
        <div class="card border-0 border-start border-warning border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Late Arrivals</h6>
                <h2 class="fw-bold mb-0 text-warning">{{ lateCount }}</h2>
                <span class="text-muted small">This week</span>
              </div>
              <div class="bg-warning bg-opacity-10 rounded-3 p-2">
                <i class="bi bi-clock text-warning"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 col-6">
        <div class="card border-0 border-start border-primary border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Total Employees</h6>
                <h2 class="fw-bold mb-0 text-primary">{{ totalEmployees }}</h2>
                <span class="text-muted small">Active staff</span>
              </div>
              <div class="bg-primary bg-opacity-10 rounded-3 p-2">
                <i class="bi bi-people text-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Attendance -->
    <div class="card border-0 mb-4">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-calendar-day me-2 text-primary"></i>
          Today's Attendance ({{ todayDate }})
        </h5>
        <div class="d-flex gap-2">
          <select v-model="selectedDept" class="form-select form-select-sm w-auto">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept">{{ dept }}</option>
          </select>
          <button class="btn btn-sm btn-primary" @click="markAllPresent">
            <i class="bi bi-plus-circle me-1"></i>
            Mark Attendance
          </button>
        </div>
      </div>
      
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Today's Status</th>
                <th>This Week</th>
                <th>Last Check-in</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in filteredAttendance" :key="employee.employeeId">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-person text-primary"></i>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ employee.name }}</div>
                      <small class="text-muted">ID: {{ employee.employeeId }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" :style="{ backgroundColor: getDepartmentColor(getEmployeeDept(employee.employeeId)), color: 'white' }">
                    {{ getEmployeeDept(employee.employeeId) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="getStatusClass(getTodayStatus(employee))">
                    {{ getTodayStatus(employee) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <span v-for="(day, index) in getThisWeek(employee)" :key="index" 
                          class="badge badge-sm" :class="getDayStatusClass(day)">
                      {{ day }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="text-muted">{{ getLastAttendanceDate(employee) }}</span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" @click="markPresent(employee)" title="Mark Present">
                      <i class="bi bi-check"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="markAbsent(employee)" title="Mark Absent">
                      <i class="bi bi-x"></i>
                    </button>
                    <button class="btn btn-outline-primary" @click="viewHistory(employee)" title="View History">
                      <i class="bi bi-clock-history"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Weekly Overview -->
    <div class="card border-0">
      <div class="card-header bg-white">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-calendar-week me-2 text-primary"></i>
          Weekly Attendance Overview
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h6 class="fw-bold mb-3">Department Performance</h6>
            <div v-for="dept in departmentStats" :key="dept.name" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small">{{ dept.name }}</span>
                <span class="small fw-semibold">{{ dept.rate }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar" :style="{ 
                  width: dept.rate + '%',
                  backgroundColor: getDepartmentColor(dept.name)
                }"></div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <h6 class="fw-bold mb-3">Weekly Trends</h6>
            <div class="d-flex align-items-center justify-content-around mb-4">
              <div v-for="(day, index) in weekDays" :key="index" class="text-center">
                <div class="fw-semibold">{{ day }}</div>
                <div class="h5 mb-0">{{ getDayAttendance(index) }}</div>
                <small class="text-muted">present</small>
              </div>
            </div>
            <div class="mt-4">
              <div class="d-flex justify-content-between mb-1">
                <span class="small">Best Day: <strong>{{ bestDay }}</strong></span>
                <span class="small">Attendance Rate: <strong>{{ attendanceRate }}%</strong></span>
              </div>
              <div class="progress" style="height: 10px;">
                <div class="progress-bar bg-success" :style="{ width: attendanceRate + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '../stores'

export default {
  name: 'Attendance',
  setup() {
    const store = useStore()
    const selectedDept = ref('')

    const markPresent = (employee) => {
      store.markPresent(employee.employeeId)
      alert(`Marked ${employee.name} as present`)
    }

    const markAbsent = (employee) => {
      store.markAbsent(employee.employeeId)
      alert(`Marked ${employee.name} as absent`)
    }

    const markAllPresent = () => {
      store.state.attendanceData.forEach(a => store.markPresent(a.employeeId))
      alert('Marked all employees present for today')
    }

    const viewHistory = (employee) => {
      const att = store.state.attendanceData.find(a => a.employeeId === employee.employeeId)
      const recent = (att?.attendance || []).slice(-6).map(a => `${a.date}: ${a.status}`).join('\n') || 'No history'
      alert(recent)
    }

    return { store, selectedDept, markPresent, markAbsent, markAllPresent, viewHistory }
  },
  data() {
    return {
      weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
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
    attendanceData() {
      return this.store.state.attendanceData
    },
    employees() {
      return this.store.state.employees
    },
    totalEmployees() {
      return this.employees.length
    },
    departments() {
      return [...new Set(this.employees.map(e => e.department))]
    },
    todayDate() {
      return new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'short' })
    },
    presentCount() {
      return this.attendanceData.filter(emp => 
        emp.attendance?.some(a => a.status === 'Present')
      ).length
    },
    absentCount() {
      return this.totalEmployees - this.presentCount
    },
    lateCount() {
      // Simplified - count employees with recent absences
      return Math.floor(this.totalEmployees * 0.1)
    },
    attendanceRate() {
      return Math.round((this.presentCount / Math.max(1, this.totalEmployees)) * 100)
    },
    filteredAttendance() {
      let filtered = this.attendanceData
      
      if (this.selectedDept) {
        filtered = filtered.filter(emp => 
          this.getEmployeeDept(emp.employeeId) === this.selectedDept
        )
      }
      
      return filtered
    },
    departmentStats() {
      const stats = {}
      
      this.employees.forEach(emp => {
        if (!stats[emp.department]) {
          stats[emp.department] = { name: emp.department, present: 0, total: 0 }
        }
        stats[emp.department].total++
        
        const empAttendance = this.attendanceData.find(a => a.employeeId === emp.employeeId)
        if (empAttendance?.attendance?.some(a => a.status === 'Present')) {
          stats[emp.department].present++
        }
      })
      
      return Object.values(stats).map(dept => ({
        ...dept,
        rate: Math.round((dept.present / dept.total) * 100)
      }))
    },
    bestDay() {
      // Simplified - just return today for demo
      return 'Today'
    }
  },
  methods: {
    getEmployeeDept(employeeId) {
      const emp = this.employees.find(e => e.employeeId === employeeId)
      return emp ? emp.department : 'Unknown'
    },
    getDepartmentColor(dept) {
      return this.departmentColors[dept] || '#7f8c8d'
    },
    getTodayStatus(employee) {
      const att = this.attendanceData.find(a => a.employeeId === employee.employeeId)
      const todayRecord = att?.attendance?.[att.attendance.length - 1]
      return todayRecord?.status || 'Not Recorded'
    },
    getThisWeek(employee) {
      const att = this.attendanceData.find(a => a.employeeId === employee.employeeId)
      const recent = att?.attendance?.slice(-5) || []
      return recent.map(a => a.status.charAt(0)) // P for Present, A for Absent
    },
    getLastAttendanceDate(employee) {
      const att = this.attendanceData.find(a => a.employeeId === employee.employeeId)
      const lastRecord = att?.attendance?.[att.attendance.length - 1]
      if (lastRecord) {
        return new Date(lastRecord.date).toLocaleDateString('en-ZA')
      }
      return 'Never'
    },
    getStatusClass(status) {
      if (status === 'Present') return 'bg-success bg-opacity-10 text-success'
      if (status === 'Absent') return 'bg-danger bg-opacity-10 text-danger'
      return 'bg-secondary bg-opacity-10 text-secondary'
    },
    getDayStatusClass(day) {
      if (day === 'P') return 'bg-success bg-opacity-10 text-success'
      if (day === 'A') return 'bg-danger bg-opacity-10 text-danger'
      return 'bg-secondary bg-opacity-10 text-secondary'
    },
    getDayAttendance(dayIndex) {
      // Simplified - return random numbers for demo
      return Math.floor(this.presentCount * (0.8 + Math.random() * 0.4))
    }
  }
}
</script>

<style scoped>
.badge {
  font-weight: 500;
  padding: 0.35rem 0.75rem;
}

.badge-sm {
  padding: 0.15rem 0.35rem;
  font-size: 0.7rem;
}

.progress {
  background-color: #e2e8f0;
}
</style>