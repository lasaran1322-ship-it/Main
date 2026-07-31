// Sample menu items
const menuItems = [
    { id: 1, name: 'Margherita Pizza', description: 'Fresh mozzarella and tomato sauce', price: 12.99, emoji: '🍕' },
    { id: 2, name: 'Pepperoni Pizza', description: 'Classic pepperoni and cheese', price: 14.99, emoji: '🍕' },
    { id: 3, name: 'Veggie Burger', description: 'Delicious plant-based burger', price: 10.99, emoji: '🍔' },
    { id: 4, name: 'Beef Burger', description: 'Juicy beef patty with toppings', price: 13.99, emoji: '🍔' },
    { id: 5, name: 'Caesar Salad', description: 'Fresh greens with caesar dressing', price: 9.99, emoji: '🥗' },
    { id: 6, name: 'Grilled Chicken Salad', description: 'Protein-packed salad', price: 11.99, emoji: '🥗' },
    { id: 7, name: 'Spaghetti Carbonara', description: 'Creamy italian pasta', price: 13.99, emoji: '🍝' },
    { id: 8, name: 'Fries', description: 'Crispy golden fries', price: 4.99, emoji: '🍟' },
    { id: 9, name: 'Chicken Wings', description: 'Spicy and delicious wings', price: 11.99, emoji: '🍗' },
    { id: 10, name: 'Fish & Chips', description: 'Battered fish with fries', price: 14.99, emoji: '🐟' },
    { id: 11, name: 'Tacos', description: 'Three soft tacos with meat', price: 10.99, emoji: '🌮' },
    { id: 12, name: 'Cheesecake', description: 'Decadent creamy cheesecake', price: 7.99, emoji: '🍰' }
];

// Shopping cart
let cart = [];

// Initialize the website
function init() {
    renderMenu();
    loadCart();
}

// Render menu items
function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <div class="menu-item-image">${item.emoji}</div>
            <div class="menu-item-content">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(c => c.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
    showNotification(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
}

// Update quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;

    // Update cart items display
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    subtotalEl.textContent = '$' + subtotal.toFixed(2);
    taxEl.textContent = '$' + tax.toFixed(2);
    totalEl.textContent = '$' + total.toFixed(2);
}

// Toggle cart sidebar (mobile)
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('active');
}

// Clear cart
function clearCart() {
    if (cart.length === 0) {
        alert('Cart is already empty!');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Cart cleared!');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1;
    const itemList = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
    
    alert(`Order placed successfully!\n\nItems: ${itemList}\n\nTotal: $${total.toFixed(2)}\n\nThank you for your order!`);
    
    cart = [];
    saveCart();
    updateCartDisplay();
    toggleCart();
}

// Local storage functions
function saveCart() {
    localStorage.setItem('foodhub_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('foodhub_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartDisplay();
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);
