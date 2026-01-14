<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <i class="bi bi-building me-2"></i>
          <span class="fw-bold">ModernTech HR System</span>
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/" exact>
                <i class="bi bi-speedometer2 me-1"></i>
                Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/employees">
                <i class="bi bi-people me-1"></i>
                Employees
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/attendance">
                <i class="bi bi-calendar-check me-1"></i>
                Attendance
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/leaves">
                <i class="bi bi-calendar-event me-1"></i>
                Leave Request
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/payroll">
                <i class="bi bi-cash-stack me-1"></i>
                Payroll
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/performance">
                <i class="bi bi-graph-up me-1"></i>
                Performance
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <div class="container-fluid mt-4">
      <div class="row">
        <!-- Sidebar (Optional - can be hidden on mobile) -->
        <div class="col-lg-2 d-none d-lg-block">
          <div class="card mb-4">
            <div class="card-body">
              <h6 class="card-title text-muted mb-3">
                <i class="bi bi-menu-button me-1"></i>
                Quick Navigation
              </h6>
              <div class="list-group list-group-flush">
                <router-link to="/" class="list-group-item list-group-item-action border-0 py-2">
                  <i class="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </router-link>
                <router-link to="/employees" class="list-group-item list-group-item-action border-0 py-2">
                  <i class="bi bi-people me-2"></i>
                  Employee List
                </router-link>
                <router-link to="/attendance" class="list-group-item list-group-item-action border-0 py-2">
                  <i class="bi bi-calendar-check me-2"></i>
                  Mark Attendance
                </router-link>
                <router-link to="/leaves" class="list-group-item list-group-item-action border-0 py-2">
                  <i class="bi bi-calendar-event me-2"></i>
                  Leave Requests
                </router-link>
                <router-link to="/payroll" class="list-group-item list-group-item-action border-0 py-2">
                  <i class="bi bi-calculator me-2"></i>
                  Process Payroll
                </router-link>
                <router-link to="/performance" class="list-group-item list-group-item-action border-0 py-2">
                  <i class="bi bi-star me-2"></i>
                  Performance Reviews
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- System Status -->
          <div class="card">
            <div class="card-body">
              <h6 class="card-title text-muted mb-3">
                <i class="bi bi-info-circle me-1"></i>
                System Status
              </h6>
              <div class="small">
                <div class="d-flex justify-content-between mb-2">
                  <span>Employees Loaded:</span>
                  <span class="badge bg-success">{{ appState.employees.length }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Active Leaves:</span>
                  <span class="badge bg-warning">{{ pendingLeavesCount }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Data Source:</span>
                  <span class="badge bg-info">JSON Files</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="col-lg-10">
          <router-view></router-view>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="mt-5 py-3 bg-light border-top">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
            <p class="mb-0 text-muted small">
              <i class="bi bi-c-circle me-1"></i>
              ModernTech Solutions HR System - Proof of Concept
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0 text-muted small">
              Front-End Web Application | Module 1 Core Project
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      appState: {
        employees: [],
        attendance: [],
        leaveRequests: [],
        payroll: [],
        performanceData: []
      }
    }
  },
  computed: {
    pendingLeavesCount() {
      return this.appState.leaveRequests.filter(req => req.status === 'Pending').length
    }
  },
  provide() {
    // Provide appState and helper methods to all child components
    return {
      appState: this.appState,
      getEmployeeById: this.getEmployeeById,
      getPayrollRecord: this.getPayrollRecord,
      addLeaveRequest: this.addLeaveRequest,
      updateLeaveStatus: this.updateLeaveStatus,
      loadAllData: this.loadAllData
    }
  },
  methods: {
    getEmployeeById(id) {
      return this.appState.employees.find(emp => emp.employeeId === id)
    },
    getPayrollRecord(employeeId) {
      return this.appState.payroll.find(p => p.employeeId === employeeId)
    },
    addLeaveRequest(request) {
      this.appState.leaveRequests.push(request)
      return Promise.resolve(true)
    },
    updateLeaveStatus(requestId, newStatus) {
      const request = this.appState.leaveRequests.find(req => req.id === requestId)
      if (request) {
        request.status = newStatus
        return Promise.resolve(true)
      }
      return Promise.resolve(false)
    },
    async loadAllData() {
      try {
        // Load dummy data from JSON files or create sample data
        await this.loadSampleData()
        return true
      } catch (error) {
        console.error('Error loading data:', error)
        return false
      }
    },
    async loadSampleData() {
      // Sample employee data
      this.appState.employees = [
        {
          employeeId: 1001,
          name: "John Smith",
          department: "Development",
          position: "Senior Developer",
          salary: 85000,
          contact: "john.smith@moderntech.com",
          employmentHistory: "Joined in 2020, promoted to Senior Developer in 2023"
        },
        {
          employeeId: 1002,
          name: "Sarah Johnson",
          department: "HR",
          position: "HR Manager",
          salary: 75000,
          contact: "sarah.j@moderntech.com",
          employmentHistory: "HR Assistant (2019-2021), HR Manager (2021-Present)"
        },
        {
          employeeId: 1003,
          name: "Mike Chen",
          department: "Sales",
          position: "Sales Director",
          salary: 95000,
          contact: "mike.chen@moderntech.com",
          employmentHistory: "Sales Representative (2018-2020), Sales Director (2020-Present)"
        },
        {
          employeeId: 1004,
          name: "Lisa Williams",
          department: "Marketing",
          position: "Marketing Specialist",
          salary: 65000,
          contact: "lisa.w@moderntech.com",
          employmentHistory: "Marketing Intern (2022), Marketing Specialist (2023-Present)"
        },
        {
          employeeId: 1005,
          name: "David Brown",
          department: "QA",
          position: "QA Engineer",
          salary: 70000,
          contact: "david.b@moderntech.com",
          employmentHistory: "QA Analyst (2021-2022), QA Engineer (2023-Present)"
        }
      ]

      // Sample attendance data
      this.appState.attendance = [
        {
          employeeId: 1001,
          name: "John Smith",
          attendance: [
            { date: "2025-07-25", status: "Present" },
            { date: "2025-07-26", status: "Present" },
            { date: "2025-07-27", status: "Remote" },
            { date: "2025-07-28", status: "Present" }
          ]
        },
        {
          employeeId: 1002,
          name: "Sarah Johnson",
          attendance: [
            { date: "2025-07-25", status: "Present" },
            { date: "2025-07-26", status: "Present" },
            { date: "2025-07-27", status: "Present" },
            { date: "2025-07-28", status: "Sick Leave" }
          ]
        },
        {
          employeeId: 1003,
          name: "Mike Chen",
          attendance: [
            { date: "2025-07-25", status: "Present" },
            { date: "2025-07-26", status: "Late" },
            { date: "2025-07-27", status: "Present" },
            { date: "2025-07-28", status: "Present" }
          ]
        }
      ]

      // Sample leave requests
      this.appState.leaveRequests = [
        {
          id: 1,
          employeeId: 1001,
          employeeName: "John Smith",
          date: "2025-07-29",
          reason: "Vacation",
          status: "Pending"
        },
        {
          id: 2,
          employeeId: 1002,
          employeeName: "Sarah Johnson",
          date: "2025-07-28",
          reason: "Sick Leave",
          status: "Approved"
        },
        {
          id: 3,
          employeeId: 1003,
          employeeName: "Mike Chen",
          date: "2025-07-30",
          reason: "Personal",
          status: "Pending"
        },
        {
          id: 4,
          employeeId: 1004,
          employeeName: "Lisa Williams",
          date: "2025-07-27",
          reason: "Bereavement",
          status: "Approved"
        }
      ]

      // Sample payroll data
      this.appState.payroll = [
        {
          employeeId: 1001,
          hoursWorked: 160,
          leaveDeductions: 0,
          finalSalary: 85000
        },
        {
          employeeId: 1002,
          hoursWorked: 150,
          leaveDeductions: 2,
          finalSalary: 73000
        },
        {
          employeeId: 1003,
          hoursWorked: 170,
          leaveDeductions: 0,
          finalSalary: 95000
        },
        {
          employeeId: 1004,
          hoursWorked: 155,
          leaveDeductions: 1,
          finalSalary: 64000
        },
        {
          employeeId: 1005,
          hoursWorked: 165,
          leaveDeductions: 0,
          finalSalary: 70000
        }
      ]

      // Sample performance data
      this.appState.performanceData = [
        {
          id: 1,
          name: "John Smith",
          department: "Development",
          role: "Senior Developer",
          performanceScore: 92,
          comments: "Excellent technical skills and leadership qualities. Consistently delivers high-quality work ahead of deadlines.",
          strengths: "Problem-solving, mentoring junior developers, code quality",
          improvements: "Could improve documentation",
          goals: "Lead new project initiative, complete advanced certification"
        },
        {
          id: 2,
          name: "Sarah Johnson",
          department: "HR",
          role: "HR Manager",
          performanceScore: 88,
          comments: "Effective HR management and excellent employee relations. Has streamlined several HR processes.",
          strengths: "Employee engagement, process improvement, conflict resolution",
          improvements: "Could implement more data-driven HR metrics",
          goals: "Implement new HR software system, reduce onboarding time by 20%"
        },
        {
          id: 3,
          name: "Mike Chen",
          department: "Sales",
          role: "Sales Director",
          performanceScore: 95,
          comments: "Exceeded sales targets by 25%. Excellent client relationships and team leadership.",
          strengths: "Sales strategy, client acquisition, team motivation",
          improvements: "Cross-selling between departments could be improved",
          goals: "Expand into new market segment, increase team sales by 15%"
        },
        {
          id: 4,
          name: "Lisa Williams",
          department: "Marketing",
          role: "Marketing Specialist",
          performanceScore: 85,
          comments: "Creative campaigns with good ROI. Shows strong initiative and learning ability.",
          strengths: "Content creation, social media strategy, analytics",
          improvements: "Could be more proactive in campaign planning",
          goals: "Complete digital marketing certification, lead Q4 campaign"
        }
      ]
    }
  },
  mounted() {
    // Load data when app starts
    this.loadAllData()
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container-fluid {
  flex: 1;
}

/* Router link active state */
.router-link-active {
  font-weight: 600;
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.list-group-item.router-link-active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Card hover effects */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Button hover effects */
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}
</style>