// Food Express - Main Application Logic

// ==================== DATA MANAGEMENT ====================

class AppState {
    constructor() {
        this.currentUser = null;
        this.restaurants = this.initializeRestaurants();
        this.orders = this.loadOrders();
        this.users = this.loadUsers();
        this.deliveryPartners = this.loadDeliveryPartners();
        this.cart = [];
    }

    initializeRestaurants() {
        return [
            {
                id: 1,
                name: "Pizza Palace",
                rating: 4.8,
                deliveryTime: "25-35 min",
                categories: ["pizza"],
                image: "🍕",
                menu: [
                    { id: 1, name: "Margherita", price: 12.99, category: "pizza" },
                    { id: 2, name: "Pepperoni", price: 14.99, category: "pizza" },
                    { id: 3, name: "Veggie Supreme", price: 13.99, category: "pizza" }
                ]
            },
            {
                id: 2,
                name: "Burger Station",
                rating: 4.6,
                deliveryTime: "20-30 min",
                categories: ["burger"],
                image: "🍔",
                menu: [
                    { id: 4, name: "Classic Burger", price: 9.99, category: "burger" },
                    { id: 5, name: "Double Cheese", price: 11.99, category: "burger" },
                    { id: 6, name: "Bacon Blaster", price: 12.99, category: "burger" }
                ]
            },
            {
                id: 3,
                name: "Sushi Supreme",
                rating: 4.9,
                deliveryTime: "30-45 min",
                categories: ["sushi"],
                image: "🍣",
                menu: [
                    { id: 7, name: "California Roll", price: 10.99, category: "sushi" },
                    { id: 8, name: "Spicy Tuna", price: 11.99, category: "sushi" },
                    { id: 9, name: "Dragon Roll", price: 14.99, category: "sushi" }
                ]
            },
            {
                id: 4,
                name: "Green Salad Bar",
                rating: 4.5,
                deliveryTime: "15-25 min",
                categories: ["salad"],
                image: "🥗",
                menu: [
                    { id: 10, name: "Caesar Salad", price: 8.99, category: "salad" },
                    { id: 11, name: "Greek Salad", price: 9.99, category: "salad" },
                    { id: 12, name: "Quinoa Bowl", price: 10.99, category: "salad" }
                ]
            }
        ];
    }

    loadOrders() {
        const stored = localStorage.getItem('orders');
        return stored ? JSON.parse(stored) : [];
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    loadUsers() {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    loadDeliveryPartners() {
        const stored = localStorage.getItem('deliveryPartners');
        return stored ? JSON.parse(stored) : [];
    }

    saveDeliveryPartners() {
        localStorage.setItem('deliveryPartners', JSON.stringify(this.deliveryPartners));
    }

    addUser(user) {
        user.id = Date.now();
        this.users.push(user);
        this.saveUsers();
        return user;
    }

    getRestaurantMenu(restaurantId) {
        const restaurant = this.restaurants.find(r => r.id === restaurantId);
        return restaurant ? restaurant.menu : [];
    }
}

// Global app state
let appState = new AppState();

// ==================== AUTHENTICATION ====================

class AuthManager {
    static login(email, password, userType) {
        const user = appState.users.find(u => u.email === email && u.password === password);
        
        if (user && user.type === userType) {
            appState.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        }

        // Demo accounts
        if (email === 'demo@customer.com' && password === 'demo') {
            const demoUser = {
                id: 'demo1',
                name: 'Demo Customer',
                email: email,
                type: 'customer',
                phone: '+1 (555) 000-0001',
                address: '123 Main St'
            };
            appState.currentUser = demoUser;
            localStorage.setItem('currentUser', JSON.stringify(demoUser));
            return { success: true, user: demoUser };
        }
        if (email === 'demo@restaurant.com' && password === 'demo') {
            const demoUser = {
                id: 'demo2',
                name: 'Demo Restaurant',
                email: email,
                type: 'restaurant',
                phone: '+1 (555) 000-0002'
            };
            appState.currentUser = demoUser;
            localStorage.setItem('currentUser', JSON.stringify(demoUser));
            return { success: true, user: demoUser };
        }
        if (email === 'demo@delivery.com' && password === 'demo') {
            const demoUser = {
                id: 'demo3',
                name: 'Demo Delivery',
                email: email,
                type: 'delivery',
                phone: '+1 (555) 000-0003',
                vehicle: 'bike'
            };
            appState.currentUser = demoUser;
            localStorage.setItem('currentUser', JSON.stringify(demoUser));
            return { success: true, user: demoUser };
        }
        if (email === 'admin@foodexpress.com' && password === 'admin') {
            const demoUser = {
                id: 'admin',
                name: 'Admin',
                email: email,
                type: 'admin'
            };
            appState.currentUser = demoUser;
            localStorage.setItem('currentUser', JSON.stringify(demoUser));
            return { success: true, user: demoUser };
        }

        return { success: false, error: 'Invalid credentials' };
    }

    static register(name, email, password, phone, userType) {
        if (appState.users.find(u => u.email === email)) {
            return { success: false, error: 'Email already registered' };
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            phone,
            type: userType,
            createdAt: new Date().toISOString()
        };

        appState.addUser(newUser);
        appState.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true, user: newUser };
    }

    static logout() {
        appState.currentUser = null;
        appState.cart = [];
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
    }

    static getCurrentUser() {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    }
}

// ==================== UI ROUTING ====================

class Router {
    static showPage(pageName) {
        document.querySelectorAll('.page-container').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageName).classList.add('active');
    }

