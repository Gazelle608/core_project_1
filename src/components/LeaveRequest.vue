<template>
  <div>
    <h2>Leave Request Management</h2>
    <p class="text-muted">Digital system for time off requests and approvals</p>
    
    <!-- Simple Stats - Matching Dashboard Style -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-warning mb-2">
              <i class="bi bi-clock-history display-6"></i>
            </div>
            <h5 class="card-title text-muted">Pending</h5>
            <h2 class="mb-0">{{ pendingRequests.length }}</h2>
            <p class="card-text small mt-2 text-muted">Awaiting aproval</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-success mb-2">
              <i class="bi bi-check-circle display-6"></i>
            </div>
            <h5 class="card-title text-muted">Approved</h5>
            <h2 class="mb-0">{{ approvedRequests.length }}</h2>
            <p class="card-text small mt-2 text-muted">Time off granted</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-danger mb-2">
              <i class="bi bi-x-circle display-6"></i>
            </div>
            <h5 class="card-title text-muted">Denied</h5>
            <h2 class="mb-0">{{ deniedRequests.length }}</h2>
            <p class="card-text small mt-2 text-muted">Requests declined</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- New Request Form (initially hidden) -->
    <div v-if="showNewForm" class="card mb-4">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-plus-circle me-2"></i>
          <span>Submit New Leave Request</span>
        </div>
        <button class="btn btn-sm btn-outline-secondary" @click="showNewForm = false">
          <i class="bi bi-x"></i> Cancel
        </button>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="form-label">Employee</label>
            <select class="form-select" v-model="newRequest.employeeId">
              <option value="">Select Employee</option>
              <option v-for="emp in employees" :key="emp.employeeId" :value="emp.employeeId">
                {{ emp.name }} ({{ emp.department }})
              </option>
            </select>
          </div>
          
          <div class="col-md-4 mb-3">
            <label class="form-label">Leave Date</label>
            <input type="date" class="form-control" v-model="newRequest.date">
          </div>
          
          <div class="col-md-4 mb-3">
            <label class="form-label">Reason</label>
            <select class="form-select" v-model="newRequest.reason">
              <option value="">Select Reason</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Vacation">Vacation</option>
              <option value="Personal">Personal</option>
              <option value="Bereavement">Bereavement</option>
              <option value="Maternity">Maternity</option>
              <option value="Childcare">Childcare</option>
            </select>
          </div>
          
          <div class="col-md-12">
            <div class="d-flex">
              <button class="btn btn-success" @click="submitRequest">
                <i class="bi bi-send me-1"></i>
                Submit Request
              </button>
              <button class="btn btn-outline-secondary ms-2" @click="showNewForm = false">
                <i class="bi bi-x me-1"></i>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Submit New Request Button (only shown when form is hidden) -->
    <div v-else class="card mb-4">
      <div class="card-body text-center">
        <button class="btn btn-primary btn-lg" @click="showNewForm = true">
          <i class="bi bi-plus-circle me-2"></i>
          Submit New Leave Request
        </button>
        <p class="text-muted mt-2">Replace email requests with digital submissions</p>
      </div>
    </div>
    
    <!-- Leave Requests Table -->
    <div class="card">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-calendar-event me-2"></i>
          <span>All Leave Requests</span>
        </div>
        <div>
          <span class="badge bg-primary me-2">{{ allRequests.length }} total</span>
          <router-link to="/attendance" class="btn btn-sm btn-outline-info">
            <i class="bi bi-calendar-check me-1"></i>
            View Attendance
          </router-link>
        </div>
      </div>
      
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
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
                  <div class="d-flex align-items-center">
                    <div class="employee-avatar me-3">
                      {{ getInitials(request.employeeName) }}
                    </div>
                    <div>
                      <strong>{{ request.employeeName }}</strong>
                      <div class="text-muted small">ID: {{ request.employeeId }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <strong>{{ formatDate(request.date) }}</strong>
                    <div class="text-muted small">{{ getDayOfWeek(request.date) }}</div>
                  </div>
                </td>
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
                <td>
                  <span class="badge" :style="{ 
                    backgroundColor: getDepartmentColor(getEmployeeDept(request.employeeId)),
                    color: 'white'
                  }">
                    {{ getEmployeeDept(request.employeeId) }}
                  </span>
                </td>
                <td>
                  <div v-if="request.status === 'Pending'" class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-success"
                      @click="approveRequest(request)"
                      title="Approve Request"
                    >
                      <i class="bi bi-check-circle"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger"
                      @click="denyRequest(request)"
                      title="Deny Request"
                    >
                      <i class="bi bi-x-circle"></i>
                    </button>
                    <button 
                      class="btn btn-outline-primary"
                      @click="viewRequestDetails(request)"
                      title="View Details"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                  </div>
                  <div v-else class="text-muted small">
                    <i class="bi bi-check2-circle me-1"></i>
                    Processed
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="allRequests.length === 0" class="text-center py-5">
          <div class="mb-3">
            <i class="bi bi-calendar-x display-1 text-muted"></i>
          </div>
          <h5>No leave requests yet</h5>
          <p class="text-muted">Submit your first leave request using the button above</p>
          <button class="btn btn-primary" @click="showNewForm = true">
            <i class="bi bi-plus-circle me-1"></i>
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
      }
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
    },
    donutChartStyle() {
      const total = this.allRequests.length
      const pendingPercentage = total > 0 ? (this.pendingRequests.length / total) * 100 : 0
      const approvedPercentage = total > 0 ? (this.approvedRequests.length / total) * 100 : 0
      
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
      if (reason.includes('Sick')) return 'bg-danger'
      if (reason.includes('Vacation')) return 'bg-success'
      if (reason.includes('Bereavement')) return 'bg-dark'
      if (reason.includes('Maternity')) return 'bg-info'
      return 'bg-warning'
    },
    getStatusClass(status) {
      if (status === 'Approved') return 'bg-success'
      if (status === 'Denied') return 'bg-danger'
      return 'bg-warning'
    },
    submitRequest() {
      if (!this.newRequest.employeeId || !this.newRequest.date || !this.newRequest.reason) {
        alert('Please fill in all fields')
        return
      }
      
      const employee = this.employees.find(e => e.employeeId === parseInt(this.newRequest.employeeId))
      if (!employee) {
        alert('Employee not found')
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
      
      this.appState.leaveRequests.unshift(newRequest) // Add to beginning
      
      // Reset form
      this.newRequest = {
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        reason: ''
      }
      this.showNewForm = false
      
      alert(`Leave request submitted successfully for ${employee.name}!`)
    },
    approveRequest(request) {
      if (!confirm(`Approve leave request for ${request.employeeName} on ${this.formatDate(request.date)}?`)) {
        return
      }
      request.status = 'Approved'
      alert(`Leave request approved for ${request.employeeName}`)
    },
    denyRequest(request) {
      if (!confirm(`Deny leave request for ${request.employeeName} on ${this.formatDate(request.date)}?`)) {
        return
      }
      request.status = 'Denied'
      alert(`Leave request denied for ${request.employeeName}`)
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

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.employee-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.donut-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
}

.donut-chart::before {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.position-relative {
  position: relative;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.border-warning {
  border-color: #ffc107 !important;
}

.border-success {
  border-color: #198754 !important;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}
</style>