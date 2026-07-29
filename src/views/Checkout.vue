<template>
  <div class="checkout-page">
    <h1 class="section-title">Checkout</h1>

    <div class="checkout-layout">
      <main class="checkout-form">
        <!-- Step 1: Shipping Address -->
        <section class="form-section card">
          <h2>Shipping Address</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name *</label>
              <input v-model="form.name" type="text" placeholder="John Doe" required>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input v-model="form.email" type="email" placeholder="john@example.com" required>
            </div>
            <div class="form-group full-width">
              <label>Street Address *</label>
              <input v-model="form.street" type="text" placeholder="123 Main Street" required>
            </div>
            <div class="form-group">
              <label>City *</label>
              <input v-model="form.city" type="text" placeholder="New York" required>
            </div>
            <div class="form-group">
              <label>State *</label>
              <input v-model="form.state" type="text" placeholder="NY" required>
            </div>
            <div class="form-group">
              <label>ZIP Code *</label>
              <input v-model="form.zip" type="text" placeholder="10001" required>
            </div>
            <div class="form-group full-width">
              <label>Country *</label>
              <select v-model="form.country" required>
                <option value="">Select country</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="India">India</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Phone Number *</label>
              <input v-model="form.phone" type="tel" placeholder="+1-234-567-8900" required>
            </div>
          </div>
        </section>

        <!-- Step 2: Shipping Method -->
        <section class="form-section card">
          <h2>Shipping Method</h2>
          <div class="shipping-options">
            <label class="shipping-option">
              <input v-model="form.shipping" type="radio" value="standard">
              <div class="shipping-info">
                <span class="shipping-name">Standard Shipping</span>
                <span class="shipping-time">5-7 business days</span>
              </div>
              <span class="shipping-price">FREE</span>
            </label>
            <label class="shipping-option">
              <input v-model="form.shipping" type="radio" value="express">
              <div class="shipping-info">
                <span class="shipping-name">Express Shipping</span>
                <span class="shipping-time">2-3 business days</span>
              </div>
              <span class="shipping-price">$15</span>
            </label>
            <label class="shipping-option">
              <input v-model="form.shipping" type="radio" value="overnight">
              <div class="shipping-info">
                <span class="shipping-name">Overnight Shipping</span>
                <span class="shipping-time">Next business day</span>
              </div>
              <span class="shipping-price">$25</span>
            </label>
          </div>
        </section>

        <!-- Step 3: Payment Information -->
        <section class="form-section card">
          <h2>Payment Information</h2>
          <div class="payment-methods">
            <label class="payment-method">
              <input v-model="form.paymentMethod" type="radio" value="card">
              <span>💳 Credit/Debit Card</span>
            </label>
            <label class="payment-method">
              <input v-model="form.paymentMethod" type="radio" value="paypal">
              <span>🅿️ PayPal</span>
            </label>
            <label class="payment-method">
              <input v-model="form.paymentMethod" type="radio" value="apple">
              <span>🍎 Apple Pay</span>
            </label>
          </div>

          <div v-if="form.paymentMethod === 'card'" class="card-form">
            <div class="form-group full-width">
              <label>Card Number *</label>
              <input v-model="form.cardNumber" type="text" placeholder="1234 5678 9012 3456" required>
            </div>
            <div class="form-group">
              <label>Expiry Date *</label>
              <input v-model="form.expiryDate" type="text" placeholder="MM/YY" required>
            </div>
            <div class="form-group">
              <label>CVC *</label>
              <input v-model="form.cvc" type="text" placeholder="123" required>
            </div>
            <div class="form-group full-width">
              <label>Cardholder Name *</label>
              <input v-model="form.cardholderName" type="text" placeholder="John Doe" required>
            </div>
          </div>
        </section>

        <!-- Step 4: Order Review -->
        <section class="form-section card">
          <h2>Order Review</h2>
          <div class="order-items">
            <div v-for="item in cartStore.items" :key="item.id" class="order-item">
              <div class="item-details">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-quantity">× {{ item.quantity }}</span>
              </div>
              <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </section>

        <button @click="submitOrder" class="btn btn-lg btn-block submit-btn">
          Place Order
        </button>
      </main>

      <!-- Order Summary Sidebar -->
      <aside class="order-summary card">
        <h3>Order Summary</h3>

        <div class="summary-items">
          <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty">×{{ item.quantity }}</span>
          </div>
        </div>

        <hr class="divider">

        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ cartStore.total }}</span>
        </div>

        <div class="summary-row">
          <span>Shipping:</span>
          <span>{{ shippingCost }}</span>
        </div>

        <div class="summary-row">
          <span>Tax (est.):</span>
          <span>${{ tax }}</span>
        </div>

        <hr class="divider">

        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ finalTotal }}</span>
        </div>

        <div class="trust-badges">
          <div class="badge">✓ 100% Authentic</div>
          <div class="badge">🔒 Secure Payment</div>
          <div class="badge">↩️ Easy Returns</div>
        </div>

        <div class="guarantees">
          <h4>Money-Back Guarantee</h4>
          <p>Not satisfied? Return items within 30 days for a full refund.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const form = ref({
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  phone: '',
  shipping: 'standard',
  paymentMethod: 'card',
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  cardholderName: ''
})

