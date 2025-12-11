// DataService.js - Updated to ensure all data is loaded
export default {
  // Load employee data from employee_info.json
  async fetchEmployees() {
    try {
      const response = await fetch('/data/employee_info.json')
      const data = await response.json()
      console.log('📋 Employee data loaded:', data.employeeInformation?.length || 0, 'employees')
      return data.employeeInformation || []
    } catch (error) {
      console.error('❌ Error fetching employees:', error)
      return this.getFallbackEmployees()
    }
  },
  
  // Load payroll data from payroll_data.json
  async fetchPayroll() {
    try {
      const response = await fetch('/data/payroll_data.json')
      const data = await response.json()
      console.log('💰 Payroll data loaded:', data.payrollData?.length || 0, 'records')
      return data.payrollData || []
    } catch (error) {
      console.error('❌ Error fetching payroll:', error)
      return this.getFallbackPayroll()
    }
  },
  
  // Load attendance data from attendance.json
  async fetchAttendance() {
    try {
      const response = await fetch('/data/attendance.json')
      const data = await response.json()
      console.log('📅 Attendance data loaded:', data.attendanceAndLeave?.length || 0, 'records')
      
      // Your attendance.json has the data directly in attendanceAndLeave array
      return data.attendanceAndLeave || []
    } catch (error) {
      console.error('❌ Error fetching attendance:', error)
      return this.getFallbackAttendance()
    }
  },
  
  // Get performance data - updated with all 6 employees
  getPerformanceData() {
    return [
      {
        name: "Sibongile Nkosi",
        role: "Software Engineer",
        performanceScore: 80,
        comments: "Consistently shows strong problem-solving skills."
      },
      {
        name: "Lungile Moyo",
        role: "HR Manager",
        performanceScore: 92,
        comments: "Great leadership skills"
      },
      {
        name: "Thabo Molefe",
        role: "Quality Analyst",
        performanceScore: 88,
        comments: "Feedback is always specific, balanced, and directly ties to improving agent performance and customer satisfaction."
      },
      {
        name: "Keshav Naidoo",
        role: "Sales Representative",
        performanceScore: 80,
        comments: "You have shown a remarkable level of responsibility and dependability, especially in challenging situations."
      },
      {
        name: "Zanele Khumalo",
        role: "Marketing Specialist",
        performanceScore: 16,
        comments: "Poor campaign execution and lack of strategic thinking"
      },
      {
        name: "Sipho Zulu",
        role: "UI/UX Designer",
        performanceScore: 88,
        comments: "Website is customer and employee friendly and interactive."
      }
    ]
  },
  
  // Extract leave requests from attendance data
  getLeaveRequestsFromAttendance(attendanceData) {
    const leaveRequests = []
    
    attendanceData.forEach(emp => {
      if (emp.leaveRequests && Array.isArray(emp.leaveRequests)) {
        emp.leaveRequests.forEach(req => {
          leaveRequests.push({
            employeeId: emp.employeeId,
            employeeName: emp.name,
            date: req.date,
            reason: req.reason,
            status: req.status,
            id: `${emp.employeeId}-${req.date}-${Date.now()}`
          })
        })
      }
    })
    
    console.log('📋 Extracted leave requests:', leaveRequests.length)
    return leaveRequests
  },
  
  // Fallback data methods - updated with all 10 employees
  getFallbackEmployees() {
    return [
      {
        employeeId: 1,
        name: "Sibongile Nkosi",
        position: "Software Engineer",
        department: "Development",
        salary: 70000,
        employmentHistory: "Joined in 2015, promoted to Senior in 2018",
        contact: "sibongile.nkosi@moderntech.com"
      },
      {
        employeeId: 2,
        name: "Lungile Moyo",
        position: "HR Manager",
        department: "HR",
        salary: 80000,
        employmentHistory: "Joined in 2013, promoted to Manager in 2017",
        contact: "lungile.moyo@moderntech.com"
      },
      {
        employeeId: 3,
        name: "Thabo Molefe",
        position: "Quality Analyst",
        department: "QA",
        salary: 55000,
        employmentHistory: "Joined in 2018",
        contact: "thabo.molefe@moderntech.com"
      },
      {
        employeeId: 4,
        name: "Keshav Naidoo",
        position: "Sales Representative",
        department: "Sales",
        salary: 60000,
        employmentHistory: "Joined in 2020",
        contact: "keshav.naidoo@moderntech.com"
      },
      {
        employeeId: 5,
        name: "Zanele Khumalo",
        position: "Marketing Specialist",
        department: "Marketing",
        salary: 58000,
        employmentHistory: "Joined in 2019",
        contact: "zanele.khumalo@moderntech.com"
      },
      {
        employeeId: 6,
        name: "Sipho Zulu",
        position: "UI/UX Designer",
        department: "Design",
        salary: 65000,
        employmentHistory: "Joined in 2016",
        contact: "sipho.zulu@moderntech.com"
      },
      {
        employeeId: 7,
        name: "Naledi Moeketsi",
        position: "DevOps Engineer",
        department: "IT",
        salary: 72000,
        employmentHistory: "Joined in 2017",
        contact: "naledi.moeketsi@moderntech.com"
      },
      {
        employeeId: 8,
        name: "Farai Gumbo",
        position: "Content Strategist",
        department: "Marketing",
        salary: 56000,
        employmentHistory: "Joined in 2021",
        contact: "farai.gumbo@moderntech.com"
      },
      {
        employeeId: 9,
        name: "Karabo Dlamini",
        position: "Accountant",
        department: "Finance",
        salary: 62000,
        employmentHistory: "Joined in 2018",
        contact: "karabo.dlamini@moderntech.com"
      },
      {
        employeeId: 10,
        name: "Fatima Patel",
        position: "Customer Support Lead",
        department: "Support",
        salary: 58000,
        employmentHistory: "Joined in 2016",
        contact: "fatima.patel@moderntech.com"
      }
    ]
  },
  
  getFallbackPayroll() {
    return [
      {
        employeeId: 1,
        hoursWorked: 160,
        leaveDeductions: 8,
        finalSalary: 69500
      },
      {
        employeeId: 2,
        hoursWorked: 150,
        leaveDeductions: 10,
        finalSalary: 79000
      },
      {
        employeeId: 3,
        hoursWorked: 170,
        leaveDeductions: 4,
        finalSalary: 54800
      },
      {
        employeeId: 4,
        hoursWorked: 165,
        leaveDeductions: 6,
        finalSalary: 59700
      },
      {
        employeeId: 5,
        hoursWorked: 158,
        leaveDeductions: 5,
        finalSalary: 57850
      },
      {
        employeeId: 6,
        hoursWorked: 168,
        leaveDeductions: 2,
        finalSalary: 64800
      },
      {
        employeeId: 7,
        hoursWorked: 175,
        leaveDeductions: 3,
        finalSalary: 71800
      },
      {
        employeeId: 8,
        hoursWorked: 160,
        leaveDeductions: 0,
        finalSalary: 56000
      },
      {
        employeeId: 9,
        hoursWorked: 155,
        leaveDeductions: 5,
        finalSalary: 61500
      },
      {
        employeeId: 10,
        hoursWorked: 162,
        leaveDeductions: 4,
        finalSalary: 57750
      }
    ]
  },
  
  getFallbackAttendance() {
    return [
      {
        employeeId: 1,
        name: "Sibongile Nkosi",
        attendance: [
          { date: "2025-07-25", status: "Present" },
          { date: "2025-07-26", status: "Absent" },
          { date: "2025-07-27", status: "Present" },
          { date: "2025-07-28", status: "Present" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2025-07-22", reason: "Sick Leave", status: "Approved" },
          { date: "2024-12-01", reason: "Personal", status: "Pending" }
        ]
      },
      {
        employeeId: 2,
        name: "Lungile Moyo",
        attendance: [
          { date: "2025-07-25", status: "Present" },
          { date: "2025-07-26", status: "Present" },
          { date: "2025-07-27", status: "Absent" },
          { date: "2025-07-28", status: "Present" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2025-07-15", reason: "Family Responsibility", status: "Denied" },
          { date: "2024-12-02", reason: "Vacation", status: "Approved" }
        ]
      },
      {
        employeeId: 3,
        name: "Thabo Molefe",
        attendance: [
          { date: "2025-07-25", status: "Present" },
          { date: "2025-07-26", status: "Present" },
          { date: "2025-07-27", status: "Present" },
          { date: "2025-07-28", status: "Absent" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2025-07-10", reason: "Medical Appointment", status: "Approved" },
          { date: "2024-12-05", reason: "Personal", status: "Pending" }
        ]
      },
      {
        employeeId: 4,
        name: "Keshav Naidoo",
        attendance: [
          { date: "2025-07-25", status: "Absent" },
          { date: "2025-07-26", status: "Present" },
          { date: "2025-07-27", status: "Present" },
          { date: "2025-07-28", status: "Present" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2025-07-20", reason: "Bereavement", status: "Approved" }
        ]
      },
      {
        employeeId: 5,
        name: "Zanele Khumalo",
        attendance: [
          { date: "2025-07-25", status: "Present" },
          { date: "2025-07-26", status: "Present" },
          { date: "2025-07-27", status: "Absent" },
          { date: "2025-07-28", status: "Present" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2024-12-01", reason: "Childcare", status: "Pending" }
        ]
      },
      {
        employeeId: 6,
        name: "Sipho Zulu",
        attendance: [
          { date: "2025-07-25", status: "Present" },
          { date: "2025-07-26", status: "Present" },
          { date: "2025-07-27", status: "Absent" },
          { date: "2025-07-28", status: "Present" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2025-07-18", reason: "Sick Leave", status: "Approved" }
        ]
      },
      {
        employeeId: 7,
        name: "Naledi Moeketsi",
        attendance: [
          { date: "2025-07-25", status: "Present" },
          { date: "2025-07-26", status: "Present" },
          { date: "2025-07-27", status: "Present" },
          { date: "2025-07-28", status: "Absent" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2025-07-22", reason: "Vacation", status: "Pending" }
        ]
      },
      {
        employeeId: 8,
        name: "Farai Gumbo",
        attendance: [
          { date: "2025-07-25", status: "Present" },
          { date: "2025-07-26", status: "Absent" },
          { date: "2025-07-27", status: "Present" },
          { date: "2025-07-28", status: "Present" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2024-12-02", reason: "Medical Appointment", status: "Approved" }
        ]
      },
      {
        employeeId: 9,
        name: "Karabo Dlamini",
        attendance: [
          { date: "2025-07-25", status: "Present" },
          { date: "2025-07-26", status: "Present" },
          { date: "2025-07-27", status: "Present" },
          { date: "2025-07-28", status: "Absent" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2025-07-19", reason: "Childcare", status: "Denied" }
        ]
      },
      {
        employeeId: 10,
        name: "Fatima Patel",
        attendance: [
          { date: "2025-07-25", status: "Present" },
          { date: "2025-07-26", status: "Present" },
          { date: "2025-07-27", status: "Absent" },
          { date: "2025-07-28", status: "Present" },
          { date: "2025-07-29", status: "Present" }
        ],
        leaveRequests: [
          { date: "2024-12-03", reason: "Vacation", status: "Pending" }
        ]
      }
    ]
  }
}