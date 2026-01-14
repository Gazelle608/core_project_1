<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header mb-4">
      <div class="header-content">
        <div class="header-icon">
          <i class="bi bi-speedometer2"></i>
        </div>
        <div>
          <h1>HR Dashboard</h1>
          <p class="header-subtitle">ModernTech Solutions HR System Overview</p>
        </div>
      </div>
      <div class="header-date">
        <i class="bi bi-calendar3 me-2"></i>
        {{ currentDate }}
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="stats-grid mb-5">
      <div class="row g-4">
        <div class="col-lg-3 col-md-6">
          <div class="stat-card employees">
            <div class="card-icon">
              <i class="bi bi-people"></i>
            </div>
            <div class="card-content">
              <div class="stat-value">{{ totalEmployees }}</div>
              <div class="stat-label">Total Employees</div>
              <div class="stat-trend">
                <i class="bi bi-arrow-up-right"></i>
                <span>+12% this month</span>
              </div>
            </div>
            <div class="card-decoration"></div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
          <div class="stat-card payroll">
            <div class="card-icon">
              <i class="bi bi-cash-stack"></i>
            </div>
            <div class="card-content">
              <div class="stat-value">R {{ totalPayroll.toLocaleString() }}</div>
              <div class="stat-label">Monthly Payroll</div>
              <div class="stat-trend">
                <i class="bi bi-arrow-up-right"></i>
                <span>On budget</span>
              </div>
            </div>
            <div class="card-decoration"></div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
          <div class="stat-card leaves">
            <div class="card-icon">
              <i class="bi bi-calendar-event"></i>
            </div>
            <div class="card-content">
              <div class="stat-value">{{ pendingLeaves }}</div>
              <div class="stat-label">Pending Leaves</div>
              <div class="stat-trend">
                <i class="bi bi-clock"></i>
                <span>Awaiting approval</span>
              </div>
            </div>
            <div class="card-decoration"></div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
          <div class="stat-card attendance">
            <div class="card-icon">
              <i class="bi bi-calendar-check"></i>
            </div>
            <div class="card-content">
              <div class="stat-value">{{ presentToday }}%</div>
              <div class="stat-label">Today's Attendance</div>
              <div class="stat-trend">
                <i class="bi bi-person-check"></i>
                <span>{{ presentCount }} present</span>
              </div>
            </div>
            <div class="card-decoration"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="charts-section mb-5">
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="chart-card">
            <div class="chart-header">
              <h3><i class="bi bi-graph-up me-2"></i>Attendance Trends (This Week)</h3>
              <span class="chart-badge">5-day view</span>
            </div>
            <div class="chart-body">
              <!-- Main Attendance Progress -->
              <div class="attendance-progress">
                <div class="progress-header">
                  <div class="progress-title">Overall Attendance Rate</div>
                  <div class="progress-value">{{ presentToday }}%</div>
                </div>
                <div class="progress-container">
                  <div 
                    class="progress-bar-main" 
                    :style="{ width: presentToday + '%' }"
                  >
                    <div class="progress-fill"></div>
                  </div>
                  <div class="progress-marker" style="left: 85%">
                    <div class="marker-tooltip">Target: 85%</div>
                  </div>
                </div>
                <div class="progress-stats">
                  <div class="stat-item">
                    <span class="stat-bullet present"></span>
                    <span>Present: {{ presentCount }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-bullet absent"></span>
                    <span>Absent: {{ absentCount }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-bullet late"></span>
                    <span>Late/Leave: {{ lateCount }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Department Breakdown -->
              <div class="department-breakdown">
                <h4><i class="bi bi-building me-2"></i>Department Attendance Today</h4>
                <div class="department-list">
                  <div 
                    v-for="dept in departmentAttendance" 
                    :key="dept.name" 
                    class="department-item"
                  >
                    <div class="dept-info">
                      <div class="dept-name">{{ dept.name }}</div>
                      <div class="dept-stats">
                        {{ dept.present }}/{{ dept.total }} employees
                      </div>
                    </div>
                    <div class="dept-progress">
                      <div class="progress-header">
                        <span class="percentage">{{ dept.percentage }}%</span>
                      </div>
                      <div class="progress-bar">
                        <div 
                          class="progress-fill" 
                          :style="{ 
                            width: dept.percentage + '%',
                            background: getDepartmentColor(dept.name)
                          }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="chart-card">
            <div class="chart-header">
              <h3><i class="bi bi-pie-chart me-2"></i>Leave Status Distribution</h3>
            </div>
            <div class="chart-body">
              <!-- Donut Chart -->
              <div class="donut-chart-container">
                <div class="donut-chart" :style="donutChartStyle">
                  <div class="donut-center">
                    <div class="donut-value">{{ totalLeaves }}</div>
                    <div class="donut-label">Total Requests</div>
                  </div>
                </div>
              </div>
              
              <!-- Legend -->
              <div class="chart-legend">
                <div 
                  v-for="item in leaveStatus.breakdown" 
                  :key="item.status" 
                  class="legend-item"
                >
                  <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                  <div class="legend-content">
                    <div class="legend-title">{{ item.status }}</div>
                    <div class="legend-stats">
                      {{ item.count }} <span class="legend-percentage">({{ item.percentage }}%)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Summary -->
              <div class="chart-summary">
                <div class="summary-item">
                  <div class="summary-icon">
                    <i class="bi bi-clock-history"></i>
                  </div>
                  <div class="summary-content">
                    <div class="summary-value">{{ pendingLeaves }}</div>
                    <div class="summary-label">Pending Review</div>
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-icon">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <div class="summary-content">
                    <div class="summary-value">{{ leaveStatus.breakdown[1].count }}</div>
                    <div class="summary-label">Approved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="activity-card">
            <div class="activity-header">
              <h3><i class="bi bi-clock-history me-2"></i>Recent Leave Requests</h3>
              <router-link to="/leaves" class="view-all-link">
                View All <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
            <div class="activity-body">
              <div v-if="recentLeaves.length === 0" class="empty-state">
                <i class="bi bi-calendar-x"></i>
                <p>No recent requests</p>
              </div>
              <div v-else class="requests-list">
                <div 
                  v-for="request in recentLeaves" 
                  :key="request.id"
                  class="request-item"
                  :class="request.status.toLowerCase()"
                >
                  <div class="request-avatar">
                    {{ getInitials(request.employeeName) }}
                  </div>
                  <div class="request-content">
                    <div class="request-header">
                      <div class="employee-name">{{ request.employeeName }}</div>
                      <div class="request-date">{{ formatDate(request.date) }}</div>
                    </div>
                    <div class="request-details">
                      <div class="request-reason">{{ request.reason }}</div>
                      <div class="request-status" :class="request.status.toLowerCase()">
                        {{ request.status }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-6">
          <div class="activity-card">
            <div class="activity-header">
              <h3><i class="bi bi-calendar-check me-2"></i>Today's Attendance Summary</h3>
            </div>
            <div class="activity-body">
              <!-- Attendance Stats -->
              <div class="attendance-summary">
                <div class="attendance-stats">
                  <div class="stat-circle present">
                    <div class="circle-value">{{ presentCount }}</div>
                    <div class="circle-label">Present</div>
                    <div class="circle-progress"></div>
                  </div>
                  <div class="stat-circle absent">
                    <div class="circle-value">{{ absentCount }}</div>
                    <div class="circle-label">Absent</div>
                    <div class="circle-progress"></div>
                  </div>
                  <div class="stat-circle late">
                    <div class="circle-value">{{ lateCount }}</div>
                    <div class="circle-label">Late/Leave</div>
                    <div class="circle-progress"></div>
                  </div>
                </div>
                
                <!-- Mini Chart -->
                <div class="mini-chart">
                  <div class="chart-title">Daily Distribution</div>
                  <div class="chart-bars">
                    <div 
                      class="chart-bar present" 
                      :style="{ height: (presentCount / totalEmployees * 100) + '%' }"
                      data-label="Present"
                    ></div>
                    <div 
                      class="chart-bar absent" 
                      :style="{ height: (absentCount / totalEmployees * 100) + '%' }"
                      data-label="Absent"
                    ></div>
                    <div 
                      class="chart-bar late" 
                      :style="{ height: (lateCount / totalEmployees * 100) + '%' }"
                      data-label="Late"
                    ></div>
                  </div>
                  <div class="chart-labels">
                    <span class="chart-label">P</span>
                    <span class="chart-label">A</span>
                    <span class="chart-label">L</span>
                  </div>
                </div>
                
                <!-- Department Breakdown -->
                <div class="attendance-breakdown">
                  <h4>Top Departments</h4>
                  <div class="breakdown-list">
                    <div 
                      v-for="dept in departmentAttendance.slice(0, 3)" 
                      :key="dept.name"
                      class="breakdown-item"
                    >
                      <div class="dept-name">{{ dept.name }}</div>
                      <div class="dept-attendance">
                        <div class="attendance-bar">
                          <div 
                            class="attendance-fill" 
                            :style="{ 
                              width: dept.percentage + '%',
                              background: getDepartmentColor(dept.name)
                            }"
                          ></div>
                        </div>
                        <span class="attendance-value">{{ dept.percentage }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
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
    currentDate() {
      return new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    },
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
      return Math.floor(this.totalEmployees * 0.85)
    },
    absentCount() {
      return Math.floor(this.totalEmployees * 0.10)
    },
    lateCount() {
      return Math.floor(this.totalEmployees * 0.05)
    },
    recentLeaves() {
      return [...this.appState.leaveRequests]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    },
    departmentAttendance() {
      const departments = {}
      
      this.appState.employees.forEach(emp => {
        if (!departments[emp.department]) {
          departments[emp.department] = {
            name: emp.department,
            total: 0,
            present: 0
          }
        }
        departments[emp.department].total++
        
        if (Math.random() < 0.85) {
          departments[emp.department].present++
        }
      })
      
      return Object.values(departments).map(dept => ({
        ...dept,
        percentage: Math.round((dept.present / dept.total) * 100)
      })).sort((a, b) => b.percentage - a.percentage).slice(0, 5)
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
    },
    donutChartStyle() {
      const total = this.totalLeaves
      const pendingPercentage = total > 0 ? (this.pendingLeaves / total) * 100 : 0
      const approvedPercentage = total > 0 ? ((this.leaveStatus.breakdown[1].count) / total) * 100 : 0
      
      return {
        background: `conic-gradient(
          #ffc107 0% ${pendingPercentage}%,
          #198754 ${pendingPercentage}% ${pendingPercentage + approvedPercentage}%,
          #dc3545 ${pendingPercentage + approvedPercentage}% 100%
        )`
      }
    }
  },
  methods: {
    getInitials(name) {
      if (!name) return '??'
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
    getDepartmentColor(department) {
      return this.departmentColors[department] || '#7f8c8d'
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  min-height: 100vh;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header-subtitle {
  color: #718096;
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
}

.header-date {
  display: flex;
  align-items: center;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
}

/* Stats Cards */
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-card.employees::before { background: linear-gradient(90deg, #667eea, #764ba2); }
.stat-card.payroll::before { background: linear-gradient(90deg, #43e97b, #38f9d7); }
.stat-card.leaves::before { background: linear-gradient(90deg, #fa709a, #fee140); }
.stat-card.attendance::before { background: linear-gradient(90deg, #4facfe, #00f2fe); }

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: white;
}

.stat-card.employees .card-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card.payroll .card-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-card.leaves .card-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-card.attendance .card-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.95rem;
  color: #718096;
  margin-bottom: 1rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #a0aec0;
}

.stat-trend i {
  color: #48bb78;
}

.card-decoration {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80px;
  height: 80px;
  opacity: 0.1;
  border-radius: 50%;
  transform: translate(20px, 20px);
}

.stat-card.employees .card-decoration { background: #667eea; }
.stat-card.payroll .card-decoration { background: #43e97b; }
.stat-card.leaves .card-decoration { background: #fa709a; }
.stat-card.attendance .card-decoration { background: #4facfe; }

/* Chart Cards */
.chart-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 100%;
}

.chart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.chart-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
}

.chart-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
}

.chart-body {
  padding: 1.5rem;
}

/* Attendance Progress */
.attendance-progress {
  margin-bottom: 2rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-title {
  font-weight: 600;
  color: #2d3748;
}

.progress-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.progress-container {
  position: relative;
  height: 40px;
  background: #e2e8f0;
  border-radius: 25px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-bar-main {
  position: relative;
  height: 100%;
  border-radius: 25px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 1s ease;
}

.progress-fill {
  /* position: absolute; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
}

.progress-marker {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background: #e53e3e;
}

.progress-marker::before {
  content: '';
  position: absolute;
  top: -6px;
  left: -4px;
  width: 10px;
  height: 10px;
  background: #e53e3e;
  border-radius: 50%;
}

.marker-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #e53e3e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.progress-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #718096;
}

.stat-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stat-bullet.present { background: #667eea; }
.stat-bullet.absent { background: #e53e3e; }
.stat-bullet.late { background: #ffc107; }

/* Department Breakdown */
.department-breakdown {
  margin-top: 2rem;
}

.department-breakdown h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
}

.department-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.department-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.dept-info {
  flex: 1;
  min-width: 150px;
}

.dept-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.dept-stats {
  font-size: 0.875rem;
  color: #718096;
}

.dept-progress {
  flex: 2;
}

.dept-progress .progress-header {
  margin-bottom: 0.5rem;
}

.dept-progress .percentage {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.dept-progress .progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.dept-progress .progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
}

/* Donut Chart */
.donut-chart-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.donut-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  position: relative;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.donut-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
}

.donut-label {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}

/* Chart Legend */
.chart-legend {
  margin: 1.5rem 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-content {
  flex: 1;
}

.legend-title {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.125rem;
}

.legend-stats {
  font-size: 0.875rem;
  color: #718096;
}

.legend-percentage {
  color: #a0aec0;
}

/* Chart Summary */
.chart-summary {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.summary-item {
  flex: 1;
  background: #f7fafc;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.summary-content {
  flex: 1;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
}

.summary-label {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}

/* Activity Cards */
.activity-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 100%;
}

.activity-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.activity-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
}

.view-all-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  color: #764ba2;
  transform: translateX(4px);
}

.activity-body {
  padding: 1.5rem;
}

/* Requests List */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #cbd5e0;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.request-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.request-item:hover {
  background: #f7fafc;
  transform: translateX(4px);
}

.request-item.pending {
  border-left: 4px solid #ffc107;
}

.request-item.approved {
  border-left: 4px solid #198754;
}

.request-item.denied {
  border-left: 4px solid #dc3545;
}

.request-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.request-content {
  flex: 1;
  min-width: 0;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.employee-name {
  font-weight: 600;
  color: #2d3748;
}

.request-date {
  font-size: 0.875rem;
  color: #718096;
}

.request-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.request-reason {
  font-size: 0.875rem;
  color: #718096;
}

.request-status {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.request-status.pending {
  background: rgba(255, 193, 7, 0.1);
  color: #d97706;
}

.request-status.approved {
  background: rgba(25, 135, 84, 0.1);
  color: #059669;
}

.request-status.denied {
  background: rgba(220, 53, 69, 0.1);
  color: #dc2626;
}

/* Attendance Summary */
.attendance-summary {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.attendance-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.stat-circle {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circle-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.circle-label {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}

.circle-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  z-index: -1;
}

.stat-circle.present .circle-progress {
  border: 6px solid #667eea;
  border-left-color: #e2e8f0;
  transform: rotate(45deg);
}

.stat-circle.absent .circle-progress {
  border: 6px solid #e53e3e;
  border-left-color: #e2e8f0;
  transform: rotate(135deg);
}

.stat-circle.late .circle-progress {
  border: 6px solid #ffc107;
  border-left-color: #e2e8f0;
  transform: rotate(225deg);
}

/* Mini Chart */
.mini-chart {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
}

.chart-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1.5rem;
  height: 100px;
  margin-bottom: 0.5rem;
}

.chart-bar {
  width: 30px;
  border-radius: 6px 6px 0 0;
  transition: height 1s ease;
  position: relative;
}

.chart-bar::before {
  content: attr(data-label);
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: #718096;
  white-space: nowrap;
}

.chart-bar.present {
  background: linear-gradient(to top, #667eea, #764ba2);
}

.chart-bar.absent {
  background: linear-gradient(to top, #e53e3e, #f56565);
}

.chart-bar.late {
  background: linear-gradient(to top, #ffc107, #f6ad55);
}

.chart-labels {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.chart-label {
  width: 30px;
  text-align: center;
  font-size: 0.875rem;
  color: #718096;
  font-weight: 600;
}

/* Attendance Breakdown */
.attendance-breakdown {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
}

.attendance-breakdown h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dept-name {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.875rem;
}

.dept-attendance {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 200px;
}

.attendance-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.attendance-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

.attendance-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 40px;
  text-align: right;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .header-icon {
    margin: 0 auto;
  }
}

@media (max-width: 992px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .attendance-stats {
    flex-wrap: wrap;
  }
  
  .stat-circle {
    flex: 1;
    min-width: 100px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .progress-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .chart-summary {
    flex-direction: column;
  }
  
  .department-item {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .dept-info {
    min-width: auto;
    width: 100%;
  }
}
</style>