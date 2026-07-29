<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-benefits">
        <h3>Join Our Community</h3>
        <ul>
          <li>✓ Discover authentic Indian crafts</li>
          <li>✓ Support talented artisans</li>
          <li>✓ Exclusive member benefits</li>
          <li>✓ Early access to new products</li>
          <li>✓ Personalized recommendations</li>
        </ul>
      </div>

      <div class="auth-card card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join Heritage Handicrafts today</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label>Full Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="John Doe"
              required
            >
          </div>

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

          <div class="form-group">
            <label>Confirm Password</label>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="••••••••"
              required
            >
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              placeholder="+1-234-567-8900"
            >
          </div>

          <div class="form-check">
            <input 
              v-model="form.terms" 
              type="checkbox" 
              id="terms"
              required
            >
            <label for="terms">
              I agree to the 
              <router-link to="/terms" class="auth-link">Terms of Service</router-link>
              and 
              <router-link to="/privacy" class="auth-link">Privacy Policy</router-link>
            </label>
          </div>

          <div class="form-check">
            <input 
              v-model="form.newsletter" 
              type="checkbox" 
              id="newsletter"
            >
            <label for="newsletter">Subscribe to our newsletter for exclusive offers</label>
          </div>

          <button type="submit" class="btn btn-lg btn-block register-btn">
            Create Account
          </button>
        </form>

        <p class="auth-footer">
          Already have an account? 
          <router-link to="/login" class="auth-link">Sign in here</router-link>
        </p>
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  terms: false,
  newsletter: false
})

const handleRegister = () => {
  // Validation
  if (!form.value.name || !form.value.email || !form.value.password) {
    alert('Please fill in all required fields')
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }

  if (form.value.password.length < 6) {
    alert('Password must be at least 6 characters long')
    return
  }

  if (!form.value.terms) {
    alert('You must agree to the Terms of Service')
    return
  }

  // Simulate registration
  const userData = {
    id: Date.now(),
    email: form.value.email,
    name: form.value.name,
    phone: form.value.phone,
    newsletter: form.value.newsletter,
    avatar: '👤'
  }

  authStore.register(userData)
  alert(`Welcome, ${userData.name}! Your account has been created.`)
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

.auth-benefits {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  height: fit-content;
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
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.form-check input {
  width: auto;
  accent-color: var(--primary-color);
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.form-check label {
  cursor: pointer;
  margin: 0;
  line-height: 1.4;
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

.register-btn {
  background: var(--primary-color);
  color: white;
  font-weight: 600;
  margin-top: 0.5rem;
}

.register-btn:hover {
  background: #c9952f;
}

.auth-footer {
  text-align: center;
  font-size: 0.95rem;
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

  .form-check {
    font-size: 0.85rem;
  }
}
</style>
