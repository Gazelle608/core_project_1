<template>
  <div>
    <h2>Employee Management</h2>
    <p class="text-muted">Centralized employee data management</p>
    
    <!-- Simple Stats - Matching Dashboard Style -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-primary mb-2">
              <i class="bi bi-people display-6"></i>
            </div>
            <h5 class="card-title text-muted">Total Employees</h5>
            <h2 class="mb-0">{{ totalEmployees }}</h2>
            <p class="card-text small mt-2 text-muted">Active staff</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-success mb-2">
              <i class="bi bi-building display-6"></i>
            </div>
            <h5 class="card-title text-muted">Departments</h5>
            <h2 class="mb-0">{{ departments.length }}</h2>
            <p class="card-text small mt-2 text-muted">Across company</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Search Box -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input 
            type="text" 
            class="form-control" 
            v-model="searchQuery" 
            placeholder="Search employees by name, department, or position..."
          >
        </div>
        <div v-if="searchQuery" class="mt-2 text-muted small">
          Found {{ filteredEmployees.length }} employee{{ filteredEmployees.length !== 1 ? 's' : '' }}
        </div>
      </div>
    </div>
    
    <!-- Simple Employee Table with Employment History -->
    <div class="card">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-people me-2"></i>
          <span>Employee List</span>
        </div>
        <span class="badge bg-primary">{{ filteredEmployees.length }} employees</span>
      </div>
      
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Employment History</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in filteredEmployees" :key="employee.employeeId">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="employee-avatar me-3">
                      {{ getInitials(employee.name) }}
                    </div>
                    <div>
                      <strong>{{ employee.name }}</strong>
                      <div class="text-muted small">ID: {{ employee.employeeId }}</div>
                      <div class="text-muted small">
                        <i class="bi bi-envelope"></i> {{ employee.contact }}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" :style="{ 
                    backgroundColor: getDepartmentColor(employee.department),
                    color: 'white'
                  }">
                    {{ employee.department }}
                  </span>
                </td>
                <td>
                  <span class="text-muted">{{ employee.position }}</span>
                </td>
                <td>
                  <div class="text-success">
                    <strong>R {{ employee.salary.toLocaleString() }}</strong>
                  </div>
                  <div class="text-muted small">Monthly</div>
                </td>
                <td>
                  <div class="small">
                    <div v-if="employee.employmentHistory" class="text-truncate" style="max-width: 200px;" :title="employee.employmentHistory">
                      {{ truncateHistory(employee.employmentHistory) }}
                    </div>
                    <div v-else class="text-muted">
                      <i class="bi bi-clock-history me-1"></i> No history recorded
                    </div>
                  </div>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary"
                      @click="viewDetails(employee)"
                      title="View Details"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-outline-warning"
                      @click="editEmployee(employee)"
                      title="Edit Employee"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-outline-info"
                      @click="viewEmploymentHistory(employee)"
                      title="View Employment History"
                    >
                      <i class="bi bi-clock-history"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredEmployees.length === 0" class="text-center py-5">
          <div class="mb-3">
            <i class="bi bi-people display-1 text-muted"></i>
          </div>
          <h5>No employees found</h5>
          <p class="text-muted">Try adjusting your search</p>
        </div>
      </div>
    </div>
    
    <!-- Employment History Summary -->
    <div class="card mt-4">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-clock-history me-2"></i>
          <span>Employment History Summary</span>
        </div>
        <span class="badge bg-primary">{{ employeesWithHistory.length }} with history</span>
      </div>
      <div class="card-body">
        <div v-if="employeesWithHistory.length === 0" class="text-center py-3">
          <p class="text-muted">No employment history recorded yet</p>
        </div>
        <div v-else class="row">
          <div class="col-md-6" v-for="employee in employeesWithHistory.slice(0, 4)" :key="employee.employeeId">
            <div class="border rounded p-3 mb-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{{ employee.name }}</strong>
                  <div class="text-muted small">{{ employee.department }}</div>
                </div>
                <span class="badge bg-info">History</span>
              </div>
              <div class="mt-2 small">
                <div class="text-truncate" :title="employee.employmentHistory">
                  {{ employee.employmentHistory }}
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
  name: 'EmployeeList',
  inject: ['appState'],
  data() {
    return {
      searchQuery: '',
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
    totalEmployees() {
      return this.employees.length
    },
    filteredEmployees() {
      if (!this.searchQuery) return this.employees
      
      const query = this.searchQuery.toLowerCase()
      return this.employees.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query) ||
        (emp.employmentHistory && emp.employmentHistory.toLowerCase().includes(query))
      )
    },
    departments() {
      const deptMap = {}
      
      this.employees.forEach(emp => {
        if (!deptMap[emp.department]) {
          deptMap[emp.department] = {
            name: emp.department,
            count: 0,
            totalSalary: 0
          }
        }
        deptMap[emp.department].count++
        deptMap[emp.department].totalSalary += emp.salary
      })
      
      return Object.values(deptMap).map(dept => ({
        ...dept,
        avgSalary: Math.round(dept.totalSalary / dept.count)
      })).sort((a, b) => b.count - a.count)
    },
    employeesWithHistory() {
      return this.employees.filter(emp => emp.employmentHistory && emp.employmentHistory.trim() !== '')
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
    truncateHistory(history) {
      if (!history) return ''
      if (history.length <= 40) return history
      return history.substring(0, 40) + '...'
    },
    viewDetails(employee) {
      const details = `
Employee Details:
=================

Name: ${employee.name}
Employee ID: ${employee.employeeId}
Position: ${employee.position}
Department: ${employee.department}
Email: ${employee.contact}

Salary Information:
-------------------
Monthly Salary: R ${employee.salary.toLocaleString()}
Annual Salary: R ${(employee.salary * 12).toLocaleString()}

Employment History:
-------------------
${employee.employmentHistory || 'No employment history recorded'}
      `
      alert(details)
    },
    viewEmploymentHistory(employee) {
      if (!employee.employmentHistory || employee.employmentHistory.trim() === '') {
        alert(`${employee.name} has no employment history recorded.`)
        return
      }
      
      const history = `
Employment History for ${employee.name}
======================================

${employee.employmentHistory}

======================================
This information was previously stored in a separate Excel file (employment_history.xlsx)
Now it's integrated with all other employee data.
      `
      alert(history)
    },
    editEmployee(employee) {
      const newName = prompt('Edit name:', employee.name)
      if (newName) employee.name = newName
      
      const newSalary = prompt('Edit salary (R):', employee.salary)
      if (newSalary && !isNaN(newSalary)) {
        employee.salary = parseInt(newSalary)
      }
      
      const newHistory = prompt('Edit employment history:', employee.employmentHistory || '')
      if (newHistory !== null) {
        employee.employmentHistory = newHistory
      }
      
      alert('Employee updated')
    }
  }
}
</script>

