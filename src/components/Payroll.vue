<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-2">
        <div class="bg-success bg-opacity-10 rounded-3 p-3 me-3">
          <i class="bi bi-cash-stack text-success fs-3"></i>
        </div>
        <div>
          <h1 class="h2 mb-1 fw-bold" style="color: #2d3748;">Payroll Management</h1>
          <p class="text-muted mb-0">Process and manage employee salaries</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="row g-4 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 border-start border-primary border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Total Payroll</h6>
                <h2 class="fw-bold mb-0">R {{ totalPayroll.toLocaleString() }}</h2>
                <span class="text-muted small">This month</span>
              </div>
              <div class="bg-primary bg-opacity-10 rounded-3 p-2">
                <i class="bi bi-cash-coin text-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 col-6">
        <div class="card border-0 border-start border-success border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Avg. Salary</h6>
                <h2 class="fw-bold mb-0">R {{ avgSalary.toLocaleString() }}</h2>
                <span class="text-muted small">Per employee</span>
              </div>
              <div class="bg-success bg-opacity-10 rounded-3 p-2">
                <i class="bi bi-graph-up text-success"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 col-6">
        <div class="card border-0 border-start border-info border-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="text-muted mb-2">Total Hours</h6>
                <h2 class="fw-bold mb-0">{{ totalHours }}</h2>
                <span class="text-muted small">Worked this month</span>
              </div>
              <div class="bg-info bg-opacity-10 rounded-3 p-2">
                <i class="bi bi-clock text-info"></i>
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
                <h6 class="text-muted mb-2">Leave Deductions</h6>
                <h2 class="fw-bold mb-0">{{ totalLeaveDeductions }}</h2>
                <span class="text-muted small">Hours deducted</span>
              </div>
              <div class="bg-warning bg-opacity-10 rounded-3 p-2">
                <i class="bi bi-calendar-minus text-warning"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payroll Table -->
    <div class="card border-0">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-calculator me-2 text-primary"></i>
          Payroll Details
        </h5>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary">
            <i class="bi bi-download me-1"></i>
            Export
          </button>
          <button class="btn btn-sm btn-primary">
            <i class="bi bi-send me-1"></i>
            Process Payroll
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
                <th>Base Salary</th>
                <th>Hours Worked</th>
                <th>Leave Deductions</th>
                <th>Final Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payroll in payrollData" :key="payroll.employeeId">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-person text-primary"></i>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ getEmployeeName(payroll.employeeId) }}</div>
                      <small class="text-muted">ID: {{ payroll.employeeId }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" :style="{ backgroundColor: getDepartmentColor(getEmployeeDept(payroll.employeeId)), color: 'white' }">
                    {{ getEmployeeDept(payroll.employeeId) }}
                  </span>
                </td>
                <td class="fw-semibold">R {{ getBaseSalary(payroll.employeeId).toLocaleString() }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="progress flex-grow-1 me-2" style="height: 6px;">
                      <div class="progress-bar" :class="getHoursClass(payroll.hoursWorked)" 
                           :style="{ width: Math.min(payroll.hoursWorked / 200 * 100, 100) + '%' }"></div>
                    </div>
                    <span class="fw-semibold">{{ payroll.hoursWorked }}h</span>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="payroll.leaveDeductions > 0 ? 'bg-warning bg-opacity-10 text-warning' : 'bg-success bg-opacity-10 text-success'">
                    {{ payroll.leaveDeductions }}h
                  </span>
                </td>
                <td>
                  <span class="fw-bold text-success">R {{ payroll.finalSalary.toLocaleString() }}</span>
                </td>
                <td>
                  <span class="badge bg-success bg-opacity-10 text-success">
                    <i class="bi bi-check-circle me-1"></i>
                    Processed
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="View Details">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" title="Edit">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-info" title="Download">
                      <i class="bi bi-download"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Summary -->
      <div class="card-footer bg-white border-top">
        <div class="row">
          <div class="col-md-4">
            <div class="d-flex align-items-center">
              <div class="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
                <i class="bi bi-cash-coin text-primary"></i>
              </div>
              <div>
                <h6 class="mb-1">Total Payroll</h6>
                <h4 class="fw-bold mb-0">R {{ totalPayroll.toLocaleString() }}</h4>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="d-flex align-items-center">
              <div class="bg-success bg-opacity-10 rounded-3 p-2 me-3">
                <i class="bi bi-arrow-up-right text-success"></i>
              </div>
              <div>
                <h6 class="mb-1">Average Salary</h6>
                <h4 class="fw-bold mb-0">R {{ avgSalary.toLocaleString() }}</h4>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="d-flex align-items-center">
              <div class="bg-info bg-opacity-10 rounded-3 p-2 me-3">
                <i class="bi bi-clock text-info"></i>
              </div>
              <div>
                <h6 class="mb-1">Avg. Hours/Employee</h6>
                <h4 class="fw-bold mb-0">{{ avgHours }}h</h4>
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
  name: 'Payroll',
  inject: ['dataService'],
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
    payrollData() {
      return this.dataService.getPayrollData()
    },
    employees() {
      return this.dataService.getAllEmployees()
    },
    totalPayroll() {
      return this.payrollData.reduce((sum, p) => sum + p.finalSalary, 0)
    },
    avgSalary() {
      return Math.round(this.totalPayroll / this.payrollData.length)
    },
    totalHours() {
      return this.payrollData.reduce((sum, p) => sum + p.hoursWorked, 0)
    },
    avgHours() {
      return Math.round(this.totalHours / this.payrollData.length)
    },
    totalLeaveDeductions() {
      return this.payrollData.reduce((sum, p) => sum + p.leaveDeductions, 0)
    }
  },
  methods: {
    getEmployeeName(employeeId) {
      const emp = this.employees.find(e => e.employeeId === employeeId)
      return emp ? emp.name : 'Unknown'
    },
    getEmployeeDept(employeeId) {
      const emp = this.employees.find(e => e.employeeId === employeeId)
      return emp ? emp.department : 'Unknown'
    },
    getBaseSalary(employeeId) {
      const emp = this.employees.find(e => e.employeeId === employeeId)
      return emp ? emp.salary : 0
    },
    getDepartmentColor(dept) {
      return this.departmentColors[dept] || '#7f8c8d'
    },
    getHoursClass(hours) {
      if (hours >= 160) return 'bg-success'
      if (hours >= 140) return 'bg-primary'
      if (hours >= 120) return 'bg-warning'
      return 'bg-danger'
    }
  }
}
</script>

<style scoped>
.progress {
  background-color: #e2e8f0;
}

.badge {
  font-weight: 500;
  padding: 0.35rem 0.75rem;
}
</style>