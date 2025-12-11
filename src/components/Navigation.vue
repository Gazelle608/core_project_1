<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">ModernTech HR</router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav">
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
            <router-link class="nav-link" to="/attendance" active-class="active">Attendance</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/leaves" active-class="active">Time Off</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/performance" active-class="active">Performance</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation'
}
</script>