<style scoped>
body{
  background-color: #f5f7fa;
  font-family: "Inter","poppins","Segoe UI",sans-serif;
  color: #2c2c2c;
}

/*Page Title*/
h2{
  font-weight: 700;
  color: #2c2c2c;
  letter-spacing: 0.3px;
}

.text-muted{
  color: #6c757d !important;
}

/*CARD STYLIG*/
.card {
  border: none;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.15);
}
.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  font-size: 1.1rem;
}

/*search input*/

.input-group-text {
  background-color: #e9ecef;
  border: none;
  border-radius: 8px 0 0 8px;
}

.form-control {
  border: 1px solid #e9ecef;
  border-radius: 0 8px 8px 0;
  box-shadow: none;
}

.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
} 

/*EMPLOYEE AVATAR*/
.employee-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #3498db;
  color: #fff;
  display: flex; 
  align-items: center; 
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;

}

.employee-avatar:hover {
  background-color: #2980b9;
  cursor: default;
}   

.badge {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px;
  border-radius: 12px;
}

.badge.bg-primary {
  background-color: #3498db;
}
.badge.bg-info {
  background-color: #1abc9c;
} 
.badge.bg-success {
  background-color: #2ecc71;
}

/*BUTTOONS*/
.btn{
  border-radius: 8px;
  transition: all 0.2s ease-in-out;  
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-outline-primary:hover {
  background-color: #3498db;
  color: #fff;
  border-color: #2980b9;
}
.btn-outline-warning:hover {
  background-color: #f39c12;
  color: #fff;
  border-color: #e67e22;
}
.btn-outline-info:hover {
  background-color: #1abc9c;
  color: #fff;  
  border-color: #16a085;
}

.btn-group-sm .btn {
  padding: 0.3rem 0.55rem;
}

/*Employee history summary*/

.border {
  border: 1px solid #e9ecef !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-radius: 12px;
} 

.border:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
  transition: 0.3;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*Empty State*/ 
.text-center i{
  opacity: 0.4;
}

.text-center h5{
  color: #7f8c8d;
font-weight: 600;
}


/*Small Detail & transition*/ 
.small {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.table td {
  vertical-align: middle;

}
.card-body{
  transition: all 0.2s ease-in-out ;
}




















































</style>