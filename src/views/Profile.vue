<template>
  <div v-if="authStore.isAuthenticated" class="profile-page">
    <h1 class="section-title">My Account</h1>

    <div class="profile-layout">
      <aside class="profile-sidebar card">
        <div class="profile-header">
          <div class="profile-avatar">{{ authStore.user.avatar }}</div>
          <div class="profile-info">
            <h2>{{ authStore.user.name }}</h2>
            <p class="email">{{ authStore.user.email }}</p>
          </div>
        </div>

        <nav class="profile-nav">
          <button 
            @click="activeTab = 'overview'"
            :class="['nav-item', { active: activeTab === 'overview' }]"
          >
            📊 Overview
          </button>
          <button 
            @click="activeTab = 'orders'"
            :class="['nav-item', { active: activeTab === 'orders' }]"
          >
            📦 Orders
          </button>
          <button 
            @click="activeTab = 'wishlist'"
            :class="['nav-item', { active: activeTab === 'wishlist' }]"
          >
            ❤️ Wishlist
          </button>
          <button 
            @click="activeTab = 'settings'"
            :class="['nav-item', { active: activeTab === 'settings' }]"
          >
            ⚙️ Settings
          </button>
          <button 
            @click="activeTab = 'support'"
            :class="['nav-item', { active: activeTab === 'support' }]"
          >
            💬 Support
          </button>
        </nav>

        <button @click="logout" class="btn btn-danger btn-block">
          Sign Out
        </button>
      </aside>

      <main class="profile-main">
        <!-- Overview Tab -->
        <section v-if="activeTab === 'overview'" class="card">
          <h2>Account Overview</h2>
          
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-icon">📦</span>
              <span class="stat-value">{{ orders.length }}</span>
              <span class="stat-label">Orders</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">💰</span>
              <span class="stat-value">${{ totalSpent }}</span>
              <span class="stat-label">Total Spent</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ wishlistItems.length }}</span>
              <span class="stat-label">Wishlist</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">⭐</span>
              <span class="stat-value">{{ reviews.length }}</span>
              <span class="stat-label">Reviews</span>
            </div>
          </div>

          <div class="quick-actions">
            <h3>Quick Actions</h3>
            <button class="btn btn-secondary">Edit Profile</button>
            <button class="btn btn-secondary">Change Password</button>
            <button class="btn btn-secondary">Notification Settings</button>
          </div>
        </section>

        <!-- Orders Tab -->
        <section v-if="activeTab === 'orders'" class="card">
          <h2>Order History</h2>
          
          <div v-if="orders.length === 0" class="empty-state">
            <p>No orders yet</p>
            <router-link to="/products" class="btn">Start Shopping</router-link>
          </div>

          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-item">
              <div class="order-header">
                <div>
                  <p class="order-id">Order #{{ order.id }}</p>
                  <p class="order-date">{{ order.date }}</p>
                </div>
                <div class="order-status" :class="order.status">
                  {{ order.status }}
                </div>
              </div>
              <div class="order-items">
                <span v-for="item in order.items" :key="item" class="order-badge">
                  {{ item }}
                </span>
              </div>
              <div class="order-footer">
                <span class="order-total">Total: ${{ order.total }}</span>
                <button class="btn btn-sm">View Details</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Wishlist Tab -->
        <section v-if="activeTab === 'wishlist'" class="card">
          <h2>My Wishlist</h2>
          
          <div v-if="wishlistItems.length === 0" class="empty-state">
            <p>Your wishlist is empty</p>
            <router-link to="/products" class="btn">Explore Products</router-link>
          </div>

          <div v-else class="products-grid">
            <div v-for="item in wishlistItems" :key="item.id" class="product-card card">
              <div class="product-image">{{ item.image }}</div>
              <div class="card-body">
                <p class="product-name">{{ item.name }}</p>
                <p class="product-price">${{ item.price }}</p>
                <button class="btn btn-block">Add to Cart</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Settings Tab -->
        <section v-if="activeTab === 'settings'" class="card">
          <h2>Account Settings</h2>

          <div class="settings-section">
            <h3>Email & Password</h3>
            <div class="settings-item">
              <label>Email Address</label>
              <input v-model="settings.email" type="email" placeholder="Email">
            </div>
            <div class="settings-item">
              <label>Password</label>
              <input v-model="settings.password" type="password" placeholder="Password">
            </div>
            <button class="btn btn-secondary">Update</button>
          </div>

          <hr>

          <div class="settings-section">
            <h3>Preferences</h3>
            <div class="settings-item">
              <label class="checkbox-label">
                <input v-model="settings.newsletter" type="checkbox">
                <span>Subscribe to newsletter</span>
              </label>
            </div>
            <div class="settings-item">
              <label class="checkbox-label">
                <input v-model="settings.notifications" type="checkbox">
                <span>Email notifications</span>
              </label>
            </div>
            <div class="settings-item">
              <label class="checkbox-label">
                <input v-model="settings.sms" type="checkbox">
                <span>SMS notifications</span>
              </label>
            </div>
            <button class="btn btn-secondary">Save Preferences</button>
          </div>

          <hr>

          <div class="settings-section danger-zone">
            <h3>Danger Zone</h3>
            <button class="btn btn-danger">Delete Account</button>
          </div>
        </section>

        <!-- Support Tab -->
        <section v-if="activeTab === 'support'" class="card">
          <h2>Customer Support</h2>

          <div class="support-content">
            <div class="support-item">
              <h3>📧 Contact Us</h3>
              <p>Email us at: <strong>support@heritagecrafts.com</strong></p>
            </div>

            <div class="support-item">
              <h3>💬 Live Chat</h3>
              <p>Available 24/7 for immediate assistance</p>
              <button class="btn btn-secondary">Start Chat</button>
            </div>

            <div class="support-item">
              <h3>❓ FAQ</h3>
              <p>Find answers to common questions</p>
              <button class="btn btn-secondary">View FAQ</button>
            </div>

            <div class="support-item">
              <h3>📱 Call Us</h3>
              <p>Phone: <strong>+1-800-HERITAGE</strong></p>
              <p class="hours">Available Mon-Fri, 9AM-5PM EST</p>
            </div>
          </div>

          <div class="ticket-form">
            <h3>Submit a Ticket</h3>
            <textarea placeholder="Describe your issue..." rows="5"></textarea>
            <button class="btn">Submit Ticket</button>
          </div>
        </section>
      </main>
    </div>
  </div>

  <div v-else class="not-logged-in">
    <div class="card">
      <p>Please log in to view your profile</p>
      <router-link to="/login" class="btn btn-lg">Go to Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('overview')

