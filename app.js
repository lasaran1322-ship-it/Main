// ===== Application State =====
const appState = {
    currentUser: null,
    books: [],
    loans: [],
    reservations: [],
    fines: [],
    members: []
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    setupEventListeners();
    loadDemoData();
    console.log('App initialized');
});

// ===== Event Listeners =====
function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener attached');
    }

    // Member nav buttons
    document.querySelectorAll('#member-dashboard .nav-btn:not(.logout-btn)').forEach(btn => {
        btn.addEventListener('click', (e) => switchSection(e.target.dataset.section, 'member'));
    });

    // Librarian nav buttons
    document.querySelectorAll('#librarian-dashboard .nav-btn:not(.logout-btn)').forEach(btn => {
        btn.addEventListener('click', (e) => switchSection(e.target.dataset.section, 'librarian'));
    });

    // Admin nav buttons
    document.querySelectorAll('#admin-dashboard .nav-btn:not(.logout-btn)').forEach(btn => {
        btn.addEventListener('click', (e) => switchSection(e.target.dataset.section, 'admin'));
    });

    // Member search/filter
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.addEventListener('keyup', filterBooks);
    }

    const filterCategory = document.getElementById('filter-category');
    if (filterCategory) {
        filterCategory.addEventListener('change', filterBooks);
    }
}

// ===== Authentication =====
function handleLogin(e) {
    e.preventDefault();
    console.log('Login attempt');

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value.trim();

    console.log('Username:', username, 'Role:', role);

    if (!username || !password || !role) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Set current user
    appState.currentUser = {
        id: 'USER_' + Date.now(),
        username,
        role,
        loginTime: new Date()
    };

    console.log('User set:', appState.currentUser);

    // Hide login view
    const loginView = document.getElementById('login-view');
    if (loginView) {
        loginView.classList.remove('active');
    }

    // Show appropriate dashboard
    const dashboard = document.getElementById(`${role}-dashboard`);
    if (dashboard) {
        dashboard.classList.add('active');
        console.log('Dashboard shown:', role);
    }

    // Reset form
    document.getElementById('login-form').reset();

    // Load data
    if (role === 'member') {
        loadMemberDashboard();
    } else if (role === 'librarian') {
        loadLibrarianDashboard();
    } else if (role === 'admin') {
        loadAdminDashboard();
    }

    showNotification(`Welcome, ${username}!`, 'success');
}

function logout() {
    appState.currentUser = null;
    
    document.getElementById('login-view').classList.add('active');
    document.getElementById('member-dashboard').classList.remove('active');
    document.getElementById('librarian-dashboard').classList.remove('active');
    document.getElementById('admin-dashboard').classList.remove('active');

    // Reset all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    showNotification('Logged out successfully', 'success');
}

// ===== Section Navigation =====
function switchSection(sectionName, dashboard) {
    const dashboardElement = document.getElementById(`${dashboard}-dashboard`);
    
    // Hide all sections
    dashboardElement.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = dashboardElement.querySelector(`#${sectionName}`);
    if (section) {
        section.classList.add('active');
    }

    // Update nav button active state
    dashboardElement.querySelectorAll('.nav-btn:not(.logout-btn)').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionName) {
            btn.classList.add('active');
        }
    });
}

