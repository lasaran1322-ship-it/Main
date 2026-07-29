<template>
  <div id="app" class="app">
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="logo">
          <span class="logo-icon">🎨</span>
          Heritage Handicrafts
        </router-link>
        <div class="nav-menu">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/products" class="nav-link">Products</router-link>
          <router-link to="/artisans" class="nav-link">Artisans</router-link>
          <router-link to="/cart" class="nav-link cart-link">
            Cart <span class="cart-count" v-if="cartStore.itemCount > 0">{{ cartStore.itemCount }}</span>
          </router-link>
          <router-link to="/profile" class="nav-link" v-if="authStore.isAuthenticated">Profile</router-link>
          <router-link to="/login" class="nav-link login-btn" v-else>Login</router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>Heritage Handicrafts connects skilled Indian artisans with global customers, preserving cultural traditions while supporting local communities.</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><router-link to="/products">Products</router-link></li>
            <li><router-link to="/artisans">Artisans</router-link></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Contact</h3>
          <p>Email: hello@heritagecrafts.com</p>
          <p>Phone: +91-1234-567890</p>
        </div>
        <div class="footer-section">
          <h3>Follow Us</h3>
          <div class="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Heritage Handicrafts. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

onMounted(() => {
  authStore.loadFromStorage()
  cartStore.loadFromStorage()
})
</script>

<style>
:root {
  --primary-color: #d4a574;
  --primary-dark: #a0826d;
  --accent-color: #e8694a;
  --text-dark: #2c2416;
  --text-light: #7a7570;
  --light-bg: #f8f6f3;
  --border-color: #e8e3dd;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-dark);
  background-color: #fafaf8;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

/* Navbar Styles */
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-dark);
  text-decoration: none;
  transition: color 0.3s;
}

.logo:hover {
  color: var(--primary-color);
}

.logo-icon {
  font-size: 1.8rem;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--text-dark);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.router-link-active {
  color: var(--primary-color);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
}

.cart-link {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -10px;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.login-btn {
  background: var(--primary-color);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  transition: background 0.3s;
}

.login-btn:hover {
  background: var(--primary-dark);
  color: white;
}

/* Footer Styles */
.footer {
  background: var(--text-dark);
  color: #d0ccc8;
  margin-top: 4rem;
  padding: 3rem 1rem 1rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section h3 {
  color: white;
  margin-bottom: 1rem;
}

.footer-section p {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.75rem;
}

.footer-section a {
  color: #d0ccc8;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.footer-bottom {
  text-align: center;
  color: #8b8680;
  font-size: 0.9rem;
}

/* Global Styles */
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  color: var(--text-dark);
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #d4a574 0%, #a0826d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  text-align: center;
  color: var(--text-light);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

/* Grid Classes */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-3 {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.grid-4 {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* Card Component */
.card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
  padding: 1rem;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.card-body {
  padding: 1rem;
}

/* Button Styles */
.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  background: var(--primary-color);
  color: white;
}

.btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-block {
  width: 100%;
  display: block;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
}

.btn-secondary {
  background: var(--light-bg);
  color: var(--text-dark);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-state-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state-text {
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

/* Text Utilities */
.text-center {
  text-align: center;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

/* Responsive */
@media (max-width: 1024px) {
  .navbar-container {
    padding: 0 0.5rem;
  }

  .nav-menu {
    gap: 1.5rem;
  }

  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-4 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .navbar {
    height: auto;
  }

  .navbar-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0.5rem;
    height: auto;
  }

  .nav-menu {
    width: 100%;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link.router-link-active::after {
    display: none;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .grid-3 {
    grid-template-columns: 1fr;
  }

  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 1rem;
  }

  .nav-menu {
    gap: 0.75rem;
  }

  .nav-link {
    font-size: 0.85rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