    static showSection(sectionId, pageName) {
        document.querySelectorAll(`#${pageName} .page-section`).forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }
}

// ==================== CUSTOMER DASHBOARD ====================

class CustomerDashboard {
    static init() {
        this.setupEventListeners();
        this.loadRestaurants();
    }

    static setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('#customer-page .nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.page;
                if (section) {
                    document.querySelectorAll('#customer-page .nav-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    Router.showSection(section, 'customer-page');
                }
            });
        });

        // Search
        const searchInput = document.getElementById('search-restaurant');
        searchInput?.addEventListener('input', (e) => {
            this.filterRestaurants(e.target.value);
        });

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadRestaurants(e.target.dataset.filter);
            });
        });

        // Profile save
        document.querySelector('#customer-profile .btn-primary')?.addEventListener('click', () => {
            this.saveProfile();
        });

        // Logout
        document.querySelectorAll('#customer-page #logout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                AuthManager.logout();
                Router.showPage('auth-page');
            });
        });
    }

    static loadRestaurants(filter = 'all') {
        const grid = document.getElementById('restaurants-grid');
        grid.innerHTML = '';

        let filtered = appState.restaurants;
        if (filter !== 'all') {
            filtered = filtered.filter(r => r.categories.includes(filter));
        }

        filtered.forEach(restaurant => {
            const card = document.createElement('div');
            card.className = 'restaurant-card';
            card.innerHTML = `
                <div class="restaurant-image">${restaurant.image}</div>
                <div class="restaurant-info">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-rating">${restaurant.rating} ⭐ • ${restaurant.deliveryTime}</div>
                    <div class="restaurant-categories">
                        ${restaurant.categories.map(cat => `<span class="category-badge">${cat}</span>`).join('')}
                    </div>
                    <button class="btn btn-primary btn-full" onclick="CustomerDashboard.viewRestaurant(${restaurant.id})">
                        View Menu
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    static filterRestaurants(query) {
        const grid = document.getElementById('restaurants-grid');
        const cards = grid.querySelectorAll('.restaurant-card');

        cards.forEach(card => {
            const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
            const categories = Array.from(card.querySelectorAll('.category-badge')).map(b => b.textContent.toLowerCase()).join(' ');
            const visible = name.includes(query.toLowerCase()) || categories.includes(query.toLowerCase());
            card.style.display = visible ? '' : 'none';
        });
    }

    static viewRestaurant(restaurantId) {
        const restaurant = appState.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return;

        const html = `
            <div class="container">
                <button class="btn btn-secondary" onclick="CustomerDashboard.loadRestaurants()">← Back</button>
                <h2>${restaurant.name}</h2>
                <div class="restaurant-info">
                    <div class="restaurant-rating">${restaurant.rating} ⭐ • ${restaurant.deliveryTime}</div>
                </div>
                <h3>Menu</h3>
                <div id="restaurant-menu-items" class="menu-items-grid"></div>
            </div>
        `;

        document.getElementById('customer-home').innerHTML = html;

        const menuContainer = document.getElementById('restaurant-menu-items');
        restaurant.menu.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'menu-item-card';
            itemCard.innerHTML = `
                <div class="menu-item-image">🍽️</div>
                <div class="menu-item-info">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <p class="menu-item-price">$${item.price.toFixed(2)}</p>
                    <button class="btn btn-primary btn-full" onclick="CustomerDashboard.addToCart(${item.id}, '${item.name}', ${item.price})">
                        Add to Cart
                    </button>
                </div>
            `;
            menuContainer.appendChild(itemCard);
        });
    }

    static addToCart(itemId, itemName, price) {
        const existingItem = appState.cart.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            appState.cart.push({
                id: itemId,
                name: itemName,
                price: price,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(appState.cart));
        alert(`${itemName} added to cart! (${appState.cart.length} items)`);
    }

    static loadOrders() {
        const list = document.querySelector('#customer-orders .orders-list');
        list.innerHTML = '';

        const userOrders = appState.orders.filter(o => o.customerId === appState.currentUser.id);

        if (userOrders.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p>No orders yet</p></div>';
            return;
        }

        userOrders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div style="font-size: 0.9rem; color: #666;">${new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <span>Total:</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
                ${order.status === 'completed' ? `
                    <div class="order-actions">
                        <button class="btn btn-secondary btn-small" onclick="CustomerDashboard.rateOrder(${order.id})">Rate Order</button>
                    </div>
                ` : ''}
                ${order.status === 'confirmed' || order.status === 'out_for_delivery' ? `
                    <div class="order-actions">
                        <button class="btn btn-secondary btn-small" onclick="CustomerDashboard.trackOrder(${order.id})">Track Order</button>
                    </div>
                ` : ''}
            `;
            list.appendChild(card);
        });
    }

    static trackOrder(orderId) {
        const order = appState.orders.find(o => o.id === orderId);
        if (!order) return;

        const trackingHtml = `
            <div class="container">
                <button class="btn btn-secondary" onclick="CustomerDashboard.loadOrders()">← Back</button>
                <h2>Track Order #${order.id}</h2>
                <div class="tracking-map">🗺️ Map View</div>
                <div class="tracking-status">
                    <div class="tracking-step ${order.status === 'confirmed' || ['out_for_delivery', 'completed'].includes(order.status) ? 'active' : ''}">
                        <div class="tracking-step-icon">✓</div>
                        <div class="tracking-step-title">Confirmed</div>
                    </div>
                    <div class="tracking-step ${order.status === 'out_for_delivery' || order.status === 'completed' ? 'active' : ''}">
                        <div class="tracking-step-icon">🚚</div>
                        <div class="tracking-step-title">Out for Delivery</div>
                    </div>
                    <div class="tracking-step ${order.status === 'completed' ? 'active' : ''}">
                        <div class="tracking-step-icon">📍</div>
                        <div class="tracking-step-title">Delivered</div>
                    </div>
                </div>
                <div class="order-card">
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.getElementById('customer-orders').innerHTML = trackingHtml;
    }

    static rateOrder(orderId) {
        alert('Thank you for your feedback! Your rating has been recorded.');
    }

    static saveProfile() {
        const name = document.getElementById('customer-name').value;
        const phone = document.getElementById('customer-phone').value;
        const address = document.getElementById('customer-address').value;

        if (name && phone && address) {
            appState.currentUser.name = name;
            appState.currentUser.phone = phone;
            appState.currentUser.address = address;
            localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
            alert('Profile updated successfully!');
        } else {
            alert('Please fill all fields');
        }
    }

    static loadProfile() {
        document.getElementById('customer-name').value = appState.currentUser.name || '';
        document.getElementById('customer-email').value = appState.currentUser.email || '';
        document.getElementById('customer-phone').value = appState.currentUser.phone || '';
        document.getElementById('customer-address').value = appState.currentUser.address || '';
    }
}

// ==================== RESTAURANT DASHBOARD ====================

class RestaurantDashboard {
    static init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.loadOrders('pending');
    }

    static setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('#restaurant-page .nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.page;
                if (section) {
                    document.querySelectorAll('#restaurant-page .nav-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    Router.showSection(section, 'restaurant-page');
                    
                    if (section === 'restaurant-menu') this.loadMenu();
                    if (section === 'restaurant-orders') this.loadOrders('pending');
                    if (section === 'restaurant-analytics') this.loadAnalytics();
                }
            });
        });

        // Add menu item
        document.getElementById('add-item-btn')?.addEventListener('click', () => {
            document.getElementById('add-item-modal').classList.add('show');
        });

        document.querySelector('.close')?.addEventListener('click', () => {
            document.getElementById('add-item-modal').classList.remove('show');
        });

        document.getElementById('add-item-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMenuItem();
        });

        // Order tabs
        document.querySelectorAll('.order-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.order-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.loadOrders(e.target.dataset.status);
            });
        });

        // Logout
        document.querySelectorAll('#restaurant-page #logout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                AuthManager.logout();
                Router.showPage('auth-page');
            });
        });
    }

    static loadDashboard() {
        const restaurantOrders = appState.orders.filter(o => o.restaurantId === appState.currentUser.id);
        const totalOrders = restaurantOrders.length;
        const todayRevenue = restaurantOrders
            .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
            .reduce((sum, o) => sum + o.total, 0);
        const activeOrders = restaurantOrders.filter(o => ['pending', 'preparing'].includes(o.status)).length;

        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('today-revenue').textContent = `$${todayRevenue.toFixed(2)}`;
        document.getElementById('active-orders').textContent = activeOrders;
        document.getElementById('restaurant-rating').textContent = '4.8⭐';

        this.loadRecentOrders();
    }

    static loadRecentOrders() {
        const list = document.getElementById('recent-orders');
        list.innerHTML = '';

        const restaurantOrders = appState.orders
            .filter(o => o.restaurantId === appState.currentUser.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        if (restaurantOrders.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No orders yet</p></div>';
            return;
        }

        restaurantOrders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <span>Total:</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
            `;
            list.appendChild(card);
        });
    }

    static loadMenu() {
        const container = document.getElementById('menu-items');
        container.innerHTML = '';

        const restaurant = appState.restaurants.find(r => r.id === appState.currentUser.id);
        if (!restaurant) return;

        restaurant.menu.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-item-card';
            card.innerHTML = `
                <div class="menu-item-image">🍽️</div>
                <div class="menu-item-info">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <p class="menu-item-price">$${item.price.toFixed(2)}</p>
                    <p style="font-size: 0.9rem; color: #666;">Category: ${item.category}</p>
                    <div class="menu-item-actions">
                        <button class="btn btn-secondary btn-small" onclick="RestaurantDashboard.editMenuItem(${item.id})">Edit</button>
                        <button class="btn btn-danger btn-small" onclick="RestaurantDashboard.deleteMenuItem(${item.id})">Delete</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    static addMenuItem() {
        const name = document.getElementById('item-name').value;
        const description = document.getElementById('item-description').value;
        const price = parseFloat(document.getElementById('item-price').value);
        const category = document.getElementById('item-category').value;

        if (!name || !price) {
            alert('Please fill required fields');
            return;
        }

        const restaurant = appState.restaurants.find(r => r.id === appState.currentUser.id);
        if (!restaurant) return;

        const newItem = {
            id: Math.max(...restaurant.menu.map(m => m.id), 0) + 1,
            name,
            description,
            price,
            category
        };

        restaurant.menu.push(newItem);
        document.getElementById('add-item-form').reset();
        document.getElementById('add-item-modal').classList.remove('show');
        this.loadMenu();
        alert('Menu item added successfully!');
    }

    static editMenuItem(itemId) {
        alert('Edit functionality would open an edit form');
    }

    static deleteMenuItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            const restaurant = appState.restaurants.find(r => r.id === appState.currentUser.id);
            if (restaurant) {
                restaurant.menu = restaurant.menu.filter(m => m.id !== itemId);
                this.loadMenu();
                alert('Item deleted successfully!');
            }
        }
    }

    static loadOrders(status = 'pending') {
        const list = document.getElementById('restaurant-orders-list');
        list.innerHTML = '';

        let filteredOrders = appState.orders
            .filter(o => o.restaurantId === appState.currentUser.id && o.status === status)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (filteredOrders.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No orders with this status</p></div>';
            return;
        }

        filteredOrders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div style="font-size: 0.9rem; color: #666;">${new Date(order.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <span>Total:</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
                <div class="order-actions">
                    ${status === 'pending' ? `
                        <button class="btn btn-success btn-small" onclick="RestaurantDashboard.updateOrderStatus(${order.id}, 'preparing')">Accept</button>
                        <button class="btn btn-danger btn-small" onclick="RestaurantDashboard.updateOrderStatus(${order.id}, 'cancelled')">Reject</button>
                    ` : ''}
                    ${status === 'preparing' ? `
                        <button class="btn btn-success btn-small" onclick="RestaurantDashboard.updateOrderStatus(${order.id}, 'ready')">Ready</button>
                    ` : ''}
                    ${status === 'ready' ? `
                        <button class="btn btn-success btn-small" onclick="RestaurantDashboard.updateOrderStatus(${order.id}, 'out_for_delivery')">Picked Up</button>
                    ` : ''}
                </div>
            `;
            list.appendChild(card);
        });
    }

    static updateOrderStatus(orderId, newStatus) {
        const order = appState.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            appState.saveOrders();
            this.loadOrders(newStatus);
            this.loadDashboard();
            alert(`Order status updated to ${newStatus}`);
        }
    }

    static loadAnalytics() {
        const restaurantOrders = appState.orders.filter(o => o.restaurantId === appState.currentUser.id);
        const totalRevenue = restaurantOrders.reduce((sum, o) => sum + o.total, 0);
        const avgOrderValue = restaurantOrders.length > 0 ? totalRevenue / restaurantOrders.length : 0;

        document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('total-orders-analytics').textContent = restaurantOrders.length;
        document.getElementById('avg-order-value').textContent = `$${avgOrderValue.toFixed(2)}`;
    }
}

