<template>
  <div class="artisans-page">
    <h1 class="section-title">Our Artisans</h1>
    <p class="section-subtitle">Meet the skilled craftspeople preserving Indian heritage</p>

    <div class="artisans-layout">
      <aside class="filters-sidebar">
        <div class="filter-card card">
          <h3>Search</h3>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search artisans..."
            class="search-input"
          >
        </div>

        <div class="filter-card card">
          <h3>Specialty</h3>
          <div class="filter-options">
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedSpecialty" 
                value=""
              >
              <span>All Specialties</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedSpecialty" 
                value="Weaving"
              >
              <span>Weaving</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedSpecialty" 
                value="Pottery"
              >
              <span>Pottery</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedSpecialty" 
                value="Embroidery"
              >
              <span>Embroidery</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedSpecialty" 
                value="Metalwork"
              >
              <span>Metalwork</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model="selectedSpecialty" 
                value="Carving"
              >
              <span>Carving</span>
            </label>
          </div>
        </div>

        <div class="filter-card card">
          <h3>Experience</h3>
          <div class="filter-options">
            <label class="filter-label">
              <input 
                type="radio" 
                v-model.number="selectedExperience" 
                :value="0"
              >
              <span>All Levels</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model.number="selectedExperience" 
                :value="15"
              >
              <span>15+ years</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model.number="selectedExperience" 
                :value="20"
              >
              <span>20+ years</span>
            </label>
            <label class="filter-label">
              <input 
                type="radio" 
                v-model.number="selectedExperience" 
                :value="25"
              >
              <span>25+ years</span>
            </label>
          </div>
        </div>

        <button @click="resetFilters" class="btn btn-secondary btn-block">Reset Filters</button>
      </aside>

      <main class="artisans-main">
        <div class="sort-bar">
          <span class="result-count">Showing {{ filteredArtisans.length }} artisans</span>
          <select v-model="sortBy" class="sort-select">
            <option value="featured">Featured</option>
            <option value="experience">Most Experienced</option>
            <option value="products">Most Products</option>
          </select>
        </div>

        <div v-if="filteredArtisans.length === 0" class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <p class="empty-state-text">No artisans found</p>
          <button @click="resetFilters" class="btn">Clear Filters</button>
        </div>

        <div v-else class="artisans-grid">
          <div v-for="artisan in sortedArtisans" :key="artisan.id" class="artisan-card card">
            <router-link :to="`/artisans/${artisan.id}`" class="artisan-link">
              <div class="artisan-image">{{ artisan.image }}</div>
            </router-link>
            <div class="card-body">
              <router-link :to="`/artisans/${artisan.id}`" class="artisan-name">
                {{ artisan.name }}
              </router-link>
              <p class="specialty">{{ artisan.specialty }}</p>
              <p class="location">📍 {{ artisan.location }}</p>
              
              <div class="artisan-stats">
                <div class="stat">
                  <span class="stat-value">{{ artisan.yearsExperience }}+</span>
                  <span class="stat-label">Years</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ artisan.productsCount }}</span>
                  <span class="stat-label">Products</span>
                </div>
              </div>

              <p class="bio">{{ artisan.bio }}</p>
              
              <router-link :to="`/artisans/${artisan.id}`" class="btn btn-outline btn-block">
                View Profile
              </router-link>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductsStore } from '../stores/products'

const productsStore = useProductsStore()

const searchQuery = ref('')
const selectedSpecialty = ref('')
const selectedExperience = ref(0)
const sortBy = ref('featured')

const filteredArtisans = computed(() => {
  let artisans = productsStore.artisans

  // Filter by search query
  if (searchQuery.value) {
    artisans = artisans.filter(a =>
      a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.specialty.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by specialty
  if (selectedSpecialty.value) {
    artisans = artisans.filter(a => a.specialty.includes(selectedSpecialty.value))
  }

  // Filter by experience
  if (selectedExperience.value > 0) {
    artisans = artisans.filter(a => a.yearsExperience >= selectedExperience.value)
  }

  return artisans
})

const sortedArtisans = computed(() => {
  let artisans = [...filteredArtisans.value]

  switch (sortBy.value) {
    case 'experience':
      artisans.sort((a, b) => b.yearsExperience - a.yearsExperience)
      break
    case 'products':
      artisans.sort((a, b) => b.productsCount - a.productsCount)
      break
    default:
      // featured order
      break
  }

  return artisans
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedSpecialty.value = ''
  selectedExperience.value = 0
  sortBy.value = 'featured'
}
</script>

<style scoped>
.artisans-page {
  width: 100%;
}

.artisans-layout {
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

.artisans-main {
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

.artisans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.artisan-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.artisan-link {
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.artisan-image {
  font-size: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-bg);
  height: 220px;
  transition: transform 0.3s;
}

.artisan-card:hover .artisan-image {
  transform: scale(1.1);
}

.card-body {
  padding: 1.5rem !important;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.artisan-name {
  display: block;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.artisan-name:hover {
  color: var(--primary-color);
}

.specialty {
  font-size: 0.95rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.location {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.artisan-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--light-bg);
  border-radius: 6px;
  text-align: center;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-light);
  text-transform: uppercase;
}

.bio {
  font-size: 0.85rem;
  color: var(--text-dark);
  line-height: 1.5;
  margin-bottom: auto;
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .artisans-layout {
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

  .artisans-grid {
    grid-template-columns: 1fr;
  }

  .sort-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .artisans-grid {
    gap: 1rem;
  }

  .filter-card {
    padding: 1rem !important;
  }

  .artisan-stats {
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .stat-value {
    font-size: 1.1rem;
  }
}
</style>
