# 🍕 Food Express - Food Delivery System

A modern, responsive food delivery platform built with HTML, CSS, and JavaScript. Food Express provides a complete solution for customers to order food, restaurants to manage menus, delivery partners to track deliveries, and admins to oversee the entire platform.

## 📋 Features

### Customer Dashboard
- **Restaurant Browsing**: Browse and search restaurants
- **Category Filtering**: Filter by food categories (Pizza, Burgers, Sushi, Salads)
- **Menu Exploration**: View detailed menus for each restaurant
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Placement**: Place orders with delivery address and payment info
- **Order Tracking**: Real-time order tracking with delivery status
- **Order History**: View past orders and details
- **Profile Management**: Update personal information and addresses

### Restaurant Dashboard
- **Menu Management**: Add, edit, and delete menu items
- **Order Management**: View and manage incoming orders
- **Order Status Updates**: Update order status (pending, preparing, ready, out for delivery, delivered)
- **Analytics**: View daily revenue, total orders, and ratings
- **Recent Orders**: Track recent incoming orders

### Delivery Partner Dashboard
- **Available Orders**: View and accept delivery orders
- **Active Deliveries**: Manage active delivery orders
- **Delivery Tracking**: Update delivery status and location
- **Earnings Dashboard**: Track daily earnings and completed deliveries
- **Performance Metrics**: View rating and acceptance rate
- **Delivery History**: View past deliveries

### Admin Dashboard
- **System Analytics**: Overall platform statistics
- **User Management**: View and manage all registered users
- **Restaurant Management**: Monitor all restaurants and their metrics
- **Order Monitoring**: Track all orders across the platform
- **Delivery Management**: Monitor delivery partners
- **Platform Revenue**: Track total revenue

## 🎨 Design Features

- **Modern UI**: Clean, intuitive interface with gradient backgrounds and smooth animations
- **Responsive Design**: Fully responsive on desktop, tablet, and mobile devices
- **Color Scheme**: Professional gradient palette (blue to purple)
- **Interactive Elements**: Hover effects, smooth transitions, and user feedback
- **Accessibility**: Proper semantic HTML and readable typography

## 🔐 Authentication System

### Demo Accounts

**Customer:**
- Email: `demo@customer.com`
- Password: `demo`

**Restaurant:**
- Email: `demo@restaurant.com`
- Password: `demo`

**Delivery Partner:**
- Email: `demo@delivery.com`
- Password: `demo`

**Admin:**
- Email: `admin@foodexpress.com`
- Password: `admin`

### Registration
Users can create new accounts with:
- Full Name
- Email
- Password
- Phone Number
- User Type Selection

## 💾 Data Storage

All data is stored locally using:
- **LocalStorage**: For persistent user sessions and data
- **In-memory State**: Managed through AppState class
- **JSON Serialization**: For data persistence

## 🛠 Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **State Management**: Client-side AppState class
- **Storage**: Browser LocalStorage API
- **Routing**: Single Page Application (SPA) pattern

## 📁 Project Structure

```
food-express/
├── index.html          # Main HTML file with all dashboards
├── styles.css          # Comprehensive CSS styling
├── app.js              # Main JavaScript application logic
└── README.md           # Documentation
```

## 🚀 Getting Started

1. **Open the Application**
   ```
   Open index.html in a modern web browser
   ```

2. **Login with Demo Account**
   - Select user type (Customer, Restaurant, Delivery, Admin)
   - Use demo credentials above
   - Click Login

3. **Explore Features**
   - Try different user roles
   - Browse restaurants and place orders
   - Manage menus as a restaurant
   - Accept deliveries as a delivery partner
   - Monitor platform as admin

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above - Multi-column layouts
- **Tablet**: 768px - 1023px - Optimized grid layouts
- **Mobile**: Below 768px - Single column, touch-optimized

## 🎯 User Workflows

### Customer Workflow
1. Login or Register
2. Browse Restaurants
3. View Restaurant Menu
4. Add Items to Cart
5. Place Order
6. Track Order Status
7. View Order History

### Restaurant Workflow
1. Login to Dashboard
2. View Incoming Orders
3. Update Order Status
4. Manage Menu Items
5. View Analytics and Revenue

### Delivery Partner Workflow
1. Login to Dashboard
2. Accept Available Orders
3. Navigate to Restaurant
4. Pick Up Order
5. Update Delivery Status
6. Complete Delivery
7. Track Earnings

### Admin Workflow
1. Login to Admin Panel
2. View Platform Statistics
3. Manage Users
4. Monitor Restaurants
5. Track Orders
6. Monitor Delivery Partners

## 🔄 Order Lifecycle

1. **Pending**: Customer places order
2. **Confirmed**: Restaurant accepts order
3. **Preparing**: Restaurant is preparing food
4. **Ready**: Food is ready for pickup
5. **Out for Delivery**: Delivery partner is delivering
6. **Delivered**: Order delivered to customer

## 💡 Key Components

### AppState
Central state management class handling:
- User data
- Restaurant data
- Order management
- Delivery tracking
- Analytics

### AuthManager
Authentication logic:
- User login
- User registration
- Session management
- Demo account handling

### Dashboard Classes
- `CustomerDashboard`: Customer interface
- `RestaurantDashboard`: Restaurant management
- `DeliveryDashboard`: Delivery tracking
- `AdminDashboard`: Platform administration

## 🎨 Color Palette

- **Primary Gradient**: Blue (#4F46E5) to Purple (#A855F7)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Danger**: Red (#EF4444)
- **Background**: Light Gray (#F9FAFB)
- **Text**: Dark Gray (#1F2937)

## 📊 Sample Data

The application comes pre-loaded with:
- 4 Sample Restaurants (Pizza Palace, Burger Haven, Sushi Station, Green Salad Bar)
- 12 Menu Items per Restaurant
- Sample Orders and Delivery Data
- User Analytics

## 🔒 Security Considerations

- Passwords are stored locally (demo/development only)
- Production: Implement secure backend authentication
- Sensitive data should be encrypted
- API calls should use HTTPS
- Implement proper authorization checks

## 🚀 Future Enhancements

- Real-time notifications using WebSockets
- Payment gateway integration (Stripe, PayPal)
- Google Maps integration for delivery tracking
- Push notifications for order updates
- Advanced filtering and search
- User ratings and reviews
- Loyalty program
- Multiple language support
- Dark mode theme
- Mobile app (React Native)

## 📞 Support

For issues or questions, please refer to the code documentation or contact the development team.

---

**Food Express** - Making Food Delivery Simple and Delicious 🍕🚀