const orders = ref([
  {
    id: 1001,
    date: 'Jan 18, 2024',
    status: 'delivered',
    items: ['Hand-Woven Rug', 'Brass Vase'],
    total: 78.50
  },
  {
    id: 1002,
    date: 'Jan 10, 2024',
    status: 'shipped',
    items: ['Kashmiri Shawl'],
    total: 95.00
  }
])

const wishlistItems = ref([
  {
    id: 1,
    name: 'Marble Inlay Box',
    price: 55.00,
    image: '💎'
  },
  {
    id: 2,
    name: 'Madhubani Painting',
    price: 85.00,
    image: '🎭'
  }
])

const reviews = ref([
  {
    id: 1,
    product: 'Hand-Woven Rug',
    rating: 5,
    date: 'Jan 25, 2024'
  }
])

const totalSpent = ref(173.50)

const settings = ref({
  email: authStore.user?.email || '',
  password: '',
  newsletter: true,
  notifications: true,
  sms: false
})

const logout = () => {
  authStore.logout()
  alert('You have been signed out')
  router.push('/')
}
</script>

<style scoped>
.profile-page {
  width: 100%;
}

.profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.profile-sidebar {
  height: fit-content;
  padding: 2rem !important;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-avatar {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.profile-info h2 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.profile-info .email {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.nav-item {
  background: none;
  border: none;
  padding: 0.75rem;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
  color: var(--text-dark);
}

.nav-item:hover {
  background: var(--light-bg);
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
  font-weight: 600;
}

.profile-main {
  display: flex;
  flex-direction: column;
}

.card {
  padding: 2rem !important;
  margin-bottom: 1.5rem;
}

.card h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.card h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: var(--light-bg);
  border-radius: 8px;
  text-align: center;
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-light);
}

/* Quick Actions */
.quick-actions {
  background: var(--light-bg);
  padding: 1.5rem;
  border-radius: 8px;
}

.quick-actions .btn {
  display: block;
  width: 100%;
  margin-bottom: 0.75rem;
  text-align: center;
}

.quick-actions .btn:last-child {
  margin-bottom: 0;
}

/* Orders */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.order-id {
  font-weight: 600;
  margin: 0;
}

.order-date {
  font-size: 0.9rem;
  color: var(--text-light);
  margin: 0.25rem 0 0 0;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.order-status.delivered {
  background: #d4edda;
  color: #155724;
}

.order-status.shipped {
  background: #cfe2ff;
  color: #084298;
}

.order-status.pending {
  background: #fff3cd;
  color: #664d03;
}

.order-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.order-badge {
  background: var(--light-bg);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  font-weight: 600;
}

/* Wishlist */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.product-card {
  text-align: center;
}

.product-image {
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-bg);
  height: 150px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.product-name {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.product-price {
  color: var(--primary-color);
  font-weight: bold;
  margin-bottom: 1rem;
}

/* Settings */
.settings-section {
  margin-bottom: 2rem;
}

.settings-item {
  margin-bottom: 1rem;
}

.settings-item label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.settings-item input[type="text"],
.settings-item input[type="email"],
.settings-item input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input {
  width: auto;
  accent-color: var(--primary-color);
}

.danger-zone {
  background: #ffe5e5;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ffcccc;
}

hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2rem 0;
}

/* Support */
.support-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.support-item {
  padding: 1.5rem;
  background: var(--light-bg);
  border-radius: 8px;
}

.support-item h3 {
  margin-top: 0;
}

.support-item p {
  margin: 0.5rem 0;
}

.hours {
  font-size: 0.85rem;
  color: var(--text-light);
}

.ticket-form {
  background: var(--light-bg);
  padding: 1.5rem;
  border-radius: 8px;
}

.ticket-form textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: inherit;
  resize: none;
}

.ticket-form .btn {
  margin-top: 1rem;
}

.not-logged-in {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
}

@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .profile-header {
    grid-column: 1 / -1;
  }

  .profile-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .support-content {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .order-footer {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1.5rem !important;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
