<template>
  <div class="leave-management-container">
    <!-- Header -->
    <div class="page-header mb-4">
      <div class="d-flex align-items-center">
        <div class="header-icon me-3">
          <i class="bi bi-calendar-event"></i>
        </div>
        <div>
          <h1>Leave Request Management</h1>
          <p class="page-subtitle">Digital system for time off requests and approvals</p>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/attendance" class="attendance-link">
          <i class="bi bi-calendar-check me-2"></i>
          View Attendance
        </router-link>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="stats-row mb-5">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="stat-card pending">
            <div class="stat-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ pendingRequests.length }}</div>
              <div class="stat-label">Pending Requests</div>
              <div class="stat-detail">
                <span class="stat-percentage">{{ requestStats[0].percentage }}%</span>
                <span class="stat-info">of total</span>
              </div>
            </div>
            <div class="stat-badge">
              <span class="badge">Awaiting approval</span>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="stat-card approved">
            <div class="stat-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ approvedRequests.length }}</div>
              <div class="stat-label">Approved</div>
              <div class="stat-detail">
                <span class="stat-percentage">{{ requestStats[1].percentage }}%</span>
                <span class="stat-info">of total</span>
              </div>
            </div>
            <div class="stat-badge">
              <span class="badge">Time off granted</span>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="stat-card denied">
            <div class="stat-icon">
              <i class="bi bi-x-circle"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ deniedRequests.length }}</div>
              <div class="stat-label">Denied</div>
              <div class="stat-detail">
                <span class="stat-percentage">{{ requestStats[2].percentage }}%</span>
                <span class="stat-info">of total</span>
              </div>
            </div>
            <div class="stat-badge">
              <span class="badge">Requests declined</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- New Request Section -->
    <div v-if="showNewForm" class="new-request-card mb-5">
      <div class="card-header modern-card-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-plus-circle me-3"></i>
          <h3>Submit New Leave Request</h3>
        </div>
        <button class="close-btn" @click="showNewForm = false">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4 mb-4">
            <label class="form-label modern-label">Employee</label>
            <div class="form-group">
              <i class="bi bi-person form-icon"></i>
              <select class="form-control modern-select" v-model="newRequest.employeeId">
                <option value="">Select Employee</option>
                <option v-for="emp in employees" :key="emp.employeeId" :value="emp.employeeId">
                  {{ emp.name }} ({{ emp.department }})
                </option>
              </select>
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <label class="form-label modern-label">Leave Date</label>
            <div class="form-group">
              <i class="bi bi-calendar form-icon"></i>
              <input type="date" class="form-control modern-input" v-model="newRequest.date">
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <label class="form-label modern-label">Reason</label>
            <div class="form-group">
              <i class="bi bi-card-text form-icon"></i>
              <select class="form-control modern-select" v-model="newRequest.reason">
                <option value="">Select Reason</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Vacation">Vacation</option>
                <option value="Personal">Personal</option>
                <option value="Bereavement">Bereavement</option>
                <option value="Maternity">Maternity</option>
                <option value="Childcare">Childcare</option>
              </select>
            </div>
          </div>
          
          <div class="col-12">
            <div class="form-actions">
              <button class="submit-btn" @click="submitRequest">
                <i class="bi bi-send me-2"></i>
                Submit Request
              </button>
              <button class="cancel-btn" @click="showNewForm = false">
                <i class="bi bi-x me-2"></i>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Action Card -->
    <div v-else class="quick-action-card mb-5">
      <div class="action-content">
        <div class="action-icon">
          <i class="bi bi-plus-circle"></i>
        </div>
        <div class="action-text">
          <h3>Submit New Leave Request</h3>
          <p>Replace email requests with digital submissions</p>
        </div>
        <button class="action-btn" @click="showNewForm = true">
          <i class="bi bi-plus-circle me-2"></i>
          Create Request
        </button>
      </div>
    </div>
    
    <!-- Leave Requests Table -->
    <div class="main-card">
      <div class="card-header modern-card-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-calendar-event me-3"></i>
          <h3>All Leave Requests</h3>
        </div>
        <div class="header-stats">
          <span class="total-badge">{{ allRequests.length }} total</span>
        </div>
      </div>
      
      <div class="card-body">
        <div v-if="allRequests.length > 0" class="table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in allRequests" :key="request.id">
                <td>
                  <div class="employee-cell">
                    <div class="employee-avatar" :style="{ background: getGradient(request.employeeId) }">
                      {{ getInitials(request.employeeName) }}
                    </div>
                    <div class="employee-info">
                      <div class="employee-name">{{ request.employeeName }}</div>
                      <div class="employee-id">ID: {{ request.employeeId }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="date-cell">
                    <div class="date-main">{{ formatDate(request.date) }}</div>
                    <div class="date-day">{{ getDayOfWeek(request.date) }}</div>
                  </div>
                </td>
                <td>
                  <span class="reason-badge" :class="getReasonClass(request.reason)">
                    {{ request.reason }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="getStatusClass(request.status)">
                    {{ request.status }}
                  </span>
                </td>
                <td>
                  <span class="dept-badge" :style="{ backgroundColor: getDepartmentColor(getEmployeeDept(request.employeeId)) }">
                    {{ getEmployeeDept(request.employeeId) }}
                  </span>
                </td>
                <td>
                  <div v-if="request.status === 'Pending'" class="action-buttons">
                    <button class="action-btn approve" @click="approveRequest(request)" title="Approve">
                      <i class="bi bi-check-circle"></i>
                    </button>
                    <button class="action-btn deny" @click="denyRequest(request)" title="Deny">
                      <i class="bi bi-x-circle"></i>
                    </button>
                    <button class="action-btn view" @click="viewRequestDetails(request)" title="View Details">
                      <i class="bi bi-eye"></i>
                    </button>
                  </div>
                  <div v-else class="processed-badge">
                    <i class="bi bi-check2-circle"></i>
                    Processed
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <i class="bi bi-calendar-x"></i>
          </div>
          <h4>No leave requests yet</h4>
          <p>Submit your first leave request using the button above</p>
          <button class="empty-action-btn" @click="showNewForm = true">
            <i class="bi bi-plus-circle me-2"></i>
            Submit First Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeaveRequests',
  inject: ['appState'],
  data() {
    return {
      showNewForm: false,
      newRequest: {
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        reason: ''
      },
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
      },
      avatarColors: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
      ]
    }
  },
  computed: {
    employees() {
      return this.appState.employees || []
    },
    allRequests() {
      return this.appState.leaveRequests || []
    },
    pendingRequests() {
      return this.allRequests.filter(req => req.status === 'Pending')
    },
    approvedRequests() {
      return this.allRequests.filter(req => req.status === 'Approved')
    },
    deniedRequests() {
      return this.allRequests.filter(req => req.status === 'Denied')
    },
    requestStats() {
      const total = this.allRequests.length
      return [
        { 
          status: 'Pending', 
          count: this.pendingRequests.length, 
          color: '#ffc107',
          percentage: total > 0 ? Math.round((this.pendingRequests.length / total) * 100) : 0
        },
        { 
          status: 'Approved', 
          count: this.approvedRequests.length, 
          color: '#198754',
          percentage: total > 0 ? Math.round((this.approvedRequests.length / total) * 100) : 0
        },
        { 
          status: 'Denied', 
          count: this.deniedRequests.length, 
          color: '#dc3545',
          percentage: total > 0 ? Math.round((this.deniedRequests.length / total) * 100) : 0
        }
      ]
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
    getGradient(employeeId) {
      const index = employeeId % this.avatarColors.length
      return this.avatarColors[index]
    },
    getEmployeeDept(employeeId) {
      const emp = this.employees.find(e => e.employeeId === employeeId)
      return emp ? emp.department : 'Unknown'
    },
    getDepartmentColor(department) {
      return this.departmentColors[department] || '#7f8c8d'
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    getDayOfWeek(dateString) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const date = new Date(dateString)
      return days[date.getDay()]
    },
    getReasonClass(reason) {
      const reasonClasses = {
        'Sick Leave': 'sick',
        'Vacation': 'vacation',
        'Bereavement': 'bereavement',
        'Maternity': 'maternity',
        'Childcare': 'childcare',
        'Personal': 'personal'
      }
      return reasonClasses[reason] || 'default'
    },
    getStatusClass(status) {
      return status.toLowerCase()
    },
    submitRequest() {
      if (!this.newRequest.employeeId || !this.newRequest.date || !this.newRequest.reason) {
        this.showNotification('Please fill in all fields', 'error')
        return
      }
      
      const employee = this.employees.find(e => e.employeeId === parseInt(this.newRequest.employeeId))
      if (!employee) {
        this.showNotification('Employee not found', 'error')
        return
      }
      
      const newRequest = {
        id: Date.now(),
        employeeId: parseInt(this.newRequest.employeeId),
        employeeName: employee.name,
        date: this.newRequest.date,
        reason: this.newRequest.reason,
        status: 'Pending'
      }
      
      if (!this.appState.leaveRequests) {
        this.appState.leaveRequests = []
      }
      
      this.appState.leaveRequests.unshift(newRequest)
      
      this.newRequest = {
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        reason: ''
      }
      this.showNewForm = false
      
      this.showNotification(`Leave request submitted successfully for ${employee.name}!`, 'success')
    },
    approveRequest(request) {
      if (!confirm(`Approve leave request for ${request.employeeName} on ${this.formatDate(request.date)}?`)) {
        return
      }
      request.status = 'Approved'
      this.showNotification(`Leave request approved for ${request.employeeName}`, 'success')
    },
    denyRequest(request) {
      if (!confirm(`Deny leave request for ${request.employeeName} on ${this.formatDate(request.date)}?`)) {
        return
      }
      request.status = 'Denied'
      this.showNotification(`Leave request denied for ${request.employeeName}`, 'error')
    },
    viewRequestDetails(request) {
      const employee = this.employees.find(e => e.employeeId === request.employeeId)
      const details = `
Leave Request Details:
=====================

Employee: ${request.employeeName}
Employee ID: ${request.employeeId}
Department: ${employee ? employee.department : 'Unknown'}
Position: ${employee ? employee.position : 'Unknown'}

Request Date: ${this.formatDate(request.date)}
Day: ${this.getDayOfWeek(request.date)}
Reason: ${request.reason}
Status: ${request.status}

Submitted: Digital system
Replaces: Email requests
      `
      alert(details)
    },
    showNotification(message, type = 'info') {
      // You can replace this with a proper notification system
      if (type === 'success') {
        alert('✅ ' + message)
      } else if (type === 'error') {
        alert('❌ ' + message)
      } else {
        alert('ℹ️ ' + message)
      }
    }
  }
}
</script>

