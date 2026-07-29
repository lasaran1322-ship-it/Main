# Heritage Handicrafts - Vue 3 Marketplace

A modern, responsive online marketplace for authentic Indian handmade products, connecting skilled artisans with global customers while preserving cultural heritage and supporting local communities.

## 🎨 Features

### Product Management
- **Product Catalog** - Browse 8+ authentic Indian handmade products with detailed information
- **Advanced Filtering** - Filter by category (textiles, handicrafts, pottery, artwork, woodcraft)
- **Search Functionality** - Full-text search across products and descriptions
- **Product Details** - Comprehensive product pages with materials, origin, artisan info, and customer reviews
- **Ratings & Reviews** - Display customer ratings and review counts

### Artisan Showcase
- **Artisan Directory** - Discover 8+ skilled artisans from different regions across India
- **Artisan Profiles** - Detailed profiles with biography, experience, specialty, and product portfolio
- **Authentic Stories** - Learn about each artisan's craft tradition and heritage
- **Regional Crafts** - Showcase traditional crafts from different regions (Rajasthan, Kashmir, Bihar, etc.)

### E-Commerce Features
- **Shopping Cart** - Add/remove/update products with real-time totals
- **Persistent Storage** - Cart data saved to localStorage
- **Checkout Flow** - Multi-step checkout with shipping, billing, and payment
- **Order Summary** - Detailed order review before purchase
- **Discount Codes** - Support for coupon/discount codes

### User Management
- **User Authentication** - Secure login and registration system
- **User Profiles** - Comprehensive user dashboard with:
  - Order history and tracking
  - Wishlist management
  - Account settings and preferences
  - Customer support portal
  - User statistics (orders, spending, reviews)

### Design & UX
- **Responsive Layout** - Mobile-first design that works on all devices
- **Modern UI** - Heritage-inspired color scheme with professional styling
- **Accessibility** - Semantic HTML and accessible form elements
- **Performance** - Optimized bundle size (~165 KB gzipped JS, ~8 KB gzipped CSS)

## 🛠 Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **Build Tool**: Vite
- **Styling**: CSS3 with Grid & Flexbox
- **Package Manager**: npm

## 📁 Project Structure

```
heritage-handicrafts/
├── public/                    # Static assets
├── src/
│   ├── main.js               # Vue app entry point
│   ├── App.vue               # Root component with navigation
│   ├── router/
│   │   └── index.js          # Route configuration
│   ├── stores/
│   │   ├── auth.js           # Authentication state
│   │   ├── cart.js           # Shopping cart state
│   │   └── products.js       # Products & artisans data
│   ├── styles/
│   │   └── main.css          # Global styles
│   └── views/
│       ├── Home.vue          # Homepage
│       ├── Products.vue      # Product catalog
│       ├── ProductDetail.vue # Product details
│       ├── Artisans.vue      # Artisan directory
│       ├── ArtisanDetail.vue # Artisan profile
│       ├── Cart.vue          # Shopping cart
│       ├── Checkout.vue      # Checkout flow
│       ├── Login.vue         # Login page
│       ├── Register.vue      # Registration page
│       └── Profile.vue       # User dashboard
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── index.html                # HTML entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/lasaran1322-ship-it/Main.git
cd Main

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:3000`

## 📝 Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Create production-ready build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint to check code quality
```

## 🎯 Key Routes

- `/` - Homepage with featured products and featured artisans
- `/products` - Product catalog with filtering and search
- `/products/:id` - Product detail page
- `/artisans` - Artisan directory
- `/artisans/:id` - Individual artisan profile
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/login` - User login
- `/register` - User registration
- `/profile` - User profile dashboard

## 🏛️ Featured Artisans

1. **Rajesh Kumar** - Traditional Weaving (Jaipur, Rajasthan)
2. **Meera Sharma** - Brass Work (Moradabad, UP)
3. **Priya Desai** - Block Printing (Bagru, Rajasthan)
4. **Arun Verma** - Stone Inlay (Agra, UP)
5. **Anita Roy** - Terracotta Pottery (Khurja, UP)
6. **Fatima Khan** - Kashmiri Embroidery (Srinagar, Kashmir)
7. **Devi Sharma** - Madhubani Painting (Mithila, Bihar)
8. **Suresh Reddy** - Woodcarving (Kumbakonam, Tamil Nadu)

## 🛍️ Featured Products

- Hand-Woven Rajasthani Rug - $45.99
- Brass Decorative Vase - $32.50
- Indigo Block Print Fabric - $28.00
- Marble Inlay Box - $55.00
- Terracotta Pottery Set - $38.75
- Kashmiri Embroidered Shawl - $95.00
- Madhubani Painting - $85.00
- Wooden Carved Frame - $42.00

## 💾 State Management

### Pinia Stores

#### Auth Store (`stores/auth.js`)
Manages user authentication state:
- `user` - Current logged-in user
- `isAuthenticated` - Authentication status
- `login()` - User login action
- `register()` - User registration action
- `logout()` - User logout action

#### Cart Store (`stores/cart.js`)
Manages shopping cart:
- `items` - Cart items array
- `total` - Calculated cart total
- `itemCount` - Total items in cart
- `addItem()` - Add product to cart
- `removeItem()` - Remove product from cart
- `updateQuantity()` - Update item quantity
- `clearCart()` - Empty the cart
- Persistent storage with localStorage

#### Products Store (`stores/products.js`)
Contains product and artisan data:
- `products` - Array of all products
- `artisans` - Array of all artisans
- Getters for filtering and searching

## 🎨 Design System

### Color Scheme
- Primary: #C41E3A (Heritage Red)
- Secondary: #D4AF37 (Gold accent)
- Background: #F5F5F5 (Light)
- Text: #333333 (Dark)
- Accent: #8B4513 (Brown)

### Typography
- Headings: Bold, heritage-inspired font
- Body: Clean, readable sans-serif
- Emphasis: Gold accent for key information

### Components
- Navigation bar with logo and links
- Product cards with images and pricing
- Artisan profile cards
- Shopping cart interface
- Multi-step checkout form
- User profile dashboard
- Footer with links and contact info

## 📦 Build Output

The production build generates:
- `dist/index.html` - HTML entry point
- `dist/assets/index-*.css` - Minified global styles (~8 KB gzipped)
- `dist/assets/index-*.js` - Bundled Vue app (~55 KB gzipped)
- Total bundle size: ~165 KB gzipped

## 🔒 Security

- User passwords are stored locally (demo implementation)
- Cart data persisted in browser localStorage
- No sensitive data exposed in frontend code
- CORS-ready for future backend integration

## 🚦 Performance

- Fast initial load with optimized bundle size
- CSS Grid and Flexbox for efficient layouts
- Vue 3 Composition API for better tree-shaking
- Lazy loading support through Vue Router
- Minified production build

## 🤝 Contributing

To contribute to Heritage Handicrafts:

1. Create a feature branch (`git checkout -b feat/new-feature`)
2. Make your changes
3. Commit with clear messages (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feat/new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support & Contact

- Email: hello@heritagecrafts.com
- Phone: +91-1234-567890
- Website: www.heritagecrafts.com

## 🙏 Acknowledgments

Heritage Handicrafts is dedicated to:
- Supporting skilled Indian artisans
- Preserving cultural heritage and traditional crafts
- Connecting global customers with authentic handmade products
- Celebrating the beauty of Indian craftsmanship

---

**Made with ❤️ to preserve and promote Indian cultural heritage**

Heritage Handicrafts © 2024. All rights reserved.
