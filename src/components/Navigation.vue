<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">ModernTech HR</router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/employees" active-class="active">Employees</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/payroll" active-class="active">Payroll</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/attendance" active-class="active">Atendance</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/leaves" active-class="active">Time Off</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/performance" active-class="active">Performance</router-link>
          </li>
        </ul>
        <!-- User info -->
        <div class="navbar-text">
          <span class="me-3">Welcome, HR Manager!</span>
          <button class="btn btn-outline-light btn-sm" @click="logout">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  methods: {
    logout() {
      // Remove login status
      localStorage.removeItem('hr_logged_in');
      
      // Show message
      alert('You have been logged out');
      
      // Redirect to login page
      this.$router.push('/login');
    }
  }
}
</script>