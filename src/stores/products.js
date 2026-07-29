import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const products = ref([
    {
      id: 1,
      name: 'Hand-Woven Rajasthani Rug',
      category: 'textiles',
      price: 45.99,
      image: '🧵',
      artisanId: 1,
      artisanName: 'Rajesh Kumar',
      description: 'Beautiful hand-woven rug from Rajasthan with traditional patterns.',
      materials: ['Wool', 'Natural dyes'],
      origin: 'Jaipur, Rajasthan',
      rating: 4.8,
      reviews: 24
    },
    {
      id: 2,
      name: 'Brass Decorative Vase',
      category: 'handicrafts',
      price: 32.50,
      image: '🏺',
      artisanId: 2,
      artisanName: 'Meera Sharma',
      description: 'Intricate brass vase with traditional Indian embossing.',
      materials: ['Brass'],
      origin: 'Moradabad, Uttar Pradesh',
      rating: 4.6,
      reviews: 18
    },
    {
      id: 3,
      name: 'Indigo Block Print Fabric',
      category: 'textiles',
      price: 28.00,
      image: '🎨',
      artisanId: 3,
      artisanName: 'Priya Desai',
      description: 'Traditional indigo block printed fabric with natural colors.',
      materials: ['Cotton', 'Indigo dye'],
      origin: 'Bagru, Rajasthan',
      rating: 4.9,
      reviews: 32
    },
    {
      id: 4,
      name: 'Marble Inlay Box',
      category: 'handicrafts',
      price: 55.00,
      image: '💎',
      artisanId: 4,
      artisanName: 'Arun Verma',
      description: 'Handcrafted marble box with semi-precious stone inlay work.',
      materials: ['Marble', 'Semi-precious stones'],
      origin: 'Agra, Uttar Pradesh',
      rating: 4.7,
      reviews: 15
    },
    {
      id: 5,
      name: 'Terracotta Pottery Set',
      category: 'pottery',
      price: 38.75,
      image: '🍶',
      artisanId: 5,
      artisanName: 'Anita Roy',
      description: 'Set of hand-shaped terracotta vessels made with traditional techniques.',
      materials: ['Terracotta'],
      origin: 'Khurja, Uttar Pradesh',
      rating: 4.5,
      reviews: 12
    },
    {
      id: 6,
      name: 'Kashmiri Embroidered Shawl',
      category: 'textiles',
      price: 95.00,
      image: '🧣',
      artisanId: 6,
      artisanName: 'Fatima Khan',
      description: 'Luxurious wool shawl with intricate Kashmiri embroidery.',
      materials: ['Wool', 'Silk thread'],
      origin: 'Srinagar, Kashmir',
      rating: 4.9,
      reviews: 28
    },
    {
      id: 7,
      name: 'Madhubani Painting',
      category: 'artwork',
      price: 85.00,
      image: '🎭',
      artisanId: 7,
      artisanName: 'Devi Sharma',
      description: 'Traditional Madhubani painting on handmade paper.',
      materials: ['Handmade paper', 'Natural colors'],
      origin: 'Mithila, Bihar',
      rating: 4.8,
      reviews: 20
    },
    {
      id: 8,
      name: 'Wooden Carved Frame',
      category: 'woodcraft',
      price: 42.00,
      image: '🖼️',
      artisanId: 8,
      artisanName: 'Suresh Reddy',
      description: 'Intricately carved wooden frame with traditional motifs.',
      materials: ['Rosewood'],
      origin: 'Kumbakonam, Tamil Nadu',
      rating: 4.6,
      reviews: 14
    }
  ])

  const artisans = ref([
    {
      id: 1,
      name: 'Rajesh Kumar',
      specialty: 'Traditional Weaving',
      location: 'Jaipur, Rajasthan',
      image: '👨‍🦱',
      bio: 'Master weaver with 30 years of experience in creating traditional Rajasthani textiles.',
      yearsExperience: 30,
      productsCount: 12
    },
    {
      id: 2,
      name: 'Meera Sharma',
      specialty: 'Brass Work',
      location: 'Moradabad, Uttar Pradesh',
      image: '👩',
      bio: 'Expert in traditional brass embossing and metalwork techniques.',
      yearsExperience: 20,
      productsCount: 8
    },
    {
      id: 3,
      name: 'Priya Desai',
      specialty: 'Block Printing',
      location: 'Bagru, Rajasthan',
      image: '👩‍🦰',
      bio: 'Specialist in natural indigo dyeing and block printing since childhood.',
      yearsExperience: 25,
      productsCount: 15
    },
    {
      id: 4,
      name: 'Arun Verma',
      specialty: 'Stone Inlay',
      location: 'Agra, Uttar Pradesh',
      image: '👨',
      bio: 'Creator of intricate marble inlay work, continuing family tradition.',
      yearsExperience: 22,
      productsCount: 10
    },
    {
      id: 5,
      name: 'Anita Roy',
      specialty: 'Terracotta Pottery',
      location: 'Khurja, Uttar Pradesh',
      image: '👩‍🦲',
      bio: 'Traditional potter creating functional and decorative terracotta pieces.',
      yearsExperience: 18,
      productsCount: 20
    },
    {
      id: 6,
      name: 'Fatima Khan',
      specialty: 'Kashmiri Embroidery',
      location: 'Srinagar, Kashmir',
      image: '👩‍🎨',
      bio: 'Skilled embroiderer preserving the art of Kashmiri needlework.',
      yearsExperience: 28,
      productsCount: 6
    },
    {
      id: 7,
      name: 'Devi Sharma',
      specialty: 'Madhubani Painting',
      location: 'Mithila, Bihar',
      image: '👩‍🎭',
      bio: 'Artist continuing the ancient Madhubani painting tradition.',
      yearsExperience: 35,
      productsCount: 25
    },
    {
      id: 8,
      name: 'Suresh Reddy',
      specialty: 'Woodcarving',
      location: 'Kumbakonam, Tamil Nadu',
      image: '👨‍🔧',
      bio: 'Master craftsman in traditional wooden carving with intricate detailing.',
      yearsExperience: 32,
      productsCount: 18
    }
  ])

  const getProductById = (id) => {
    return products.value.find(p => p.id === parseInt(id))
  }

  const getArtisanById = (id) => {
    return artisans.value.find(a => a.id === parseInt(id))
  }

  const getArtisanProducts = (artisanId) => {
    return products.value.filter(p => p.artisanId === parseInt(artisanId))
  }

  return {
    products,
    artisans,
    getProductById,
    getArtisanById,
    getArtisanProducts
  }
})