<style scoped>
.leave-management-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  min-height: 100vh;
}

/* Header Styling */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
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

.page-subtitle {
  color: #718096;
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
}

.attendance-link {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.attendance-link:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

/* Stats Cards */
.stats-row {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  height: 100%;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card.pending {
  border-color: rgba(255, 193, 7, 0.3);
}

.stat-card.approved {
  border-color: rgba(25, 135, 84, 0.3);
}

.stat-card.denied {
  border-color: rgba(220, 53, 69, 0.3);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  font-size: 1.8rem;
}

.stat-card.pending .stat-icon {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.stat-card.approved .stat-icon {
  background: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.stat-card.denied .stat-icon {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  margin: 0.25rem 0;
}

.stat-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.stat-percentage {
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-info {
  font-size: 0.8rem;
  color: #a0aec0;
}

.stat-badge {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

.stat-badge .badge {
  background: rgba(0, 0, 0, 0.05);
  color: #718096;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
}

/* New Request Card */
.new-request-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.modern-card-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modern-card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  transform: rotate(90deg);
}

/* Form Styling */
.card-body {
  padding: 2rem;
}

.modern-label {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: block;
}

.form-group {
  position: relative;
}

.form-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  z-index: 1;
}

.modern-select,
.modern-input {
  padding-left: 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  height: 48px;
  transition: all 0.3s ease;
  background: white;
}

.modern-select:focus,
.modern-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eef2f7;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.cancel-btn {
  background: white;
  border: 2px solid #e2e8f0;
  color: #718096;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Quick Action Card */
.quick-action-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  margin-bottom: 2rem;
}

.action-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.action-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.action-text h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: white;
}

.action-text p {
  margin: 0;
  opacity: 0.9;
}

.action-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  color: #764ba2;
}

/* Main Table Card */
.main-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.header-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.total-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Modern Table */
.table-container {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table thead {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.modern-table th {
  padding: 1.25rem 1rem;
  font-weight: 600;
  color: #2d3748;
  text-align: left;
  border-bottom: 2px solid #eef2f7;
  white-space: nowrap;
}

.modern-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f7fafc;
}

.modern-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.02);
  transform: translateX(4px);
}

.modern-table td {
  padding: 1.25rem 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #f7fafc;
}

/* Employee Cell */
.employee-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.employee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.employee-name {
  font-weight: 600;
  color: #2d3748;
}

.employee-id {
  font-size: 0.875rem;
  color: #718096;
}

/* Date Cell */
.date-cell {
  min-width: 120px;
}

.date-main {
  font-weight: 600;
  color: #2d3748;
}

.date-day {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}

/* Badges */
.reason-badge,
.status-badge,
.dept-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

/* Reason Badges */
.reason-badge.sick { background: #fee2e2; color: #dc2626; }
.reason-badge.vacation { background: #d1fae5; color: #059669; }
.reason-badge.bereavement { background: #f3f4f6; color: #374151; }
.reason-badge.maternity { background: #dbeafe; color: #2563eb; }
.reason-badge.childcare { background: #fef3c7; color: #d97706; }
.reason-badge.personal { background: #f5f3ff; color: #7c3aed; }
.reason-badge.default { background: #f3f4f6; color: #6b7280; }

/* Status Badges */
.status-badge.pending { background: #fef3c7; color: #d97706; }
.status-badge.approved { background: #d1fae5; color: #059669; }
.status-badge.denied { background: #fee2e2; color: #dc2626; }

/* Department Badges */
.dept-badge {
  color: white;
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 50px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-btn.approve {
  background: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.action-btn.approve:hover {
  background: #198754;
  color: white;
  transform: translateY(-2px);
}

.action-btn.deny {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.action-btn.deny:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-2px);
}

.action-btn.view {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.action-btn.view:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.processed-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: rgba(5, 150, 105, 0.1);
  border-radius: 50px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.empty-state h4 {
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
  margin-bottom: 2rem;
}

.empty-action-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Responsive Design */
@media (max-width: 992px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    align-self: stretch;
  }
  
  .attendance-link {
    width: 100%;
    justify-content: center;
  }
  
  .action-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .leave-management-container {
    padding: 1rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .stat-badge {
    position: static;
    margin-top: 1rem;
  }
  
  .modern-table {
    min-width: 800px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>