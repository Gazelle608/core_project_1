<template>
  <div>
    <h2>Payroll Management</h2>
    <p class="text-muted">Automated payroll calculations and digital payslips</p>
    
    <!-- Simple Stats - Matching Dashboard Style -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-primary mb-2">
              <i class="bi bi-calculator display-6"></i>
            </div>
            <h5 class="card-title text-muted">Processed</h5>
            <h2 class="mb-0">{{ processedCount }}</h2>
            <p class="card-text small mt-2 text-muted">Payroll records</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-success mb-2">
              <i class="bi bi-cash-stack display-6"></i>
            </div>
            <h5 class="card-title text-muted">Total Payroll</h5>
            <h2 class="mb-0">R {{ totalPayroll.toLocaleString() }}</h2>
            <p class="card-text small mt-2 text-muted">Monthly total</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center">
            <div class="text-warning mb-2">
              <i class="bi bi-people display-6"></i>
            </div>
            <h5 class="card-title text-muted">Employees</h5>
            <h2 class="mb-0">{{ employees.length }}</h2>
            <p class="card-text small mt-2 text-muted">In payroll</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Process Payroll Button -->
    <div class="card mb-4">
      <div class="card-body text-center">
        <button class="btn btn-success btn-lg" @click="processPayroll">
          <i class="bi bi-calculator me-2"></i>
          Process Payroll
        </button>
        <p class="text-muted mt-2">Automatically calculate payroll for all employees</p>
      </div>
    </div>
    
    <!-- Simple Payroll Table -->
    <div class="card">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-cash-stack me-2"></i>
          <span>Payroll Overview</span>
        </div>
        <span class="badge bg-primary">{{ employees.length }} employees</span>
      </div>
      
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Employee</th>
                <th>Base Salary</th>
                <th>Final Salary</th>
                <th>Difference</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in employees" :key="employee.employeeId">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="employee-avatar me-3">
                      {{ getInitials(employee.name) }}
                    </div>
                    <div>
                      <strong>{{ employee.name }}</strong>
                      <div class="text-muted small">{{ employee.department }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-muted small">Base</div>
                  <strong class="text-primary">R {{ employee.salary.toLocaleString() }}</strong>
                </td>
                <td>
                  <div class="text-muted small">Final</div>
                  <strong class="text-success">
                    R {{ getFinalSalary(employee).toLocaleString() }}
                  </strong>
                </td>
                <td>
                  <span class="badge" :class="getDifferenceBadgeClass(employee)">
                    {{ getSalaryDifference(employee) }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline-primary me-1"
                    @click="generatePayslip(employee)"
                    title="Generate Payslip"
                  >
                    <i class="bi bi-file-earmark-text"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-info"
                    @click="viewCalculation(employee)"
                    title="View Calculation"
                  >
                    <i class="bi bi-calculator"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="employees.length === 0" class="text-center py-5">
          <div class="mb-3">
            <i class="bi bi-cash-stack display-1 text-muted"></i>
          </div>
          <h5>No employee data available</h5>
          <p class="text-muted">Add employees to process payroll</p>
        </div>
      </div>
    </div>
    
    <!-- Payroll Calculation Summary -->
    <div class="card mt-4">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-graph-up me-2"></i>
          <span>Payroll Calculation Summary</span>
        </div>
        <span class="badge bg-primary">Automated</span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="border rounded p-3 mb-3">
              <div class="d-flex align-items-center">
                <div class="text-success me-3">
                  <i class="bi bi-check-circle display-6"></i>
                </div>
                <div>
                  <h6 class="mb-1">Automated Calculations</h6>
                  <p class="text-muted small mb-0">No manual spreadsheet formulas needed</p>
                </div>
              </div>
            </div>
            
            <div class="border rounded p-3 mb-3">
              <div class="d-flex align-items-center">
                <div class="text-info me-3">
                  <i class="bi bi-clock-history display-6"></i>
                </div>
                <div>
                  <h6 class="mb-1">Attendance Integration</h6>
                  <p class="text-muted small mb-0">Automatically adjusts for attendance</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="border rounded p-3 mb-3">
              <div class="d-flex align-items-center">
                <div class="text-warning me-3">
                  <i class="bi bi-file-earmark-text display-6"></i>
                </div>
                <div>
                  <h6 class="mb-1">Digital Payslips</h6>
                  <p class="text-muted small mb-0">Generate payslips with one click</p>
                </div>
              </div>
            </div>
            
            <div class="border rounded p-3">
              <div class="d-flex align-items-center">
                <div class="text-danger me-3">
                  <i class="bi bi-x-circle display-6"></i>
                </div>
                <div>
                  <h6 class="mb-1">No Spreadsheet Errors</h6>
                  <p class="text-muted small mb-0">Eliminates formula mistakes</p>
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
  name: 'Payroll',
  inject: ['appState'],
  data() {
    return {
      payrollProcessed: false
    }
  },
  computed: {
    employees() {
      return this.appState.employees || []
    },
    processedCount() {
      return this.payrollProcessed ? this.employees.length : 0
    },
    totalPayroll() {
      if (!this.payrollProcessed) return 0
      return this.employees.reduce((sum, emp) => {
        return sum + this.getFinalSalary(emp)
      }, 0)
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
    getFinalSalary(employee) {
      if (!this.payrollProcessed) return employee.salary
      
      // Simple automated calculation
      const base = employee.salary || 0
      
      // Get attendance data if available
      const attendanceRecord = this.appState.attendance?.find(
        a => a.employeeId === employee.employeeId
      )
      
      let adjustment = 0
      if (attendanceRecord) {
        // Simple adjustment based on attendance
        const presentDays = attendanceRecord.attendance?.filter(
          a => a.status === 'Present' || a.status === 'Remote'
        ).length || 0
        const totalDays = attendanceRecord.attendance?.length || 20
        
        if (totalDays > 0) {
          const attendanceRate = presentDays / totalDays
          adjustment = base * (attendanceRate - 1) // Adjust for attendance
        }
      }
      
      return Math.max(0, base + adjustment)
    },
    getSalaryDifference(employee) {
      const base = employee.salary || 0
      const final = this.getFinalSalary(employee)
      const difference = final - base
      
      if (difference > 0) {
        return `+R ${difference.toLocaleString()}`
      } else if (difference < 0) {
        return `-R ${Math.abs(difference).toLocaleString()}`
      } else {
        return 'No change'
      }
    },
    getDifferenceBadgeClass(employee) {
      const base = employee.salary || 0
      const final = this.getFinalSalary(employee)
      const difference = final - base
      
      if (difference > 0) return 'bg-success'
      if (difference < 0) return 'bg-danger'
      return 'bg-secondary'
    },
    processPayroll() {
      this.payrollProcessed = true
      
      // Simulate payroll processing
      let total = 0
      this.employees.forEach(emp => {
        total += this.getFinalSalary(emp)
      })
      
      alert(`Payroll Processed Successfully!\n\n` +
        `Processed: ${this.employees.length} employees\n` +
        `Total Payroll: R ${total.toLocaleString()}\n\n` +
        `All calculations are now automated - no more spreadsheet formulas needed!`)
    },
    generatePayslip(employee) {
      const finalSalary = this.getFinalSalary(employee)
      
      const payslip = `
MODERNTECH SOLUTIONS - PAYSLIP
==============================

Employee: ${employee.name}
ID: #${employee.employeeId}
Position: ${employee.position}
Department: ${employee.department}

Pay Period: ${new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}

EARNINGS:
---------
Base Salary:     R ${employee.salary.toLocaleString()}
Final Salary:    R ${finalSalary.toLocaleString()}

TOTAL:           R ${finalSalary.toLocaleString()}
==============================

This is a digital payslip generated by the HR system.
Replaces manual payslip creation in spreadsheets.

Generated: ${new Date().toLocaleDateString('en-ZA')}
      `
      
      // Show in alert
      alert(payslip)
      
      // Ask if user wants to "download"
      if (confirm('Would you like to download this payslip as a text file?')) {
        this.downloadPayslip(employee, payslip)
      }
    },
    viewCalculation(employee) {
      const base = employee.salary || 0
      const final = this.getFinalSalary(employee)
      const difference = final - base
      const percentage = base > 0 ? ((difference / base) * 100).toFixed(1) : 0
      
      const calculation = `
Payroll Calculation for ${employee.name}
========================================

Base Salary:        R ${base.toLocaleString()}

Adjustments:
- Attendance-based: ${difference > 0 ? '+' : ''}R ${Math.abs(difference).toLocaleString()}
- Percentage:       ${difference > 0 ? '+' : ''}${percentage}%

Final Salary:       R ${final.toLocaleString()}
========================================

Calculation is automated based on attendance records.
No manual spreadsheet formulas required.
      `
      
      alert(calculation)
    },
    downloadPayslip(employee, content) {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      const filename = `Payslip_${employee.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
      
      link.href = url
      link.download = filename
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
      
      alert(`Payslip downloaded as ${filename}`)
    }
  }
}
</script>

<style scoped>
  body {
    background-color: #f8f9fa;
  }
  /*page Title*/ 
  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
  }

  /*cards glass + hover effect */
  .card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: none;
    box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.08);
    transition: all 0.3s ease;

  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1)rgba(0, 0, 0, 12);

  }


/* Card Header*/
.card-header {
  background-color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #eef2f7;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(135deg, #1e3c1e,#2a6a2a);
  color: #f8f9fa;
  font-weight:600;
  letter-spacing: 0.4px;
}

/*stat Cards*/
.card.display-6 {
  font-size: 2.5rem;
}

.text-primary {
  color: #2a6a2a !important;
}

.text-success {
  color: #198754 !important;
}

.text-warning {
  color: #ffc107 !important;
}

/*Payroll Action Button*/
.btn-success {
  background-color: #198754;
  border-color: #198754;
  border-radius: 30px;
  padding: 0.75rem 2.2rem;
  font-size: 1.1rem;
  box-shadow: 0.6px 0.6px 8px rgba(25, 135, 84, 0.2);
  transition: all 0.3s ease;
}

.btn-success:hover {
  background-color: #15734d;
  border-color: #15734d;
  box-shadow: 0 6px 20px rgba(25, 135, 84, 0.6);
}

/*Table styling */
table {
  font-size: 0.95rem;
  border-collapse: separate;
  border-spacing: 0 12px;
}

.table{
  border-collapse: separate;
  border-spacing: 0 10px;
}

.table thead th {
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0.6px 18px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  border-bottom: none;
  font-weight: 00;
  color: #2c3e50;
}

.table tbody tr {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0.6px 8px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;
}

.table tbody tr:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.table th, .table td {
  vertical-align: middle;
  border: none;}

  .employee-avatar {
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #1e3c1e 0%, #2a6a2a 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 0.85rem;
  }


  /*Badgess (salary Difference)*/
  .badge {
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
    border-radius: 12px;
    font-weight: 600;
  }
  .bg-success {
    background: linear-gradient(135deg, #198754 0%, #15734d 100%);

  }
  .bg-danger {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: white;
  }
  .bg-secondary {
    background: linear-gradient(135deg, #7f8c8d 0%, #95a5a6 100%);
    color: white;
  } 
  /*icons Animation*/
  .bi {
    transition: transform 0.3s ease;
  }
  .bi:hover {
    transform: scale(1.2);
  }



/*SUMMARY BOXES*/
.border{
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5));
  box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.08);

}

/*responsive impovements*/
@media(max-width: 768px) {
  .employee-avatar {
    width: 35px;
    height: 35px;
    font-size: 0.75rem;
  }

  .btn-success {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
  }
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

.border-warning {
  border-color: #ffc107 !important;
}

.border-success {
  border-color: #198754 !important;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
}
</style>