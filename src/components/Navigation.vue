<template>
  <nav class="navbar navbar-expand-lg navbar-dark shadow-lg py-2" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center gap-3" to="/">
        <div class="bg-white bg-opacity-20 rounded-circle p-2">
          <i class="bi bi-building text-white"></i>
        </div>
        <div class="d-none d-md-block">
          <h1 class="fs-5 fw-bold text-white mb-0">ModernTech HR</h1>
          <div class="small text-white-50 opacity-75">Management Portal</div>
        </div>
      </router-link>
      
      <button class="navbar-toggler border-0 p-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto gap-1">
          <router-link class="nav-link text-white px-3 py-2 d-flex align-items-center rounded-2" to="/" exact active-class="active bg-white bg-opacity-25">
            <i class="bi bi-speedometer2 me-2"></i>
            <span>Dashboard</span>
          </router-link>
          <router-link class="nav-link text-white px-3 py-2 d-flex align-items-center rounded-2" to="/employees" active-class="active bg-white bg-opacity-25">
            <i class="bi bi-people me-2"></i>
            <span>Employees</span>
          </router-link>
          <router-link class="nav-link text-white px-3 py-2 d-flex align-items-center rounded-2" to="/attendance" active-class="active bg-white bg-opacity-25">
            <i class="bi bi-calendar-check me-2"></i>
            <span>Attendance</span>
          </router-link>
          <router-link class="nav-link text-white px-3 py-2 d-flex align-items-center rounded-2" to="/leaves" active-class="active bg-white bg-opacity-25">
            <i class="bi bi-calendar-event me-2"></i>
            <span>Leave Requests</span>
          </router-link>
          <router-link class="nav-link text-white px-3 py-2 d-flex align-items-center rounded-2" to="/payroll" active-class="active bg-white bg-opacity-25">
            <i class="bi bi-cash-stack me-2"></i>
            <span>Payroll</span>
          </router-link>
          <router-link class="nav-link text-white px-3 py-2 d-flex align-items-center rounded-2" to="/performance" active-class="active bg-white bg-opacity-25">
            <i class="bi bi-graph-up me-2"></i>
            <span>Performance</span>
          </router-link>
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
      localStorage.removeItem('hr_logged_in');
      alert('You have been logged out');
      this.$router.push('/login');
    }
  }
}
</script>