// ===== Demo Data =====
function loadDemoData() {
    appState.books = [
        { id: 1, isbn: 'ISBN001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', totalCopies: 3, availableCopies: 1, publishedYear: 1925 },
        { id: 2, isbn: 'ISBN002', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', totalCopies: 2, availableCopies: 0, publishedYear: 1960 },
        { id: 3, isbn: 'ISBN003', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', totalCopies: 4, availableCopies: 2, publishedYear: 2011 },
        { id: 4, isbn: 'ISBN004', title: 'Cosmos', author: 'Carl Sagan', category: 'Science', totalCopies: 3, availableCopies: 3, publishedYear: 1980 },
        { id: 5, isbn: 'ISBN005', title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', totalCopies: 5, availableCopies: 2, publishedYear: 2008 },
        { id: 6, isbn: 'ISBN006', title: '1984', author: 'George Orwell', category: 'Fiction', totalCopies: 2, availableCopies: 1, publishedYear: 1949 },
        { id: 7, isbn: 'ISBN007', title: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Science', totalCopies: 2, availableCopies: 1, publishedYear: 1976 },
        { id: 8, isbn: 'ISBN008', title: 'Design Patterns', author: 'Gang of Four', category: 'Technology', totalCopies: 3, availableCopies: 2, publishedYear: 1994 }
    ];

    appState.loans = [
        { id: 'LOAN001', memberId: 'MEM001', bookId: 1, borrowDate: new Date('2026-07-01'), dueDate: new Date('2026-07-15'), returnDate: null, status: 'active' }
    ];

    appState.fines = [
        { id: 'FINE001', memberId: 'MEM001', loanId: 'LOAN001', amount: 50, reason: 'Overdue', status: 'pending', createdDate: new Date('2026-07-20') }
    ];

    appState.reservations = [
        { id: 'RES001', memberId: 'MEM001', bookId: 2, reservationDate: new Date('2026-07-15'), status: 'active' }
    ];

    appState.members = [
        { id: 'MEM001', name: 'John Doe', email: 'john@example.com', phone: '555-1234', joinDate: new Date('2025-01-01'), status: 'active' },
        { id: 'MEM002', name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', joinDate: new Date('2025-03-15'), status: 'active' }
    ];
}

// ===== Member Dashboard =====
function loadMemberDashboard() {
    loadBrowseBooks();
}

function loadBrowseBooks() {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return;

    booksGrid.innerHTML = '';
    appState.books.forEach(book => {
        const availability = book.availableCopies > 0 ? 'Available' : 'Unavailable';
        const availabilityClass = book.availableCopies > 0 ? 'available' : 'unavailable';
        
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover">📖</div>
            <h3>${book.title}</h3>
            <p class="author">${book.author}</p>
            <p class="category">${book.category}</p>
            <p class="year">${book.publishedYear}</p>
            <p class="availability ${availabilityClass}">${availability} (${book.availableCopies}/${book.totalCopies})</p>
            <div class="book-actions">
                ${book.availableCopies > 0 ? `<button class="btn-small" onclick="borrowBook(${book.id})">Borrow</button>` : ''}
                <button class="btn-small-secondary" onclick="reserveBook(${book.id})">Reserve</button>
            </div>
        `;
        booksGrid.appendChild(bookCard);
    });
}

function filterBooks() {
    const searchTerm = (document.getElementById('search-box')?.value || '').toLowerCase();
    const category = document.getElementById('filter-category')?.value || '';

    const filtered = appState.books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                             book.author.toLowerCase().includes(searchTerm) ||
                             book.isbn.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || book.category === category;
        return matchesSearch && matchesCategory;
    });

    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return;

    booksGrid.innerHTML = '';
    filtered.forEach(book => {
        const availability = book.availableCopies > 0 ? 'Available' : 'Unavailable';
        const availabilityClass = book.availableCopies > 0 ? 'available' : 'unavailable';
        
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover">📖</div>
            <h3>${book.title}</h3>
            <p class="author">${book.author}</p>
            <p class="category">${book.category}</p>
            <p class="year">${book.publishedYear}</p>
            <p class="availability ${availabilityClass}">${availability} (${book.availableCopies}/${book.totalCopies})</p>
            <div class="book-actions">
                ${book.availableCopies > 0 ? `<button class="btn-small" onclick="borrowBook(${book.id})">Borrow</button>` : ''}
                <button class="btn-small-secondary" onclick="reserveBook(${book.id})">Reserve</button>
            </div>
        `;
        booksGrid.appendChild(bookCard);
    });
}

function borrowBook(bookId) {
    const book = appState.books.find(b => b.id === bookId);
    if (!book) return;

    if (book.availableCopies <= 0) {
        showNotification('This book is not available', 'error');
        return;
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);

    const loan = {
        id: 'LOAN' + Date.now(),
        memberId: appState.currentUser.id,
        bookId,
        borrowDate,
        dueDate,
        returnDate: null,
        status: 'active'
    };

    appState.loans.push(loan);
    book.availableCopies--;

    showNotification(`Successfully borrowed "${book.title}". Due date: ${dueDate.toDateString()}`, 'success');
    loadBrowseBooks();
}

function reserveBook(bookId) {
    const book = appState.books.find(b => b.id === bookId);
    if (!book) return;

    const reservation = {
        id: 'RES' + Date.now(),
        memberId: appState.currentUser.id,
        bookId,
        reservationDate: new Date(),
        status: 'active'
    };

    appState.reservations.push(reservation);
    showNotification(`Successfully reserved "${book.title}"`, 'success');
}

function loadBorrowedBooks() {
    const borrowed = appState.loans.filter(loan => 
        loan.memberId === appState.currentUser.id && loan.status === 'active'
    );

    const tbody = document.getElementById('borrowed-books');
    if (!tbody) return;

    tbody.innerHTML = '';
    borrowed.forEach(loan => {
        const book = appState.books.find(b => b.id === loan.bookId);
        if (!book) return;

        const today = new Date();
        const daysLeft = Math.ceil((loan.dueDate - today) / (1000 * 60 * 60 * 24));
        const isOverdue = daysLeft < 0;

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${loan.borrowDate.toDateString()}</td>
            <td>${loan.dueDate.toDateString()}</td>
            <td class="${isOverdue ? 'overdue' : ''}">${daysLeft}</td>
            <td><button class="btn-small" onclick="returnBook('${loan.id}')">Return</button></td>
        `;
    });

    if (borrowed.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No borrowed books</td></tr>';
    }
}

function returnBook(loanId) {
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan) return;

    loan.returnDate = new Date();
    loan.status = 'returned';

    const book = appState.books.find(b => b.id === loan.bookId);
    if (book) {
        book.availableCopies++;
    }

    showNotification('Book returned successfully', 'success');
    loadBorrowedBooks();
    loadBrowseBooks();
}

function loadReservations() {
    const reserved = appState.reservations.filter(res => 
        res.memberId === appState.currentUser.id && res.status === 'active'
    );

    const tbody = document.getElementById('reserved-books');
    if (!tbody) return;

    tbody.innerHTML = '';
    reserved.forEach(reservation => {
        const book = appState.books.find(b => b.id === reservation.bookId);
        if (!book) return;

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${reservation.reservationDate.toDateString()}</td>
            <td><button class="btn-small" onclick="cancelReservation('${reservation.id}')">Cancel</button></td>
        `;
    });

    if (reserved.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">No active reservations</td></tr>';
    }
}

function cancelReservation(resId) {
    const reservation = appState.reservations.find(r => r.id === resId);
    if (reservation) {
        reservation.status = 'cancelled';
        showNotification('Reservation cancelled', 'success');
        loadReservations();
    }
}

function loadMemberFines() {
    const memberFines = appState.fines.filter(f => f.memberId === appState.currentUser.id);

    const tbody = document.getElementById('fines-list');
    if (!tbody) return;

    tbody.innerHTML = '';
    memberFines.forEach(fine => {
        const loan = appState.loans.find(l => l.id === fine.loanId);
        const book = loan ? appState.books.find(b => b.id === loan.bookId) : null;

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${book ? book.title : 'Unknown'}</td>
            <td>₹${fine.amount}</td>
            <td>${fine.reason}</td>
            <td><span class="status-badge ${fine.status}">${fine.status}</span></td>
            <td>${fine.createdDate.toDateString()}</td>
            ${fine.status === 'pending' ? `<td><button class="btn-small" onclick="payFine('${fine.id}')">Pay</button></td>` : '<td>-</td>'}
        `;
    });

    if (memberFines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No fines</td></tr>';
    }
}

function payFine(fineId) {
    const fine = appState.fines.find(f => f.id === fineId);
    if (fine) {
        fine.status = 'paid';
        showNotification(`Fine of ₹${fine.amount} paid successfully`, 'success');
        loadMemberFines();
    }
}

// ===== Librarian Dashboard =====
function loadLibrarianDashboard() {
    loadCirculation();
}

function loadCirculation() {
    const tbody = document.getElementById('circulation-table');
    if (!tbody) return;

    tbody.innerHTML = '';
    appState.loans.filter(l => l.status === 'active').forEach(loan => {
        const book = appState.books.find(b => b.id === loan.bookId);
        const member = appState.members.find(m => m.id === loan.memberId) || { name: 'Unknown' };

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${member.name}</td>
            <td>${loan.borrowDate.toDateString()}</td>
            <td>${loan.dueDate.toDateString()}</td>
            <td><button class="btn-small" onclick="processReturn('${loan.id}')">Process Return</button></td>
        `;
    });

    if (appState.loans.filter(l => l.status === 'active').length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No active loans</td></tr>';
    }
}

function processReturn(loanId) {
    returnBook(loanId);
}

function loadInventory() {
    const tbody = document.getElementById('inventory-table');
    if (!tbody) return;

    tbody.innerHTML = '';
    appState.books.forEach(book => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${book.isbn}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.totalCopies}</td>
            <td>${book.availableCopies}</td>
            <td>${book.totalCopies - book.availableCopies}</td>
            <td><button class="btn-small" onclick="editBook(${book.id})">Edit</button></td>
        `;
    });
}

function editBook(bookId) {
    const book = appState.books.find(b => b.id === bookId);
    if (book) {
        const newCopies = prompt(`Current copies: ${book.totalCopies}. Enter new total:`, book.totalCopies);
        if (newCopies && !isNaN(newCopies)) {
            const diff = parseInt(newCopies) - book.totalCopies;
            book.totalCopies = parseInt(newCopies);
            book.availableCopies += diff;
            showNotification('Book inventory updated', 'success');
            loadInventory();
        }
    }
}

// ===== Admin Dashboard =====
function loadAdminDashboard() {
    loadAnalytics();
}

function loadAnalytics() {
    const totalMembers = appState.members.length;
    const totalBooks = appState.books.length;
    const activeLoans = appState.loans.filter(l => l.status === 'active').length;
    const totalFines = appState.fines.reduce((sum, f) => sum + f.amount, 0);

    const analyticsDiv = document.getElementById('analytics-stats');
    if (analyticsDiv) {
        analyticsDiv.innerHTML = `
            <div class="stat-card">
                <h3>${totalMembers}</h3>
                <p>Total Members</p>
            </div>
            <div class="stat-card">
                <h3>${totalBooks}</h3>
                <p>Total Books</p>
            </div>
            <div class="stat-card">
                <h3>${activeLoans}</h3>
                <p>Active Loans</p>
            </div>
            <div class="stat-card">
                <h3>₹${totalFines}</h3>
                <p>Total Fines</p>
            </div>
        `;
    }
}

function loadUsers() {
    const tbody = document.getElementById('users-table');
    if (!tbody) return;

    tbody.innerHTML = '';
    appState.members.forEach(member => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.joinDate.toDateString()}</td>
            <td><span class="status-badge ${member.status}">${member.status}</span></td>
        `;
    });
}

// ===== Notifications =====
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// ===== Modal Functions =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
