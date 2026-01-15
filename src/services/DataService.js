import employeeData from '../data/employee_info.json'
import payrollData from '../data/payroll_data.json'
import attendanceData from '../data/attendance.json'

class DataService {
  constructor() {
    this.employees = employeeData.employeeInformation
    this.payroll = payrollData.payrollData
    this.attendance = attendanceData.attendanceAndLeave
    
    // Extract leave requests from attendance data
    this.leaveRequests = this.attendance.flatMap(emp => 
      emp.leaveRequests.map(req => ({
        ...req,
        employeeId: emp.employeeId,
        employeeName: emp.name
      }))
    )
  }

  getAllEmployees() {
    return this.employees
  }

  getEmployeeById(id) {
    return this.employees.find(emp => emp.employeeId === id)
  }

  getPayrollData() {
    return this.payroll
  }

  getPayrollByEmployeeId(id) {
    return this.payroll.find(p => p.employeeId === id)
  }

  getAttendanceData() {
    return this.attendance
  }

  getLeaveRequests() {
    return this.leaveRequests
  }

  getLeaveRequestsByEmployeeId(id) {
    return this.leaveRequests.filter(req => req.employeeId === id)
  }

  getAttendanceByEmployeeId(id) {
    return this.attendance.find(a => a.employeeId === id)
  }

  // Performance data (simulated from other data)
  getPerformanceData() {
    return this.employees.map(emp => {
      const payroll = this.getPayrollByEmployeeId(emp.employeeId)
      const attendance = this.getAttendanceByEmployeeId(emp.employeeId)
      const leaves = this.getLeaveRequestsByEmployeeId(emp.employeeId)
      
      // Calculate performance score based on various factors
      const presentDays = attendance?.attendance?.filter(a => a.status === 'Present').length || 0
      const totalDays = attendance?.attendance?.length || 1
      const attendanceRate = (presentDays / totalDays) * 100
      
      const approvedLeaves = leaves?.filter(l => l.status === 'Approved').length || 0
      const pendingLeaves = leaves?.filter(l => l.status === 'Pending').length || 0
      
      // Simple performance calculation
      let score = 70 // Base score
      score += attendanceRate * 0.2 // Attendance contributes 20%
      score -= pendingLeaves * 5 // Pending leaves reduce score
      score += approvedLeaves * 2 // Approved leaves slightly increase
      
      // Ensure score is between 0-100
      score = Math.max(0, Math.min(100, Math.round(score)))
      
      return {
        employeeId: emp.employeeId,
        name: emp.name,
        department: emp.department,
        position: emp.position,
        attendanceRate,
        pendingLeaves,
        approvedLeaves,
        performanceScore: score,
        rating: score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : score >= 70 ? 'Average' : 'Needs Improvement'
      }
    })
  }
}

export default new DataService()