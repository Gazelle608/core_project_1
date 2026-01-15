<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-2">
        <div class="bg-warning bg-opacity-10 rounded-3 p-3 me-3">
          <i class="bi bi-calendar-event text-warning fs-3"></i>
        </div>
        <div>
          <h1 class="h2 mb-1 fw-bold" style="color: #2d3748;">Leave Request Management</h1>
          <p class="text-muted mb-0">Digital system for time off requests and approvals</p>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="card border-0 border-start border-warning border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Pending Requests</h6>
                <h2 class="fw-bold mb-0 text-warning">{{ pendingRequests.length }}</h2>
                <span class="text-muted small">Awaiting approval</span>
              </div>
              <div class="bg-warning bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-clock-history text-warning fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 border-start border-success border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Approved</h6>
                <h2 class="fw-bold mb-0 text-success">{{ approvedRequests.length }}</h2>
                <span class="text-muted small">Time off granted</span>
              </div>
              <div class="bg-success bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-check-circle text-success fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 border-start border-danger border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Denied</h6>
                <h2 class="fw-bold mb-0 text-danger">{{ deniedRequests.length }}</h2>
                <span class="text-muted small">Requests declined</span>
              </div>
              <div class="bg-danger bg-opacity-10 rounded-3 p-3">
                <i class="bi bi-x-circle text-danger fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Request Button -->
    <div class="card border-0 mb-4">
      <div class="card-body text-center py-5">
        <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
          <i class="bi bi-plus-circle text-primary fs-1"></i>
        </div>
        <h4 class="fw-bold mb-2">Submit New Leave Request</h4>
        <p class="text-muted mb-4">Replace email requests with digital submissions</p>
        <button class="btn btn-primary btn-lg px-4">
          <i class="bi bi-plus-circle me-2"></i>
          Create New Request
        </button>
      </div>
    </div>

    <!-- Leave Requests Table -->
    <div class="card border-0">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-calendar-week me-2 text-primary"></i>
          All Leave Requests
        </h5>
        <div>
          <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 me-2">
            {{ allRequests.length }} total
          </span>
          <select v-model="filterStatus" class="form-select form-select-sm d-inline-block w-auto">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Denied">Denied</option>
          </select>
        </div>
      </div>
      
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
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
              <tr v-for="request in filteredRequests" :key="`${request.employeeId}-${request.date}`">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-person text-primary"></i>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ request.employeeName }}</div>
                      <small class="text-muted">ID: {{ request.employeeId }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="fw-semibold">{{ formatDate(request.date) }}</div>
                  <small class="text-muted">{{ getDayOfWeek(request.date) }}</small>
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
                  <span class="badge" :style="{ backgroundColor: getDepartmentColor(getEmployeeDept(request.employeeId)), color: 'white' }">
                    {{ getEmployeeDept(request.employeeId) }}
                  </span>
                </td>
                <td>
                  <div v-if="request.status === 'Pending'" class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" @click="approveRequest(request)" title="Approve">
                      <i class="bi bi-check"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="denyRequest(request)" title="Deny">
                      <i class="bi bi-x"></i>
                    </button>
                    <button class="btn btn-outline-primary" title="Details">
                      <i class="bi bi-eye"></i>
                    </button>
                  </div>
                  <span v-else class="text-muted small">
                    <i class="bi bi-check2-circle me-1"></i>
                    Processed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredRequests.length === 0" class="text-center py-5">
          <i class="bi bi-calendar-x display-4 text-muted mb-3"></i>
          <h5>No leave requests found</h5>
          <p class="text-muted">Try adjusting your filter criteria</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeaveRequest',
  inject: ['dataService'],
  data() {
    return {
      filterStatus: '',
      showNewForm: false,
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
    allRequests() {
      return this.dataService.getLeaveRequests()
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
    employees() {
      return this.dataService.getAllEmployees()
    },
    filteredRequests() {
      if (!this.filterStatus) return this.allRequests
      return this.allRequests.filter(req => req.status === this.filterStatus)
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
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-ZA')
    },
    getDayOfWeek(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' })
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
    approveRequest(request) {
      if (confirm(`Approve leave request for ${request.employeeName}?`)) {
        request.status = 'Approved'
        alert('Request approved!')
      }
    },
    denyRequest(request) {
      if (confirm(`Deny leave request for ${request.employeeName}?`)) {
        request.status = 'Denied'
        alert('Request denied!')
      }
    }
  }
}
</script>

<style scoped>
.badge {
  font-weight: 500;
  padding: 0.35rem 0.75rem;
}
</style>