<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Heritage Handicrafts</h1>
        <p>Discover Authentic Indian Handmade Products</p>
        <p class="hero-subtitle">Support traditional artisans while preserving cultural heritage</p>
        <div class="hero-buttons">
          <router-link to="/products" class="btn btn-lg">Shop Now</router-link>
          <router-link to="/artisans" class="btn btn-lg btn-outline">Meet Artisans</router-link>
        </div>
      </div>
      <div class="hero-image">
        <div class="emoji-grid">
          <span>🧵</span>
          <span>🏺</span>
          <span>🎨</span>
          <span>💎</span>
          <span>🍶</span>
          <span>🧣</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2 class="section-title">Why Choose Heritage Handicrafts?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">👨‍🎨</div>
          <h3>Authentic Artisans</h3>
          <p>Buy directly from skilled craftspeople preserving traditional Indian arts and techniques.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✋</div>
          <h3>Handmade Quality</h3>
          <p>Every product is carefully handcrafted with attention to detail and quality.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3>Cultural Heritage</h3>
          <p>Support the preservation of centuries-old traditional crafts and cultural practices.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3>Guaranteed Authentic</h3>
          <p>100% authentic products with verification and certification from artisans.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🚚</div>
          <h3>Secure Shipping</h3>
          <p>Fast and secure delivery to your doorstep with tracking and insurance.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Fair Prices</h3>
          <p>Direct trade ensures artisans get fair compensation for their work.</p>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories">
      <h2 class="section-title">Shop by Category</h2>
      <div class="categories-grid">
        <router-link to="/products?category=textiles" class="category-card">
          <div class="category-icon">🧵</div>
          <h3>Textiles</h3>
          <p>Woven fabrics, embroidered shawls, and traditional cloth</p>
        </router-link>
        <router-link to="/products?category=pottery" class="category-card">
          <div class="category-icon">🍶</div>
          <h3>Pottery</h3>
          <p>Hand-crafted ceramic and terracotta pieces</p>
        </router-link>
        <router-link to="/products?category=handicrafts" class="category-card">
          <div class="category-icon">🏺</div>
          <h3>Handicrafts</h3>
          <p>Metal work, brass items, and decorative objects</p>
        </router-link>
        <router-link to="/products?category=artwork" class="category-card">
          <div class="category-icon">🎭</div>
          <h3>Artwork</h3>
          <p>Paintings, illustrations, and traditional art forms</p>
        </router-link>
        <router-link to="/products?category=woodcraft" class="category-card">
          <div class="category-icon">🖼️</div>
          <h3>Woodcraft</h3>
          <p>Carved wooden items and furniture</p>
        </router-link>
        <router-link to="/products" class="category-card">
          <div class="category-icon">✨</div>
          <h3>All Products</h3>
          <p>Browse our complete collection</p>
        </router-link>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-products">
      <h2 class="section-title">Featured Products</h2>
      <div class="grid grid-3">
        <div v-for="product in featuredProducts" :key="product.id" class="product-card card">
          <router-link :to="`/products/${product.id}`" class="product-link">
            <div class="product-image">{{ product.image }}</div>
          </router-link>
          <div class="card-body">
            <router-link :to="`/products/${product.id}`" class="product-name">
              {{ product.name }}
            </router-link>
            <p class="artisan-name">by {{ product.artisanName }}</p>
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

    <!-- Featured Artisans Section -->
    <section class="featured-artisans">
      <h2 class="section-title">Meet Our Artisans</h2>
      <div class="artisans-grid">
        <div v-for="artisan in featuredArtisans" :key="artisan.id" class="artisan-card card">
          <router-link :to="`/artisans/${artisan.id}`" class="artisan-link">
            <div class="artisan-image">{{ artisan.image }}</div>
          </router-link>
          <div class="card-body">
            <router-link :to="`/artisans/${artisan.id}`" class="artisan-name">
              {{ artisan.name }}
            </router-link>
            <p class="specialty">{{ artisan.specialty }}</p>
            <p class="location">📍 {{ artisan.location }}</p>
            <p class="bio">{{ artisan.bio }}</p>
            <router-link :to="`/artisans/${artisan.id}`" class="btn btn-outline btn-block">
              View Profile
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Support Artisans?</h2>
        <p>Start your journey exploring authentic Indian handicrafts today</p>
        <router-link to="/products" class="btn btn-lg">Explore Collection</router-link>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stat">
        <div class="stat-number">500+</div>
        <p>Authentic Artisans</p>
      </div>
      <div class="stat">
        <div class="stat-number">5000+</div>
        <p>Handmade Products</p>
      </div>
      <div class="stat">
        <div class="stat-number">50K+</div>
        <p>Happy Customers</p>
      </div>
      <div class="stat">
        <div class="stat-number">150+</div>
        <p>Countries Served</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const cartStore = useCartStore()
const productsStore = useProductsStore()

const featuredProducts = computed(() => {
  return productsStore.products.slice(0, 6)
})

const featuredArtisans = computed(() => {
  return productsStore.artisans.slice(0, 4)
})

const addToCart = (product) => {
  cartStore.addItem(product)
  alert(`${product.name} added to cart!`)
}
</script>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 4rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f6f3 0%, #f0ebe5 100%);
  border-radius: 12px;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #d4a574 0%, #a0826d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  margin-bottom: 2rem !important;
  font-size: 1rem !important;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.hero-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  font-size: 4rem;
  text-align: center;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Features Section */
.features {
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(212, 165, 116, 0.15);
  transform: translateY(-4px);
  border-color: var(--primary-color);
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: var(--text-light);
  line-height: 1.6;
}

/* Categories Section */
.categories {
  margin-bottom: 4rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f6f3 0%, #f0ebe5 100%);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  text-align: center;
}

.category-card:hover {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, #f0ebe5 0%, #e8e3dd 100%);
  transform: translateY(-4px);
}

.category-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.category-card h3 {
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.category-card p {
  color: var(--text-light);
  font-size: 0.95rem;
}

/* Featured Products */
.featured-products {
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

/* Featured Artisans */
.featured-artisans {
  margin-bottom: 4rem;
}

.artisans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.artisan-card {
  overflow: hidden;
}

.artisan-link {
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.artisan-image {
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-bg);
  height: 180px;
  transition: transform 0.3s;
}

.artisan-card:hover .artisan-image {
  transform: scale(1.1);
}

.artisan-name {
  display: block;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
}

.artisan-name:hover {
  color: var(--primary-color);
}

.specialty {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.location {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.bio {
  font-size: 0.85rem;
  color: var(--text-dark);
  line-height: 1.4;
  margin-bottom: 1rem;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #d4a574 0%, #a0826d 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 4rem;
}

.cta-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
}

.cta-content p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.cta-content .btn {
  background: white;
  color: var(--primary-color);
}

.cta-content .btn:hover {
  background: var(--light-bg);
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat {
  text-align: center;
  padding: 2rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s;
}

.stat:hover {
  box-shadow: 0 8px 24px rgba(212, 165, 116, 0.15);
  transform: translateY(-4px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat p {
  color: var(--text-light);
  font-size: 0.95rem;
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-content h1 {
    font-size: 2.2rem;
  }

  .emoji-grid {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 1.5rem;
  }

  .hero-content h1 {
    font-size: 1.8rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .emoji-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    font-size: 2rem;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-section {
    padding: 2rem 1rem;
  }

  .cta-content h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.5rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .categories-grid,
  .artisans-grid,
  .stats-section {
    grid-template-columns: 1fr;
  }

  .emoji-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
}
</style>
