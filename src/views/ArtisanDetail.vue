<template>
  <div v-if="artisan" class="artisan-detail">
    <router-link to="/artisans" class="back-link">← Back to Artisans</router-link>

    <!-- Hero Section -->
    <section class="artisan-hero">
      <div class="hero-image">{{ artisan.image }}</div>
      <div class="hero-info">
        <h1>{{ artisan.name }}</h1>
        <p class="specialty">{{ artisan.specialty }}</p>
        <p class="location">📍 {{ artisan.location }}</p>
        
        <div class="stats">
          <div class="stat">
            <span class="stat-value">{{ artisan.yearsExperience }}+</span>
            <span class="stat-label">Years of Experience</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ artisan.productsCount }}</span>
            <span class="stat-label">Products Created</span>
          </div>
        </div>

        <button class="btn btn-lg">Follow Artisan</button>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section card">
      <h2>About {{ artisan.name }}</h2>
      <p class="bio">{{ artisan.bio }}</p>
      <p>With {{ artisan.yearsExperience }} years of dedicated practice in {{ artisan.specialty.toLowerCase() }}, {{ artisan.name }} has mastered the traditional techniques passed down through generations. Their work reflects the rich cultural heritage of {{ artisan.location }} and continues to inspire art enthusiasts worldwide.</p>
    </section>

    <!-- Products Section -->
    <section class="products-section">
      <h2>Products by {{ artisan.name }}</h2>
      <div v-if="artisanProducts.length === 0" class="empty-state">
        <p>No products available yet</p>
      </div>
      <div v-else class="products-grid">
        <div v-for="product in artisanProducts" :key="product.id" class="product-card card">
          <router-link :to="`/products/${product.id}`" class="product-link">
            <div class="product-image">{{ product.image }}</div>
          </router-link>
          <div class="card-body">
            <router-link :to="`/products/${product.id}`" class="product-name">
              {{ product.name }}
            </router-link>
            <div class="rating">
              <span class="stars">⭐ {{ product.rating }}</span>
              <span class="reviews">({{ product.reviews }})</span>
            </div>
            <p class="price">${{ product.price }}</p>
            <button @click="addToCart(product)" class="btn btn-block">Add to Cart</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="story-section card">
      <h2>The Story Behind the Art</h2>
      <div class="story-content">
        <p>Every piece created by {{ artisan.name }} tells a unique story of heritage and passion. Beginning their journey at a young age, they learned the intricate techniques of {{ artisan.specialty.toLowerCase() }} from master craftspeople in their family.</p>
        
        <p>Their work stands as a testament to the beauty of traditional Indian craftsmanship. By supporting artisans like {{ artisan.name }}, you're not just purchasing a product—you're becoming part of a movement to preserve centuries-old traditions and support skilled artists.</p>

        <p>Each item is handcrafted with meticulous attention to detail, ensuring that every customer receives a piece of authentic Indian art.</p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section card">
      <h2>Connect with the Artisan</h2>
      <div class="contact-info">
        <div class="contact-item">
          <span class="contact-icon">📍</span>
          <div>
            <p class="contact-label">Based In</p>
            <p class="contact-value">{{ artisan.location }}</p>
          </div>
        </div>
        <div class="contact-item">
          <span class="contact-icon">🎯</span>
          <div>
            <p class="contact-label">Specialty</p>
            <p class="contact-value">{{ artisan.specialty }}</p>
          </div>
        </div>
        <div class="contact-item">
          <span class="contact-icon">⭐</span>
          <div>
            <p class="contact-label">Experience</p>
            <p class="contact-value">{{ artisan.yearsExperience }} Years</p>
          </div>
        </div>
      </div>
      <button class="btn btn-lg btn-block">Contact Artisan</button>
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
  <div v-else class="loading">Loading artisan details...</div>
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

const artisan = ref(null)

const artisanProducts = computed(() => {
  if (!artisan.value) return []
  return productsStore.products.filter(p => p.artisanId === artisan.value.id)
})

const reviews = ref([
  {
    id: 1,
    name: 'Maya Patel',
    rating: 5,
    date: '2024-01-18',
    text: 'The craftsmanship is absolutely incredible! Every detail shows the passion and dedication of the artisan. I am so impressed!'
  },
  {
    id: 2,
    name: 'James Wilson',
    rating: 5,
    date: '2024-01-15',
    text: 'Authentic, beautiful, and worth every penny. Supporting real artisans makes all the difference!'
  },
  {
    id: 3,
    name: 'Priya Singh',
    rating: 4,
    date: '2024-01-12',
    text: 'Love the work of this artisan. The quality and attention to detail is remarkable. Would definitely recommend!'
  }
])

onMounted(() => {
  const artisanId = parseInt(route.params.id)
  artisan.value = productsStore.artisans.find(a => a.id === artisanId)
  
  if (!artisan.value) {
    router.push('/artisans')
  }
})

const addToCart = (product) => {
  cartStore.addItem(product)
  alert(`${product.name} added to cart!`)
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

/* Hero Section */
.artisan-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f6f3 0%, #f0ebe5 100%);
  border-radius: 12px;
}

.hero-image {
  font-size: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  height: 400px;
}

.hero-info h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.specialty {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.location {
  color: var(--text-light);
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Sections */
.about-section,
.story-section,
.contact-section {
  padding: 2rem !important;
  margin-bottom: 2rem;
}

.about-section h2,
.products-section h2,
.story-section h2,
.contact-section h2,
.reviews-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.bio {
  color: var(--text-dark);
  line-height: 1.8;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.about-section p,
.story-section p {
  color: var(--text-dark);
  line-height: 1.8;
  margin-bottom: 1rem;
}

/* Products Section */
.products-section {
  margin-bottom: 3rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  overflow: hidden;
}

.product-link {
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.product-image {
  font-size: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-bg);
  height: 200px;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.product-name {
  display: block;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.product-name:hover {
  color: var(--primary-color);
}

.rating {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.stars {
  color: var(--primary-color);
  font-weight: 600;
}

.reviews {
  color: var(--text-light);
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

/* Story Content */
.story-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Contact Section */
.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--light-bg);
  border-radius: 8px;
}

.contact-icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-label {
  font-size: 0.85rem;
  color: var(--text-light);
  text-transform: uppercase;
  margin: 0;
}

.contact-value {
  font-weight: 600;
  color: var(--text-dark);
  margin: 0.25rem 0 0 0;
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
  .artisan-hero {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-image {
    font-size: 5rem;
    height: 300px;
  }

  .hero-info h1 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .artisan-hero {
    padding: 1.5rem;
  }

  .hero-info h1 {
    font-size: 1.5rem;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .about-section,
  .story-section,
  .contact-section {
    padding: 1.5rem !important;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-image {
    font-size: 3.5rem;
    height: 250px;
  }

  .hero-info h1 {
    font-size: 1.3rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .about-section h2,
  .products-section h2,
  .story-section h2,
  .contact-section h2,
  .reviews-section h2 {
    font-size: 1.3rem;
  }
}
</style>
