<template>
  <div class="cart-page">
    <h1 class="section-title">Shopping Cart</h1>

    <div v-if="cartStore.items.length === 0" class="empty-state">
      <div class="empty-state-icon">🛒</div>
      <p class="empty-state-title">Your cart is empty</p>
      <p class="empty-state-text">Start exploring our collection of authentic handmade products</p>
      <router-link to="/products" class="btn">Continue Shopping</router-link>
    </div>

    <div v-else class="cart-layout">
      <main class="cart-items">
        <div class="cart-header">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
          <span></span>
        </div>

        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-info">
            <router-link :to="`/products/${item.id}`" class="item-image">
              {{ item.image }}
            </router-link>
            <div class="item-details">
              <router-link :to="`/products/${item.id}`" class="item-name">
                {{ item.name }}
              </router-link>
              <p class="item-artisan">by {{ item.artisanName }}</p>
            </div>
          </div>

          <div class="item-price">${{ item.price }}</div>

          <div class="item-quantity">
            <button @click="decrementQuantity(item.id)" class="qty-btn">−</button>
            <input v-model.number="item.quantity" type="number" min="1" class="qty-input">
            <button @click="incrementQuantity(item.id)" class="qty-btn">+</button>
          </div>

          <div class="item-subtotal">${{ (item.price * item.quantity).toFixed(2) }}</div>

          <button @click="removeItem(item.id)" class="remove-btn" title="Remove item">
            ✕
          </button>
        </div>

        <div class="cart-actions">
          <router-link to="/products" class="btn btn-outline">Continue Shopping</router-link>
          <button @click="cartStore.clearCart()" class="btn btn-outline btn-danger">Clear Cart</button>
        </div>
      </main>

      <aside class="cart-summary card">
        <h3>Order Summary</h3>

        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ cartStore.total }}</span>
        </div>

        <div class="summary-row">
          <span>Shipping:</span>
          <span>{{ shippingCost === 0 ? 'FREE' : '$' + shippingCost }}</span>
          <small class="help-text">(Free on orders over $50)</small>
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

        <router-link to="/checkout" class="btn btn-lg btn-block">Proceed to Checkout</router-link>

        <div class="promo-section">
          <input 
            v-model="promoCode" 
            type="text" 
            placeholder="Promo code"
            class="promo-input"
          >
          <button @click="applyPromo" class="btn btn-secondary">Apply</button>
        </div>

        <div class="shipping-info">
          <p class="info-title">📦 Estimated Delivery</p>
          <p class="info-text">5-7 business days</p>
        </div>

        <div class="support-info">
          <p class="info-title">💬 Need Help?</p>
          <p class="info-text">Contact our support team 24/7</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const promoCode = ref('')

const shippingCost = computed(() => {
  return parseFloat(cartStore.total) > 50 ? 0 : 10
})

const tax = computed(() => {
  return (parseFloat(cartStore.total) * 0.1).toFixed(2)
})

const finalTotal = computed(() => {
  const total = parseFloat(cartStore.total) + shippingCost.value + parseFloat(tax.value)
  return total.toFixed(2)
})

const incrementQuantity = (itemId) => {
  const item = cartStore.items.find(i => i.id === itemId)
  if (item) {
    item.quantity++
    cartStore.saveToStorage()
  }
}

const decrementQuantity = (itemId) => {
  const item = cartStore.items.find(i => i.id === itemId)
  if (item && item.quantity > 1) {
    item.quantity--
    cartStore.saveToStorage()
  }
}

const removeItem = (itemId) => {
  cartStore.removeItem(itemId)
}

const applyPromo = () => {
  if (promoCode.value.toUpperCase() === 'SAVE10') {
    alert('Promo code applied! 10% discount')
    promoCode.value = ''
  } else {
    alert('Invalid promo code')
  }
}
</script>

<style scoped>
.cart-page {
  width: 100%;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  margin-top: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr 0.5fr;
  gap: 1rem;
  padding: 1rem;
  background: var(--light-bg);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: var(--text-light);
}

.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr 0.5fr;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.item-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.item-image {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--light-bg);
  border-radius: 8px;
  text-decoration: none;
}

.item-details {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 600;
  color: var(--text-dark);
  text-decoration: none;
  transition: color 0.3s;
}

.item-name:hover {
  color: var(--primary-color);
}

.item-artisan {
  font-size: 0.85rem;
  color: var(--text-light);
  margin: 0.25rem 0 0 0;
}

.item-price {
  font-weight: 600;
  color: var(--primary-color);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--light-bg);
  border-radius: 6px;
  padding: 0.25rem;
}

.qty-btn {
  background: none;
  border: none;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.qty-btn:hover {
  background: white;
  border-radius: 4px;
}

.qty-input {
  width: 50px;
  text-align: center;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 0.95rem;
}

.qty-input:focus {
  outline: none;
}

.item-subtotal {
  font-weight: 600;
  color: var(--text-dark);
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s;
}

.remove-btn:hover {
  color: #a02834;
}

.cart-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 0;
}

.btn-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background: #dc3545;
}

.cart-summary {
  padding: 1.5rem !important;
  height: fit-content;
}

.cart-summary h3 {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
  font-size: 0.95rem;
}

.help-text {
  display: block;
  width: 100%;
  text-align: right;
  color: var(--text-light);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.summary-row.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-top: 0.5rem;
}

.divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1rem 0;
}

.promo-section {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.promo-input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.9rem;
}

.promo-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.shipping-info,
.support-info {
  background: var(--light-bg);
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
}

.info-title {
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
}

.info-text {
  color: var(--text-light);
  margin: 0;
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    height: auto;
  }
}

@media (max-width: 768px) {
  .cart-header,
  .cart-item {
    grid-template-columns: 1fr 1fr;
  }

  .cart-header span:nth-child(3),
  .cart-header span:nth-child(4),
  .cart-header span:nth-child(5),
  .cart-item > div:nth-child(3),
  .cart-item > div:nth-child(4),
  .cart-item > button {
    display: none;
  }

  .item-quantity {
    display: flex;
    margin-top: 0.5rem;
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .cart-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .item-info {
    grid-column: 1 / -1;
  }

  .item-price,
  .item-subtotal,
  .cart-item > div:nth-child(3) {
    display: none;
  }

  .item-quantity {
    grid-column: 1 / -1;
  }

  .promo-section {
    flex-direction: column;
  }

  .promo-input {
    width: 100%;
  }
}
</style>
