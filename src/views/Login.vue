<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Heritage Handicrafts account</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="you@example.com"
              required
            >
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="••••••••"
              required
            >
          </div>

          <div class="form-check">
            <input 
              v-model="form.rememberMe" 
              type="checkbox" 
              id="remember"
            >
            <label for="remember">Remember me</label>
          </div>

          <button type="submit" class="btn btn-lg btn-block login-btn">
            Sign In
          </button>
        </form>

        <div class="divider">
          <span>OR</span>
        </div>

        <div class="social-login">
          <button class="social-btn google">
            <span>🔍</span> Google
          </button>
          <button class="social-btn facebook">
            <span>👤</span> Facebook
          </button>
        </div>

        <p class="auth-footer">
          Don't have an account? 
          <router-link to="/register" class="auth-link">Sign up here</router-link>
        </p>

        <p class="forgot-password">
          <router-link to="/forgot-password" class="auth-link">Forgot your password?</router-link>
        </p>
      </div>

      <div class="auth-benefits">
        <h3>Why Create an Account?</h3>
        <ul>
          <li>✓ Track your orders</li>
          <li>✓ Save favorite products</li>
          <li>✓ Faster checkout</li>
          <li>✓ Exclusive offers</li>
          <li>✓ Support artisans directly</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const handleLogin = () => {
  if (!form.value.email || !form.value.password) {
    alert('Please fill in all fields')
    return
  }

  // Simulate login
  const userData = {
    id: Date.now(),
    email: form.value.email,
    name: form.value.email.split('@')[0],
    avatar: '👤'
  }

  authStore.login(userData)
  alert(`Welcome back, ${userData.name}!`)
  router.push('/')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f6f3 0%, #f0ebe5 100%);
  padding: 2rem;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 900px;
  width: 100%;
}

.auth-card {
  padding: 2.5rem !important;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: var(--text-light);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check input {
  width: auto;
  accent-color: var(--primary-color);
}

.form-check label {
  cursor: pointer;
  font-size: 0.95rem;
  margin: 0;
}

.login-btn {
  background: var(--primary-color);
  color: white;
  font-weight: 600;
  margin-top: 0.5rem;
}

.login-btn:hover {
  background: #c9952f;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: var(--text-light);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.social-btn:hover {
  border-color: var(--primary-color);
  background: var(--light-bg);
}

.auth-footer {
  text-align: center;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

.forgot-password {
  text-align: center;
  font-size: 0.9rem;
}

.auth-benefits {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid var(--border-color);
}

.auth-benefits h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.auth-benefits ul {
  list-style: none;
  padding: 0;
}

.auth-benefits li {
  padding: 0.75rem 0;
  color: var(--text-dark);
  font-size: 0.95rem;
  border-bottom: 1px solid var(--border-color);
}

.auth-benefits li:last-child {
  border-bottom: none;
}

@media (max-width: 1024px) {
  .auth-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .auth-benefits {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-card {
    padding: 1.5rem !important;
  }

  .auth-header h1 {
    font-size: 1.5rem;
  }

  .social-login {
    grid-template-columns: 1fr;
  }
}
</style>
