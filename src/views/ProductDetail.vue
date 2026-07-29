<template>
  <div v-if="product" class="product-detail">
    <router-link to="/products" class="back-link">← Back to Products</router-link>

    <div class="product-layout">
      <div class="product-gallery">
        <div class="main-image">{{ product.image }}</div>
        <div class="gallery-thumbs">
          <button class="thumb active">{{ product.image }}</button>
          <button class="thumb">{{ product.image }}</button>
          <button class="thumb">{{ product.image }}</button>
        </div>
      </div>

      <div class="product-info">
        <h1>{{ product.name }}</h1>
        
        <p class="artisan-link">
          by <router-link :to="`/artisans/${product.artisanId}`">{{ product.artisanName }}</router-link>
        </p>

        <div class="rating-section">
          <span class="rating">⭐ {{ product.rating }} ({{ product.reviews }} reviews)</span>
          <button class="btn btn-sm btn-outline">Leave Review</button>
        </div>

        <div class="price-section">
          <span class="price">${{ product.price }}</span>
          <span class="stock">In Stock</span>
        </div>

        <p class="description">{{ product.description }}</p>

        <div class="product-details">
          <div class="detail-group">
            <h4>Materials</h4>
            <ul>
              <li v-for="material in product.materials" :key="material">{{ material }}</li>
            </ul>
          </div>

          <div class="detail-group">
            <h4>Origin</h4>
            <p>{{ product.origin }}</p>
          </div>

          <div class="detail-group">
            <h4>Category</h4>
            <p class="category">{{ product.category }}</p>
          </div>
        </div>

        <div class="quantity-section">
          <label>Quantity:</label>
          <div class="quantity-control">
            <button 
              @click="quantity > 1 && quantity--" 
              class="qty-btn"
            >−</button>
            <input 
              v-model.number="quantity" 
              type="number" 
              min="1"
              class="qty-input"
            >
            <button 
              @click="quantity++" 
              class="qty-btn"
            >+</button>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="addToCart" class="btn btn-lg btn-block">Add to Cart</button>
          <button @click="addToWishlist" class="btn btn-lg btn-outline btn-block">❤️ Wishlist</button>
        </div>

        <div class="trust-badges">
          <div class="badge">
            <span>✅</span>
            <p>100% Authentic</p>
          </div>
          <div class="badge">
            <span>🛡️</span>
            <p>Secure Payment</p>
          </div>
          <div class="badge">
            <span>🚚</span>
            <p>Free Shipping</p>
          </div>
          <div class="badge">
            <span>↩️</span>
            <p>Easy Returns</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Artisan Info Card -->
    <section class="artisan-section">
      <h2>About the Artisan</h2>
      <div class="artisan-info card">
        <div class="artisan-header">
          <div class="artisan-avatar">{{ artisan.image }}</div>
          <div>
            <h3>{{ artisan.name }}</h3>
            <p class="specialty">{{ artisan.specialty }}</p>
            <p class="location">📍 {{ artisan.location }}</p>
          </div>
          <router-link :to="`/artisans/${artisan.id}`" class="btn">View Profile</router-link>
        </div>
        <p class="artisan-bio">{{ artisan.bio }}</p>
      </div>
    </section>

    <!-- Related Products -->
    <section class="related-products">
      <h2>Related Products</h2>
      <div class="grid grid-3">
        <div v-for="item in relatedProducts" :key="item.id" class="product-card card">
          <router-link :to="`/products/${item.id}`" class="product-link">
            <div class="product-image">{{ item.image }}</div>
          </router-link>
          <div class="card-body">
            <router-link :to="`/products/${item.id}`" class="product-name">
              {{ item.name }}
            </router-link>
            <p class="artisan-name">by {{ item.artisanName }}</p>
            <div class="rating">
              <span class="stars">⭐ {{ item.rating }}</span>
            </div>
            <p class="price">${{ item.price }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews Section -->
    <section class="reviews-section">
      <h2>Customer Reviews</h2>
      <div class="reviews-container">
        <div class="review" v-for="review in reviews" :key="review.id">
          <div class="review-header">
            <div class="reviewer-info">
              <strong>{{ review.name }}</strong>
              <span class="rating">⭐ {{ review.rating }}/5</span>
            </div>
            <small class="review-date">{{ review.date }}</small>
          </div>
          <p class="review-text">{{ review.text }}</p>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="loading">Loading product...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const productsStore = useProductsStore()

const product = ref(null)
const artisan = ref(null)
const quantity = ref(1)

const relatedProducts = computed(() => {
  if (!product.value) return []
  return productsStore.products
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 3)
})

