<template>
  <div class="login-page">
    <div class="login-panel">
      <div class="login-left">
        <div class="welcome">
          <h1>Welcome!</h1>
          <p class="lead">Sign in to continue to the ModernTech HR management portal</p>
          <p class="muted">Enter your credentials to access the dashboard and manage employees, attendance and payroll.</p>
        </div>
      </div>

      <div class="login-right">
        <div class="signin-box">
          <h4 class="mb-3">Sign in</h4>
          <p class="small text-white-50 mb-3">Use the credentials provided by the instructor</p>

          <div v-if="error" class="alert alert-danger small">{{ error }}</div>

          <form @submit.prevent="onSubmit" class="d-grid gap-3">
            <input v-model="username" placeholder="Username" class="form-control input-ghost" autocomplete="username" required />
            <input type="password" v-model="password" placeholder="Password" class="form-control input-ghost" autocomplete="current-password" required />

            <button class="btn btn-primary btn-signin" type="submit">Sign in</button>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../stores'

export default {
  name: 'Login',
  setup() {
    const username = ref('')
    const password = ref('')
    const router = useRouter()
    const { state, login } = useStore()
    const error = ref(null)

    const onSubmit = () => {
      const ok = login(username.value, password.value)
      if (ok) {
        router.push('/')
      } else {
        error.value = state.auth.error
      }
    }

    return { username, password, onSubmit, error }
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-panel {
  width: 100%;
  max-width: 1100px;
  display: flex;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.25);
}

.login-left {
  flex: 1 1 60%;
  padding: 3.5rem 2.5rem;
  color: white;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%);
}

.welcome h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.welcome .lead {
  color: rgba(255,255,255,0.95);
  margin-bottom: 0.5rem;
}

.welcome .muted {
  color: rgba(255,255,255,0.75);
}

.login-right {
  width: 420px;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(6px);
  padding: 2.25rem;
  display: flex;
  align-items: center;
}

.signin-box h4 {
  color: #fff;
  margin-bottom: 0.25rem;
}

.input-ghost {
  background: rgba(255,255,255,0.08);
  border: none;
  color: #fff;
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
}

.input-ghost::placeholder {
  color: rgba(255,255,255,0.6);
}

.btn-signin {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-weight: 600;
}

.alert {
  padding: 0.45rem 0.75rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .login-panel { flex-direction: column; }
  .login-right { width: 100%; }
  .login-left { padding: 2rem; text-align: center; }
  .welcome h1 { font-size: 2.25rem; }
}
</style>