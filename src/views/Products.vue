<template>
  <div class="products-page">
    <h1 class="section-title">Our Products</h1>
    <p class="section-subtitle">Explore authentic Indian handmade products</p>

    <div class="products-layout">
      <aside class="filters-sidebar">
        <div class="filter-card card">
          <h3>Search</h3>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search products..."
            class="search-input"
          >
        </div>

        <div class="filter-card card">
          <h3>Category</h3>
          <div class="filter-options">
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedCategory" 
                value=""
              >
              <span>All Categories</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedCategory" 
                value="textiles"
              >
              <span>Textiles</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedCategory" 
                value="handicrafts"
              >
              <span>Handicrafts</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedCategory" 
                value="pottery"
              >
              <span>Pottery</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedCategory" 
                value="artwork"
              >
              <span>Artwork</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedCategory" 
                value="woodcraft"
              >
              <span>Woodcraft</span>
            </label>
          </div>
        </div>

        <div class="filter-card card">
          <h3>Price Range</h3>
          <div class="slider-container">
            <input 
              v-model.number="priceRange[0]" 
              type="range" 
              min="0" 
              max="200" 
              class="slider"
            >
            <input 
              v-model.number="priceRange[1]" 
              type="range" 
              min="0" 
              max="200" 
              class="slider"
            >
            <div class="price-display">
              <span>${{ priceRange[0] }}</span>
              <span>${{ priceRange[1] }}</span>
            </div>
          </div>
        </div>

        <div class="filter-card card">
          <h3>Rating</h3>
          <div class="filter-options">
            <label class="filter-label">
              <input 
                type="radio" 
                v-model.number="selectedRating" 
                :value="0"
              >
              <span>All Ratings</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model.number="selectedRating" 
                :value="4"
              >
              <span>⭐ 4+ stars</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model.number="selectedRating" 
                :value="4.5"
              >
              <span>⭐ 4.5+ stars</span>
            </label>
          </div>
        </div>

        <button @click="resetFilters" class="btn btn-secondary btn-block">Reset Filters</button>
      </aside>

      <main class="products-main">
        <div class="sort-bar">
          <span class="result-count">Showing {{ filteredProducts.length }} products</span>
          <select v-model="sortBy" class="sort-select">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div v-if="filteredProducts.length === 0" class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <p class="empty-state-text">No products found</p>
          <button @click="resetFilters" class="btn">Clear Filters</button>
        </div>

        <div v-else class="products-grid">
          <div v-for="product in sortedProducts" :key="product.id" class="product-card card">
            <router-link :to="`/products/${product.id}`" class="product-link">
              <div class="product-image">{{ product.image }}</div>
            </router-link>
            <div class="card-body">
              <router-link :to="`/products/${product.id}`" class="product-name">
                {{ product.name }}
              </router-link>
              <p class="artisan-name">by {{ product.artisanName }}</p>
              <p class="category">{{ product.category }}</p>
              <div class="rating">
                <span class="stars">⭐ {{ product.rating }}</span>
                <span class="reviews">({{ product.reviews }})</span>
              </div>
              <p class="price">${{ product.price }}</p>
              <button @click="addToCart(product)" class="btn btn-block">Add to Cart</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const cartStore = useCartStore()
const productsStore = useProductsStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const priceRange = ref([0, 200])
const selectedRating = ref(0)
const sortBy = ref('featured')

const filteredProducts = computed(() => {
  let products = productsStore.products

  // Filter by search query
  if (searchQuery.value) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.artisanName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }

  // Filter by price range
  products = products.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1])

  // Filter by rating
  if (selectedRating.value > 0) {
    products = products.filter(p => p.rating >= selectedRating.value)
  }

  return products
})

const sortedProducts = computed(() => {
  let products = [...filteredProducts.value]

  switch (sortBy.value) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      products.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      products.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      products.reverse()
      break
    default:
      // featured order
      break
  }

  return products
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  priceRange.value = [0, 200]
  selectedRating.value = 0
  sortBy.value = 'featured'
}

const addToCart = (product) => {
  cartStore.addItem(product)
  alert(`${product.name} added to cart!`)
}
</script>

<style scoped>
.products-page {
  width: 100%;
}

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.filters-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-card {
  padding: 1.5rem !important;
}

.filter-card h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.filter-label input {
  width: auto;
  accent-color: var(--primary-color);
}

.slider-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slider {
  width: 100%;
  cursor: pointer;
}

.price-display {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  color: var(--primary-color);
}

.products-main {
  display: flex;
  flex-direction: column;
}

.sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.result-count {
  color: var(--text-light);
  font-size: 0.95rem;
}

.sort-select {
  padding: 0.6rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
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

.category {
  font-size: 0.85rem;
  color: var(--primary-color);
  text-transform: capitalize;
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

@media (max-width: 1024px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .filters-sidebar {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .sort-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .products-grid {
    gap: 1rem;
  }

  .filter-card {
    padding: 1rem !important;
  }

  .sort-bar {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