const reviews = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2024-01-15',
    text: 'Beautiful product! Excellent craftsmanship and very well packaged. Will definitely order again.'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    rating: 4,
    date: '2024-01-12',
    text: 'Great quality and authentic. Shipping was fast and product arrived in perfect condition.'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    rating: 5,
    date: '2024-01-08',
    text: 'Absolutely love it! This is my second purchase from this artisan. Highly recommended!'
  }
])

onMounted(() => {
  const productId = parseInt(route.params.id)
  product.value = productsStore.products.find(p => p.id === productId)
  
  if (product.value) {
    artisan.value = productsStore.artisans.find(a => a.id === product.value.artisanId)
  } else {
    router.push('/products')
  }
})

const addToCart = () => {
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem(product.value)
  }
  alert(`${quantity.value} × ${product.value.name} added to cart!`)
  quantity.value = 1
}

const addToWishlist = () => {
  alert(`${product.value.name} added to wishlist!`)
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--primary-color);
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  padding: 2rem;
  background: var(--light-bg);
  border-radius: 12px;
}

.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  font-size: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  min-height: 400px;
}

.gallery-thumbs {
  display: flex;
  gap: 1rem;
}

.thumb {
  width: 100px;
  height: 100px;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.thumb:hover,
.thumb.active {
  border-color: var(--primary-color);
}

.product-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.artisan-link {
  color: var(--text-light);
  margin-bottom: 1rem;
}

.artisan-link a {
  color: var(--primary-color);
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.rating {
  font-size: 1rem;
  font-weight: 600;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stock {
  background: #d4edda;
  color: #155724;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.description {
  color: var(--text-dark);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.detail-group h4 {
  margin-bottom: 0.75rem;
  color: var(--text-dark);
}

.detail-group ul {
  list-style: none;
}

.detail-group ul li {
  padding: 0.25rem 0;
  color: var(--text-light);
}

.detail-group ul li::before {
  content: '✓ ';
  color: var(--primary-color);
  margin-right: 0.5rem;
  font-weight: bold;
}

.category {
  color: var(--text-light);
  text-transform: capitalize;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.quantity-section label {
  font-weight: 600;
}

.quantity-control {
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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.qty-btn:hover {
  background: white;
  border-radius: 4px;
}

.qty-input {
  width: 60px;
  text-align: center;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 1rem;
}

.qty-input:focus {
  outline: none;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.trust-badges {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.badge {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.badge span {
  font-size: 1.5rem;
}

.badge p {
  font-size: 0.85rem;
  color: var(--text-dark);
  margin: 0;
}

/* Artisan Section */
.artisan-section {
  margin-bottom: 4rem;
}

.artisan-info {
  padding: 2rem !important;
}

.artisan-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.artisan-avatar {
  font-size: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: var(--light-bg);
  border-radius: 50%;
  flex-shrink: 0;
}

.artisan-header h3 {
  margin-bottom: 0.25rem;
}

.specialty {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.location {
  color: var(--text-light);
  font-size: 0.9rem;
}

.artisan-bio {
  color: var(--text-dark);
  line-height: 1.6;
}

/* Related Products */
.related-products {
  margin-bottom: 4rem;
}

.product-card {
  overflow: hidden;
}

.product-link {
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.product-image {
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-bg);
  height: 180px;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.product-name {
  display: block;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
}

.product-name:hover {
  color: var(--primary-color);
}

.artisan-name {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.stars {
  color: var(--primary-color);
  font-weight: 600;
}

/* Reviews Section */
.reviews-section {
  margin-bottom: 2rem;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review {
  background: var(--light-bg);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.review-date {
  color: var(--text-light);
}

.review-text {
  color: var(--text-dark);
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .main-image {
    min-height: 300px;
  }

  .product-details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .product-layout {
    padding: 1rem;
  }

  .product-info h1 {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .artisan-header {
    flex-direction: column;
    text-align: center;
  }

  .trust-badges {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .main-image {
    font-size: 4rem;
    min-height: 250px;
  }

  .gallery-thumbs {
    gap: 0.5rem;
  }

  .thumb {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }

  .price {
    font-size: 1.5rem;
  }

  .quantity-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .trust-badges {
    grid-template-columns: 1fr;
  }
}
</style>
