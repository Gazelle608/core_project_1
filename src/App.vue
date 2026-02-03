<template>
  <div id="app">
    <!-- Navigation -->
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

          <div class="d-flex align-items-center ms-3">
            <router-link v-if="!isAuthenticated" class="nav-link text-white px-3 py-2" to="/login">Login</router-link>
            <button v-else class="btn btn-outline-light btn-sm" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main class="container-fluid py-4" style="min-height: calc(100vh - 140px);">
      <router-view />
    </main>
    
    <!-- Footer -->
    <footer class="mt-5 py-4 border-top" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-3 mb-lg-0">
            <div class="d-flex align-items-center">
              <i class="bi bi-building fs-5 text-primary me-2"></i>
              <div>
                <p class="mb-0 text-muted small">
                  <i class="bi bi-c-circle me-1"></i>
                  ModernTech Solutions HR System - Final Update
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-end gap-2 gap-lg-3">
              <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 small fw-normal border border-primary border-opacity-25">
                <i class="bi bi-code-slash me-1"></i>
                Module 1 Core Project
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from './stores'

export default {
  name: 'App',
  setup() {
    const { state, logout } = useStore()
    const isAuthenticated = computed(() => state.auth.isAuthenticated)
    const router = useRouter()

    const handleLogout = () => {
      logout()
      router.push('/login')
    }

    return { isAuthenticated, handleLogout }
  }
}
</script>

<style>
body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: #f8fafc;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  background-color: white;
  border-bottom: 1px solid #eef2f7;
  border-radius: 12px 12px 0 0 !important;
  padding: 1.25rem 1.5rem;
}

.table-hover tbody tr:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.625rem 1.5rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
</style>