const shippingCost = computed(() => {
  switch (form.value.shipping) {
    case 'express':
      return '$15'
    case 'overnight':
      return '$25'
    default:
      return parseFloat(cartStore.total) > 50 ? 'FREE' : '$10'
  }
})

const shippingAmount = computed(() => {
  switch (form.value.shipping) {
    case 'express':
      return 15
    case 'overnight':
      return 25
    default:
      return parseFloat(cartStore.total) > 50 ? 0 : 10
  }
})

const tax = computed(() => {
  return (parseFloat(cartStore.total) * 0.1).toFixed(2)
})

const finalTotal = computed(() => {
  const total = parseFloat(cartStore.total) + shippingAmount.value + parseFloat(tax.value)
  return total.toFixed(2)
})

const submitOrder = () => {
  // Validation
  if (!form.value.name || !form.value.email || !form.value.street || !form.value.city) {
    alert('Please fill in all required fields')
    return
  }

  if (form.value.paymentMethod === 'card') {
    if (!form.value.cardNumber || !form.value.expiryDate || !form.value.cvc) {
      alert('Please enter valid card details')
      return
    }
  }

  // Simulate order placement
  alert(`Order placed successfully!\nOrder Total: $${finalTotal.value}\nEstimated Delivery: 5-7 business days`)
  
  // Clear cart and redirect
  cartStore.clearCart()
  router.push('/')
}
</script>

<style scoped>
.checkout-page {
  width: 100%;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  margin-top: 2rem;
}

.form-section {
  padding: 1.5rem !important;
  margin-bottom: 1.5rem;
}

.form-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

/* Shipping Options */
.shipping-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shipping-option {
  display: grid;
  grid-template-columns: 20px 1fr 100px;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.shipping-option:hover {
  border-color: var(--primary-color);
  background: var(--light-bg);
}

.shipping-option input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.shipping-info {
  display: flex;
  flex-direction: column;
}

.shipping-name {
  font-weight: 600;
  color: var(--text-dark);
}

.shipping-time {
  font-size: 0.85rem;
  color: var(--text-light);
}

.shipping-price {
  font-weight: 600;
  color: var(--primary-color);
  text-align: right;
}

/* Payment Methods */
.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-method:hover {
  border-color: var(--primary-color);
}

.payment-method input {
  width: auto;
  accent-color: var(--primary-color);
}

.card-form {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Order Review */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--light-bg);
  border-radius: 6px;
}

.item-details {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.item-name {
  font-weight: 500;
}

.item-quantity {
  color: var(--text-light);
  font-size: 0.9rem;
}

.item-price {
  font-weight: 600;
  color: var(--primary-color);
}

.submit-btn {
  margin-top: 1rem;
}

/* Order Summary Sidebar */
.order-summary {
  padding: 1.5rem !important;
  height: fit-content;
}

.order-summary h3 {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-dark);
}

.summary-item .item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-item .item-qty {
  color: var(--text-light);
}

.divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-dark);
}

.summary-row.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
}

.trust-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--light-bg);
  border-radius: 6px;
}

.badge {
  font-size: 0.85rem;
  color: var(--text-dark);
}

.guarantees {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #d4edda;
  border-radius: 6px;
  border-left: 4px solid #28a745;
}

.guarantees h4 {
  margin: 0 0 0.5rem 0;
  color: #155724;
}

.guarantees p {
  margin: 0;
  font-size: 0.85rem;
  color: #155724;
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    height: auto;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }

  .shipping-option {
    grid-template-columns: 20px 1fr;
  }

  .shipping-price {
    display: none;
  }
}

@media (max-width: 480px) {
  .checkout-layout {
    gap: 1rem;
  }

  .form-section {
    padding: 1rem !important;
    margin-bottom: 1rem;
  }

  .summary-items {
    max-height: 200px;
  }
}
</style>
