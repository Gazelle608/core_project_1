import { reactive, readonly } from 'vue';
import DataService from '../services/DataService.js';

const state = reactive({
  employees: [],
  payrollData: [],
  attendanceData: [],
  leaveRequests: [],
  selectedEmployee: null,
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

  return {
    state: readonly(state), // Readonly to prevent direct mutations outside
    setSelectedEmployee,
    addEmployee,
    // Other actions...
  };
};