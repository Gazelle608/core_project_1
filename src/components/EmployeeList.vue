<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 fw-bold mb-2" style="color: #2d3748;">Employee Directory</h1>
        <p class="text-muted mb-0">Manage and view all employee information</p>
      </div>
      <button class="btn btn-primary d-flex align-items-center">
        <i class="bi bi-plus-circle me-2"></i>
        Add Employee
      </button>
    </div>

    <!-- Stats -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 text-center py-3">
          <div class="card-body">
            <div class="text-primary mb-2">
              <i class="bi bi-people fs-1"></i>
            </div>
            <h3 class="fw-bold mb-1">{{ totalEmployees }}</h3>
            <p class="text-muted small mb-0">Total Employees</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 text-center py-3">
          <div class="card-body">
            <div class="text-success mb-2">
              <i class="bi bi-building fs-1"></i>
            </div>
            <h3 class="fw-bold mb-1">{{ departments.length }}</h3>
            <p class="text-muted small mb-0">Departments</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 text-center py-3">
          <div class="card-body">
            <div class="text-info mb-2">
              <i class="bi bi-cash-stack fs-1"></i>
            </div>
            <h3 class="fw-bold mb-1">R {{ avgSalary.toLocaleString() }}</h3>
            <p class="text-muted small mb-0">Avg. Salary</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 text-center py-3">
          <div class="card-body">
            <div class="text-warning mb-2">
              <i class="bi bi-clock-history fs-1"></i>
            </div>
            <h3 class="fw-bold mb-1">{{ avgTenure }}</h3>
            <p class="text-muted small mb-0">Avg. Tenure (yrs)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Table -->
    <div class="card border-0">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-person-lines-fill me-2 text-primary"></i>
          Employee List
        </h5>
        <div class="d-flex gap-2">
          <select v-model="selectedDept" class="form-select form-select-sm w-auto">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept">{{ dept }}</option>
          </select>
          <input v-model="searchQuery" type="text" class="form-control form-control-sm" placeholder="Search employees..." style="width: 200px;">
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Position</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in filteredEmployees" :key="employee.employeeId">
                <td class="fw-semibold text-muted">#{{ employee.employeeId }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-person-fill text-primary"></i>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ employee.name }}</div>
                      <small class="text-muted">{{ extractYear(employee.employmentHistory) }}</small>
                    </div>
                  </div>
                </td>
                <td class="fw-semibold">{{ employee.position }}</td>
                <td>
                  <span class="badge" :style="{ backgroundColor: getDepartmentColor(employee.department), color: 'white' }">
                    {{ employee.department }}
                  </span>
                </td>
                <td class="fw-bold">R {{ employee.salary.toLocaleString() }}</td>
                <td>
                  <a :href="'mailto:' + employee.contact" class="text-decoration-none">
                    <i class="bi bi-envelope me-1"></i>
                    {{ employee.contact }}
                  </a>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="View Details">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" title="Edit">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-info" title="Profile">
                      <i class="bi bi-person"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredEmployees.length === 0" class="text-center py-5">
          <i class="bi bi-people display-4 text-muted mb-3"></i>
          <h5>No employees found</h5>
          <p class="text-muted">Try adjusting your search or filter criteria</p>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="card-footer bg-white border-top">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-muted small">
            Showing {{ filteredEmployees.length }} of {{ totalEmployees }} employees
          </div>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item disabled">
                <a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeList',
  inject: ['dataService'],
  data() {
    return {
      searchQuery: '',
      selectedDept: '',
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
      return this.dataService.getAllEmployees()
    },
    totalEmployees() {
      return this.employees.length
    },
    departments() {
      return [...new Set(this.employees.map(e => e.department))]
    },
    avgSalary() {
      const total = this.employees.reduce((sum, emp) => sum + emp.salary, 0)
      return Math.round(total / this.employees.length)
    },
    avgTenure() {
      // Extract years from employment history (simplified)
      const totalYears = this.employees.reduce((sum, emp) => {
        const year = this.extractYear(emp.employmentHistory)
        return sum + (year || 3) // Default to 3 years if can't extract
      }, 0)
      return Math.round(totalYears / this.employees.length)
    },
    filteredEmployees() {
      let filtered = this.employees
      
      if (this.selectedDept) {
        filtered = filtered.filter(emp => emp.department === this.selectedDept)
      }
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(emp => 
          emp.name.toLowerCase().includes(query) ||
          emp.position.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query)
        )
      }
      
      return filtered
    }
  },
  methods: {
    getDepartmentColor(dept) {
      return this.departmentColors[dept] || '#7f8c8d'
    },
    extractYear(history) {
      const match = history.match(/\d{4}/)
      if (match) {
        const year = parseInt(match[0])
        const currentYear = new Date().getFullYear()
        return currentYear - year
      }
      return 3 // Default
    }
  }
}
</script>

<style scoped>
.table th {
  font-weight: 600;
  color: #4a5568;
  background-color: #f8fafc;
}

.badge {
  font-weight: 500;
  padding: 0.35rem 0.75rem;
}
</style>