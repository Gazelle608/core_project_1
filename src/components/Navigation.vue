<template>
  <nav class="navbar navbar-expand-lg navbar-dark modern-navbar">
    <div class="container-fluid">
      <router-link class="navbar-brand modern-brand" to="/">
        <i class="bi bi-building me-2"></i>
        <span class="brand-text">ModernTech HR</span>
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link nav-hover" to="/" exact-active-class="active">
              <i class="bi bi-speedometer2 me-1"></i>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-hover" to="/employees" active-class="active">
              <i class="bi bi-people me-1"></i>
              <span>Employees</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-hover" to="/payroll" active-class="active">
              <i class="bi bi-cash-coin me-1"></i>
              <span>Payroll</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-hover" to="/leaves" active-class="active">
              <i class="bi bi-calendar-event me-1"></i>
              <span>Time Off</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-hover" to="/performance" active-class="active">
              <i class="bi bi-graph-up me-1"></i>
              <span>Performance</span>
            </router-link>
          </li>
        </ul>
        
        <!-- User info -->
        <div class="user-section">
          <div class="user-info">
            <div class="user-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="user-details">
              <span class="user-welcome">Welcome back,</span>
              <span class="user-name">HR Manager</span>
            </div>
          </div>
          <button class="logout-btn" @click="logout">
            <i class="bi bi-box-arrow-right me-1"></i>
            <span>Logout</span>
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
      
      // Show message with modern alert style
      this.showLogoutNotification();
      
      // Redirect to login page
      this.$router.push('/login');
    },
    showLogoutNotification() {
      // Create a custom notification
      const notification = document.createElement('div');
      notification.className = 'logout-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <i class="bi bi-check-circle-fill me-2"></i>
          <span>You have been successfully logged out</span>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 3000);
    }
  }
}
</script>

<style scoped>
/* Modern Gradient Background */
.modern-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  position: relative;
  z-index: 1000;
}

/* Brand Styling */
.modern-brand {
  font-weight: 700;
  font-size: 1.5rem;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.modern-brand:hover {
  transform: translateY(-2px);
}

.brand-text {
  background: linear-gradient(to right, #ffffff, #e6e6e6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Navigation Items */
.nav-hover {
  border-radius: 8px;
  margin: 0 4px;
  padding: 0.5rem 1rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.nav-hover:before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(to right, #00d2ff, #3a7bd5);
  transition: width 0.3s ease;
}

.nav-hover:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-hover:hover:before {
  width: 100%;
}

.nav-hover.active {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  position: relative;
}

.nav-hover.active:before {
  width: 100%;
  background: linear-gradient(to right, #00d2ff, #3a7bd5);
}

.nav-hover i {
  font-size: 1.1rem;
  margin-right: 8px;
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-left: 1.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.user-avatar i {
  font-size: 1.5rem;
  color: white;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-welcome {
  font-size: 0.75rem;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.9);
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
}

/* Logout Button */
.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logout-btn:active {
  transform: translateY(0);
}

/* Logout Notification */
.logout-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  animation: slideIn 0.5s ease forwards;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.notification-content {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.notification-content i {
  font-size: 1.2rem;
}

.fade-out {
  animation: fadeOut 0.5s ease forwards;
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Responsive Design */
@media (max-width: 992px) {
  .user-section {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1rem 0 0 0;
    margin-top: 1rem;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .user-info {
    justify-content: center;
    width: 100%;
  }
  
  .logout-btn {
    width: 100%;
    justify-content: center;
  }
  
  .nav-hover {
    margin: 2px 0;
  }
  
  .navbar-collapse {
    padding: 1rem 0;
  }
}

@media (max-width: 576px) {
  .modern-brand {
    font-size: 1.25rem;
  }
  
  .brand-text {
    font-size: 1.25rem;
  }
}
</style>