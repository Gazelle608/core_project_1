<template>
  <div>
    <h2>HR Dashboard</h2>
    <p class="text-muted">ModernTech Solutions HR System Overview</p>
    
    <!-- Stats Cards - Consistent coloring -->
    <div class="row mt-4">
      <div class="col-md-3">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-primary mb-2">
              <i class="bi bi-people display-6"></i>
            </div>
            <h5 class="card-title text-muted">Employees</h5>
            <h2 class="mb-0">{{ totalEmployees }}</h2>
            <p class="card-text small mt-2 text-muted">Active staff</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-success mb-2">
              <i class="bi bi-cash-stack display-6"></i>
            </div>
            <h5 class="card-title text-muted">Payroll</h5>
            <h2 class="mb-0">R {{ totalPayroll.toLocaleString() }}</h2>
            <p class="card-text small mt-2 text-muted">Monthly total</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-info mb-2">
              <i class="bi bi-calendar-event display-6"></i>
            </div>
            <h5 class="card-title text-muted">Pending Leaves</h5>
            <h2 class="mb-0">{{ pendingLeaves }}</h2>
            <p class="card-text small mt-2 text-muted">Awaiting approval</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-warning mb-2">
              <i class="bi bi-calendar-check display-6"></i>
            </div>
            <h5 class="card-title text-muted">Attendance</h5>
            <h2 class="mb-0">{{ presentToday }}%</h2>
            <p class="card-text small mt-2 text-muted">{{ presentCount }} present</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Simple Chart/Graph Visualization -->
    <div class="row mt-4">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Attendance Trends (This Week)</h5>
            <span class="badge bg-primary">5-day view</span>
          </div>
          <div class="card-body">
            <!-- Simple bar chart using Bootstrap progress bars -->
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small text-muted">Attendance Rate</span>
                <span class="small text-muted">{{ presentToday }}%</span>
              </div>
              <div class="progress" style="height: 25px;">
                <div 
                  class="progress-bar bg-success" 
                  :style="{ width: presentToday + '%' }"
                >
                  <span class="position-absolute w-100 text-center text-white fw-bold">{{ presentToday }}%</span>
                </div>
              </div>
            </div>
            
            <!-- Department attendance breakdown -->
            <h6 class="mb-3">Department Attendance Today</h6>
            <div v-for="dept in departmentAttendance" :key="dept.name" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small">{{ dept.name }}</span>
                <span class="small">{{ dept.present }}/{{ dept.total }} ({{ dept.percentage }}%)</span>
              </div>
              <div class="progress" style="height: 10px;">
                <div 
                  class="progress-bar" 
                  :style="{ 
                    width: dept.percentage + '%',
                    backgroundColor: getDepartmentColor(dept.name)
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-header bg-light">
            <h5 class="mb-0">Leave Status Distribution</h5>
          </div>
          <div class="card-body">
            <!-- Simple pie chart using CSS circles -->
            <div class="text-center mb-4">
              <div class="position-relative d-inline-block">
                <!-- Pending -->
                <div class="pie-slice" 
                     :style="{
                       '--percentage': leaveStatus.pendingPercentage + '%',
                       '--color': '#ffc107',
                       '--rotation': '0deg'
                     }">
                </div>
                <!-- Approved -->
                <div class="pie-slice" 
                     :style="{
                       '--percentage': leaveStatus.approvedPercentage + '%',
                       '--color': '#198754',
                       '--rotation': (leaveStatus.pendingPercentage * 3.6) + 'deg'
                     }">
                </div>
                <!-- Denied -->
                <div class="pie-slice" 
                     :style="{
                       '--percentage': leaveStatus.deniedPercentage + '%',
                       '--color': '#dc3545',
                       '--rotation': ((leaveStatus.pendingPercentage + leaveStatus.approvedPercentage) * 3.6) + 'deg'
                     }">
                </div>
                <div class="pie-center">
                  <div class="h4 mb-0">{{ totalLeaves }}</div>
                  <div class="small text-muted">Total</div>
                </div>
              </div>
            </div>
            
            <!-- Legend -->
            <div class="mt-3">
              <div v-for="item in leaveStatus.breakdown" :key="item.status" class="d-flex align-items-center mb-2">
                <div class="color-indicator me-2" :style="{ backgroundColor: item.color }"></div>
                <div class="flex-grow-1">
                  <span class="small">{{ item.status }}</span>
                </div>
                <div class="text-muted small">{{ item.count }} ({{ item.percentage }}%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity - Simple lists -->
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-light">
            <h5 class="mb-0">Recent Leave Requests</h5>
          </div>
          <div class="card-body">
            <div v-if="recentLeaves.length === 0" class="text-center py-2">
              <p class="text-muted">No recent requests</p>
            </div>
            <div v-else>
              <div 
                v-for="request in recentLeaves" 
                :key="request.id"
                class="border-bottom py-2"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <strong>{{ request.employeeName }}</strong>
                    <div class="text-muted small">{{ request.reason }}</div>
                  </div>
                  <span class="badge" :class="getStatusBadgeClass(request.status)">
                    {{ request.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-light">
            <h5 class="mb-0">Today's Attendance Summary</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-4">
                <div class="text-success h4">{{ presentCount }}</div>
                <div class="text-muted small">Present</div>
              </div>
              <div class="col-4">
                <div class="text-danger h4">{{ absentCount }}</div>
                <div class="text-muted small">Absent</div>
              </div>
              <div class="col-4">
                <div class="text-warning h4">{{ lateCount }}</div>
                <div class="text-muted small">Leave/Late</div>
              </div>
            </div>
            
            <!-- Quick mini-chart -->
            <div class="mt-3">
              <div class="d-flex" style="height: 40px;">
                <div class="bg-success flex-grow-1" :style="{ flex: presentCount }"></div>
                <div class="bg-danger flex-grow-1" :style="{ flex: absentCount }"></div>
                <div class="bg-warning flex-grow-1" :style="{ flex: lateCount }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  inject: ['appState'],
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
      return this.appState.employees.length
    },
    totalPayroll() {
      return this.appState.payroll.reduce((sum, p) => sum + (p.finalSalary || 0), 0)
    },
    pendingLeaves() {
      return this.appState.leaveRequests.filter(req => req.status === 'Pending').length
    },
    presentToday() {
      if (this.appState.attendance.length === 0) return 0
      const totalEmployees = this.appState.employees.length
      return totalEmployees > 0 ? Math.round((this.presentCount / totalEmployees) * 100) : 0
    },
    presentCount() {
      // Simplified logic for demo
      return Math.floor(this.totalEmployees * 0.85) // 85% attendance for demo
    },
    absentCount() {
      return Math.floor(this.totalEmployees * 0.10) // 10% absent for demo
    },
    lateCount() {
      return Math.floor(this.totalEmployees * 0.05) // 5% late/leave for demo
    },
    recentLeaves() {
      return [...this.appState.leaveRequests]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
    },
    departmentAttendance() {
      const departments = {}
      
      // Count employees per department
      this.appState.employees.forEach(emp => {
        if (!departments[emp.department]) {
          departments[emp.department] = {
            name: emp.department,
            total: 0,
            present: 0
          }
        }
        departments[emp.department].total++
        
        // For demo: 85% attendance rate per department
        if (Math.random() < 0.85) {
          departments[emp.department].present++
        }
      })
      
      // Convert to array and calculate percentages
      return Object.values(departments).map(dept => ({
        ...dept,
        percentage: Math.round((dept.present / dept.total) * 100)
      })).slice(0, 5) // Show top 5 departments
    },
    leaveStatus() {
      const total = this.appState.leaveRequests.length
      const pending = this.appState.leaveRequests.filter(req => req.status === 'Pending').length
      const approved = this.appState.leaveRequests.filter(req => req.status === 'Approved').length
      const denied = this.appState.leaveRequests.filter(req => req.status === 'Denied').length
      
      return {
        pendingPercentage: total > 0 ? Math.round((pending / total) * 100) : 0,
        approvedPercentage: total > 0 ? Math.round((approved / total) * 100) : 0,
        deniedPercentage: total > 0 ? Math.round((denied / total) * 100) : 0,
        breakdown: [
          { status: 'Pending', count: pending, color: '#ffc107', percentage: total > 0 ? Math.round((pending / total) * 100) : 0 },
          { status: 'Approved', count: approved, color: '#198754', percentage: total > 0 ? Math.round((approved / total) * 100) : 0 },
          { status: 'Denied', count: denied, color: '#dc3545', percentage: total > 0 ? Math.round((denied / total) * 100) : 0 }
        ]
      }
    },
    totalLeaves() {
      return this.appState.leaveRequests.length
    }
  },
  methods: {
    getStatusBadgeClass(status) {
      switch(status) {
        case 'Pending': return 'bg-warning'
        case 'Approved': return 'bg-success'
        case 'Denied': return 'bg-danger'
        default: return 'bg-secondary'
      }
    },
    getDepartmentColor(department) {
      return this.departmentColors[department] || '#7f8c8d'
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.08);
}

.card-header {
  background-color: white;
  border-bottom: 1px solid #eef2f7;
}

/* Simple pie chart styling */
.pie-slice {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: absolute;
  clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0);
  background: conic-gradient(
    var(--color) 0% var(--percentage),
    transparent var(--percentage) 100%
  );
  transform: rotate(var(--rotation));
}

.position-relative {
  position: relative;
  width: 120px;
  height: 120px;
}

.d-inline-block {
  display: inline-block;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>