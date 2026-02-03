import { reactive, readonly } from 'vue';
import DataService from '../services/DataService.js';

// Hardcoded credenrials for frontend project
const HARDCODED_USER = { username: 'admin', password: 'admin123', name: 'Admin User'};

const state = reactive({
  employees: [],
  payrollData: [],
  attendanceData: [],
  leaveRequests: [],
  selectedEmployee: null,
  scheduledReviews: [],
  auth: {
    user: null,
    isAuthenticated: false,
    error: null
  }
});

const dataService = DataService;

export const useStore = () => {
  // Initialize data
  if (state.employees.length === 0) {
    state.employees = dataService.getAllEmployees();
    state.payrollData = dataService.payroll;
    state.attendanceData = dataService.attendance;
    state.leaveRequests = dataService.leaveRequests;
  }

  const setSelectedEmployee = (id) => {
    state.selectedEmployee = state.employees.find(emp => emp.employeeId === id);
  };

  const addEmployee = (employee) => {
    state.employees.push(employee);
  };

  // Authentication helpers (frontend-only, hardcoded credentials)
  const login = (username, password) => {
    if (username === HARDCODED_USER.username && password === HARDCODED_USER.password) {
      state.auth.user = { username: HARDCODED_USER.username, name: HARDCODED_USER.name };
      state.auth.isAuthenticated = true;
      state.auth.error = null;
      return true;
    }
    state.auth.error = 'Invalid credentials';
    return false;
  };

  const logout = () => {
    state.auth.user = null;
    state.auth.isAuthenticated = false;
    state.auth.error = null;
  };

  // Update helpers
  const updateEmployee = (id, updates) => {
    const idx = state.employees.findIndex(e => e.employeeId === id)
    if (idx !== -1) {
      state.employees[idx] = { ...state.employees[idx], ...updates }
    }
  }

  const createLeaveRequest = ({ employeeId, date, reason }) => {
    const req = { employeeId, employeeName: state.employees.find(e => e.employeeId === employeeId)?.name || 'Unknown', date, reason, status: 'Pending' }
    state.leaveRequests.push(req)
    // Also add to attendanceData for consistency
    const att = state.attendanceData.find(a => a.employeeId === employeeId)
    if (att) {
      att.leaveRequests = att.leaveRequests || []
      att.leaveRequests.push({ date, reason, status: 'Pending' })
    }
    return req
  }

  const approveLeave = ({ employeeId, date }) => {
    const req = state.leaveRequests.find(r => r.employeeId === employeeId && r.date === date)
    if (req) req.status = 'Approved'
  }

  const denyLeave = ({ employeeId, date }) => {
    const req = state.leaveRequests.find(r => r.employeeId === employeeId && r.date === date)
    if (req) req.status = 'Denied'
  }

  const markPresent = (employeeId) => {
    const att = state.attendanceData.find(a => a.employeeId === employeeId)
    const today = new Date().toISOString().slice(0,10)
    if (att) {
      att.attendance = att.attendance || []
      att.attendance.push({ date: today, status: 'Present' })
    }
  }

  const markAbsent = (employeeId) => {
    const att = state.attendanceData.find(a => a.employeeId === employeeId)
    const today = new Date().toISOString().slice(0,10)
    if (att) {
      att.attendance = att.attendance || []
      att.attendance.push({ date: today, status: 'Absent' })
    }
  }

  const updatePayroll = (employeeId, updates) => {
    const idx = state.payrollData.findIndex(p => p.employeeId === employeeId)
    if (idx !== -1) {
      state.payrollData[idx] = { ...state.payrollData[idx], ...updates }
    }
    return state.payrollData[idx]
  }

  const processPayroll = () => {
    // Recalculate final salary based on base salary, hours worked and deductions
    state.payrollData = state.payrollData.map(p => {
      const emp = state.employees.find(e => e.employeeId === p.employeeId)
      const base = emp ? emp.salary : 0
      const hourly = base / 160
      const finalSalary = Math.max(0, Math.round(base * (p.hoursWorked / 160) - (p.leaveDeductions * hourly)))
      return { ...p, finalSalary }
    })
  }

  const exportPayrollCSV = () => {
    // Return CSV string (to be downloaded by component)
    const headers = ['employeeId,employeeName,department,baseSalary,hoursWorked,leaveDeductions,finalSalary']
    const rows = state.payrollData.map(p => {
      const emp = state.employees.find(e => e.employeeId === p.employeeId) || {}
      return [p.employeeId, emp.name || '', emp.department || '', emp.salary || 0, p.hoursWorked, p.leaveDeductions, p.finalSalary].join(',')
    })
    return headers.concat(rows).join('\n')
  }

  const scheduleReview = ({ employeeId, date }) => {
    state.scheduledReviews.push({ employeeId, date })
  }

  return {
    state: readonly(state), // Readonly to prevent direct mutations outside
    setSelectedEmployee,
    addEmployee,
    updateEmployee,
    createLeaveRequest,
    approveLeave,
    denyLeave,
    markPresent,
    markAbsent,
    processPayroll,
    exportPayrollCSV,
    scheduleReview,
    login,
    logout,
    // Other actions...
  };
};