// ==================== DELIVERY DASHBOARD ====================

class DeliveryDashboard {
    static init() {
        this.setupEventListeners();
        this.loadHome();
    }

    static setupEventListeners() {
        document.querySelectorAll('#delivery-page .nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.page;
                if (section) {
                    document.querySelectorAll('#delivery-page .nav-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    Router.showSection(section, 'delivery-page');
                    
                    if (section === 'delivery-home') this.loadHome();
                    if (section === 'delivery-active') this.loadActiveDeliveries();
                    if (section === 'delivery-history') this.loadHistory();
                    if (section === 'delivery-profile') this.loadProfile();
                }
            });
        });

        document.querySelectorAll('#delivery-page #logout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                AuthManager.logout();
                Router.showPage('auth-page');
            });
        });

        document.querySelector('#delivery-profile .btn-primary')?.addEventListener('click', () => {
            this.saveProfile();
        });
    }

    static loadHome() {
        document.getElementById('earnings-today').textContent = '$145.50';
        document.getElementById('completed-orders-delivery').textContent = '12';
        document.getElementById('delivery-rating').textContent = '4.8⭐';
        document.getElementById('accept-rate').textContent = '98%';

        this.loadAvailableOrders();
    }

    static loadAvailableOrders() {
        const list = document.getElementById('available-orders');
        list.innerHTML = '';

        const availableOrders = appState.orders.filter(o => o.status === 'ready' && !o.deliveryId);

        if (availableOrders.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No available orders</p></div>';
            return;
        }

        availableOrders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div style="font-size: 0.9rem; color: #666;">Ready for pickup</div>
                    </div>
                    <span class="order-status ready">Ready</span>
                </div>
                <div style="margin-bottom: 1rem;">
                    <p><strong>Pickup:</strong> Restaurant</p>
                    <p><strong>Delivery:</strong> ${order.deliveryAddress || 'Customer Address'}</p>
                </div>
                <div class="order-total">
                    <span>Earning:</span>
                    <span>$${(order.total * 0.15).toFixed(2)}</span>
                </div>
                <div class="order-actions">
                    <button class="btn btn-success btn-full" onclick="DeliveryDashboard.acceptOrder(${order.id})">Accept Order</button>
                </div>
            `;
            list.appendChild(card);
        });
    }

    static acceptOrder(orderId) {
        const order = appState.orders.find(o => o.id === orderId);
        if (order) {
            order.deliveryId = appState.currentUser.id;
            order.status = 'out_for_delivery';
            appState.saveOrders();
            this.loadHome();
            this.loadActiveDeliveries();
            alert('Order accepted! You are now delivering this order.');
        }
    }

    static loadActiveDeliveries() {
        const list = document.getElementById('active-deliveries');
        list.innerHTML = '';

        const activeDeliveries = appState.orders.filter(o => o.deliveryId === appState.currentUser.id && o.status === 'out_for_delivery');

        if (activeDeliveries.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No active deliveries</p></div>';
            return;
        }

        activeDeliveries.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <span class="order-status out_for_delivery">On the way</span>
                </div>
                <div class="tracking-map">📍 GPS Tracking Active</div>
                <div style="margin-bottom: 1rem;">
                    <p><strong>Customer:</strong> ${order.customerName}</p>
                    <p><strong>Address:</strong> ${order.deliveryAddress}</p>
                    <p><strong>Items:</strong> ${order.items.length}</p>
                </div>
                <div class="order-actions">
                    <button class="btn btn-success" onclick="DeliveryDashboard.markDelivered(${order.id})">Mark Delivered</button>
                </div>
            `;
            list.appendChild(card);
        });
    }

    static markDelivered(orderId) {
        const order = appState.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'completed';
            appState.saveOrders();
            this.loadActiveDeliveries();
            this.loadHome();
            alert('Order marked as delivered!');
        }
    }

    static loadHistory() {
        const list = document.getElementById('delivery-history-list');
        list.innerHTML = '';

        const completedDeliveries = appState.orders.filter(o => o.deliveryId === appState.currentUser.id && o.status === 'completed');

        if (completedDeliveries.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No delivery history</p></div>';
            return;
        }

        completedDeliveries.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div style="font-size: 0.9rem; color: #666;">${new Date(order.completedAt || order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span class="order-status completed">Completed</span>
                </div>
                <div style="margin-bottom: 1rem;">
                    <p><strong>Customer Rating:</strong> 5.0 ⭐</p>
                    <p><strong>Amount Earned:</strong> $${(order.total * 0.15).toFixed(2)}</p>
                </div>
            `;
            list.appendChild(card);
        });
    }

    static loadProfile() {
        document.getElementById('delivery-name').value = appState.currentUser.name || '';
        document.getElementById('delivery-email').value = appState.currentUser.email || '';
        document.getElementById('delivery-phone').value = appState.currentUser.phone || '';
        document.getElementById('vehicle-type').value = appState.currentUser.vehicle || 'bike';
    }

    static saveProfile() {
        const name = document.getElementById('delivery-name').value;
        const phone = document.getElementById('delivery-phone').value;
        const vehicle = document.getElementById('vehicle-type').value;

        if (name && phone && vehicle) {
            appState.currentUser.name = name;
            appState.currentUser.phone = phone;
            appState.currentUser.vehicle = vehicle;
            localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
            alert('Profile updated successfully!');
        } else {
            alert('Please fill all fields');
        }
    }
}

// ==================== ADMIN DASHBOARD ====================

class AdminDashboard {
    static init() {
        this.setupEventListeners();
        this.loadDashboard();
    }

    static setupEventListeners() {
        document.querySelectorAll('#admin-page .nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.page;
                if (section) {
                    document.querySelectorAll('#admin-page .nav-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    Router.showSection(section, 'admin-page');
                    
                    if (section === 'admin-dashboard') this.loadDashboard();
                    if (section === 'admin-users') this.loadUsers();
                    if (section === 'admin-restaurants') this.loadRestaurants();
                    if (section === 'admin-orders') this.loadAllOrders();
                    if (section === 'admin-analytics') this.loadAnalytics();
                }
            });
        });

        document.querySelectorAll('#admin-page #logout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                AuthManager.logout();
                Router.showPage('auth-page');
            });
        });
    }

    static loadDashboard() {
        const totalUsers = appState.users.length;
        const totalRestaurants = appState.restaurants.length;
        const totalOrders = appState.orders.length;
        const platformRevenue = appState.orders.reduce((sum, o) => sum + (o.total * 0.05), 0);

        document.getElementById('total-users').textContent = totalUsers;
        document.getElementById('total-restaurants').textContent = totalRestaurants;
        document.getElementById('total-orders-admin').textContent = totalOrders;
        document.getElementById('platform-revenue').textContent = `$${platformRevenue.toFixed(2)}`;

        this.loadRecentActivity();
    }

    static loadRecentActivity() {
        const list = document.getElementById('recent-activity');
        list.innerHTML = '';

        const recentOrders = appState.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        recentOrders.forEach(order => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon">📦</div>
                <div class="activity-content">
                    <div><strong>Order #${order.id}</strong> - $${order.total.toFixed(2)}</div>
                    <div class="activity-time">${new Date(order.createdAt).toLocaleString()}</div>
                </div>
            `;
            list.appendChild(item);
        });
    }

    static loadUsers() {
        const list = document.getElementById('users-list');
        list.innerHTML = '';

        if (appState.users.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No users registered</p></div>';
            return;
        }

        const header = document.createElement('div');
        header.className = 'table-header';
        header.innerHTML = `
            <div>Name</div>
            <div>Email</div>
            <div>Type</div>
            <div>Actions</div>
        `;
        list.appendChild(header);

        appState.users.forEach(user => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div>${user.name}</div>
                <div>${user.email}</div>
                <div>${user.type}</div>
                <div>
                    <button class="btn btn-secondary btn-small" onclick="AdminDashboard.viewUser(${user.id})">View</button>
                </div>
            `;
            list.appendChild(row);
        });
    }

    static viewUser(userId) {
        const user = appState.users.find(u => u.id === userId);
        if (user) {
            alert(`User: ${user.name}\nEmail: ${user.email}\nType: ${user.type}\nPhone: ${user.phone}`);
        }
    }

    static loadRestaurants() {
        const list = document.getElementById('restaurants-list');
        list.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'table-header';
        header.innerHTML = `
            <div>Name</div>
            <div>Rating</div>
            <div>Menu Items</div>
            <div>Actions</div>
        `;
        list.appendChild(header);

        appState.restaurants.forEach(restaurant => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div>${restaurant.name}</div>
                <div>${restaurant.rating} ⭐</div>
                <div>${restaurant.menu.length} items</div>
                <div>
                    <button class="btn btn-secondary btn-small" onclick="AdminDashboard.viewRestaurant(${restaurant.id})">Details</button>
                </div>
            `;
            list.appendChild(row);
        });
    }

    static viewRestaurant(restaurantId) {
        const restaurant = appState.restaurants.find(r => r.id === restaurantId);
        if (restaurant) {
            alert(`Restaurant: ${restaurant.name}\nRating: ${restaurant.rating}\nMenu Items: ${restaurant.menu.length}\nCategories: ${restaurant.categories.join(', ')}`);
        }
    }

    static loadAllOrders() {
        const list = document.getElementById('admin-orders-list');
        list.innerHTML = '';

        if (appState.orders.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No orders</p></div>';
            return;
        }

        appState.orders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div style="font-size: 0.9rem; color: #666;">${new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div style="margin-bottom: 1rem;">
                    <p><strong>Amount:</strong> $${order.total.toFixed(2)}</p>
                    <p><strong>Items:</strong> ${order.items.length}</p>
                </div>
            `;
            list.appendChild(card);
        });
    }

    static loadAnalytics() {
        const todayOrders = appState.orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
        const totalRevenue = appState.orders.reduce((sum, o) => sum + o.total, 0);

        document.getElementById('daily-orders').textContent = todayOrders;
        document.getElementById('month-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
    }
}

// ==================== EVENT LISTENERS & INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = AuthManager.getCurrentUser();

    if (currentUser) {
        Router.showPage(`${currentUser.type}-page`);
        
        if (currentUser.type === 'customer') {
            CustomerDashboard.init();
            CustomerDashboard.loadOrders();
            CustomerDashboard.loadProfile();
        } else if (currentUser.type === 'restaurant') {
            RestaurantDashboard.init();
        } else if (currentUser.type === 'delivery') {
            DeliveryDashboard.init();
        } else if (currentUser.type === 'admin') {
            AdminDashboard.init();
        }
    } else {
        Router.showPage('auth-page');
    }

    // Auth Form Handlers
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const userType = document.getElementById('user-type-login').value;

            const result = AuthManager.login(email, password, userType);
            if (result.success) {
                Router.showPage(`${result.user.type}-page`);
                
                if (result.user.type === 'customer') {
                    CustomerDashboard.init();
                    CustomerDashboard.loadOrders();
                    CustomerDashboard.loadProfile();
                } else if (result.user.type === 'restaurant') {
                    RestaurantDashboard.init();
                } else if (result.user.type === 'delivery') {
                    DeliveryDashboard.init();
                } else if (result.user.type === 'admin') {
                    AdminDashboard.init();
                }
                
                loginForm.reset();
            } else {
                alert(result.error || 'Login failed');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const phone = document.getElementById('register-phone').value;
            const userType = document.getElementById('user-type-register').value;

            const result = AuthManager.register(name, email, password, phone, userType);
            if (result.success) {
                Router.showPage(`${result.user.type}-page`);
                
                if (result.user.type === 'customer') {
                    CustomerDashboard.init();
                    CustomerDashboard.loadOrders();
                    CustomerDashboard.loadProfile();
                } else if (result.user.type === 'restaurant') {
                    RestaurantDashboard.init();
                } else if (result.user.type === 'delivery') {
                    DeliveryDashboard.init();
                }
                
                registerForm.reset();
            } else {
                alert(result.error || 'Registration failed');
            }
        });
    }

    // Tab switching
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            
            this.classList.add('active');
            const formId = this.dataset.tab;
            document.getElementById(formId).classList.add('active');
        });
    });

    // Modal close
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('add-item-modal');
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Sample orders for demonstration
    if (appState.orders.length === 0) {
        const sampleOrders = [
            {
                id: 1001,
                customerId: 'demo1',
                restaurantId: 1,
                customerName: 'John Customer',
                deliveryAddress: '123 Main St, City',
                items: [{ name: 'Margherita Pizza', price: 12.99, quantity: 1 }, { name: 'Coke', price: 2.99, quantity: 1 }],
                total: 15.98,
                status: 'completed',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                completedAt: new Date().toISOString()
            },
            {
                id: 1002,
                customerId: 'demo1',
                restaurantId: 2,
                customerName: 'John Customer',
                deliveryAddress: '123 Main St, City',
                items: [{ name: 'Classic Burger', price: 9.99, quantity: 2 }],
                total: 19.98,
                status: 'confirmed',
                createdAt: new Date().toISOString(),
                deliveryId: 'demo3'
            }
        ];
        appState.orders = sampleOrders;
        appState.saveOrders();
    }
});
