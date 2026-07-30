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
    setupEventListeners();
    loadDemoData();
    console.log('Library Management System initialized');
});

// ===== Event Listeners =====
function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Member nav buttons
    document.querySelectorAll('#member-dashboard .nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });

    // Librarian nav buttons
    document.querySelectorAll('#librarian-dashboard .nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });

    // Admin nav buttons
    document.querySelectorAll('#admin-dashboard .nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });

    // Member search and filter
    document.getElementById('search-box')?.addEventListener('keyup', filterBooks);
    document.getElementById('filter-category')?.addEventListener('change', filterBooks);
}

// ===== Authentication =====
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    if (!username || !password || !role) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Simple demo authentication
    if (password !== 'pass') {
        showNotification('Invalid credentials', 'error');
        return;
    }

    appState.currentUser = {
        id: 'USER_' + Date.now(),
        username,
        role,
        loginTime: new Date()
    };

    // Hide login screen
    document.getElementById('login-screen').style.display = 'none';

    // Show appropriate dashboard
    document.getElementById('member-dashboard').classList.remove('active');
    document.getElementById('librarian-dashboard').classList.remove('active');
    document.getElementById('admin-dashboard').classList.remove('active');
    
    document.getElementById(`${role}-dashboard`).classList.add('active');

    // Load dashboard data
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
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('member-dashboard').classList.remove('active');
    document.getElementById('librarian-dashboard').classList.remove('active');
    document.getElementById('admin-dashboard').classList.remove('active');
    document.getElementById('login-form').reset();
    showNotification('Logged out successfully', 'success');
}

// ===== Navigation =====
function handleNavigation(e) {
    if (e.target.classList.contains('logout')) return;
    
    const sectionName = e.target.dataset.section;
    if (!sectionName) return;

    const dashboard = e.target.closest('.navbar').parentElement.querySelector('.container');
    const role = appState.currentUser.role;
    
    // Hide all sections
    dashboard.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    dashboard.querySelector(`#${sectionName}`).classList.add('active');

    // Update nav buttons
    e.target.parentElement.querySelectorAll('.nav-btn:not(.logout)').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Load section data
    if (sectionName === 'browse') loadBrowseBooks();
    else if (sectionName === 'borrowed') loadBorrowedBooks();
    else if (sectionName === 'reservations') loadReservations();
    else if (sectionName === 'fines') loadMemberFines();
    else if (sectionName === 'circulation') loadCirculation();
    else if (sectionName === 'inventory') loadInventory();
    else if (sectionName === 'members') loadMembers();
    else if (sectionName === 'reports') loadReports();
    else if (sectionName === 'analytics') loadAnalytics();
    else if (sectionName === 'users') loadUsers();
}

// ===== Member Dashboard Functions =====
function loadMemberDashboard() {
    loadBrowseBooks();
}

function loadBrowseBooks() {
    const grid = document.getElementById('books-grid');
    grid.innerHTML = '';

    appState.books.forEach(book => {
        const available = book.availableCopies > 0;
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-cover">📖</div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>By ${book.author}</p>
                <p>Category: ${book.category}</p>
                <span class="book-availability ${available ? 'available' : 'unavailable'}">
                    ${available ? `${book.availableCopies} Available` : 'Unavailable'}
                </span>
                <div class="book-actions">
                    ${available ? `<button class="book-actions button btn-borrow" onclick="borrowBook(${book.id})">Borrow</button>` : ''}
                    <button class="book-actions button btn-reserve" onclick="reserveBook(${book.id})">Reserve</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterBooks() {
    const searchTerm = document.getElementById('search-box').value.toLowerCase();
    const category = document.getElementById('filter-category').value;

    const filtered = appState.books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                             book.author.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || book.category === category;
        return matchesSearch && matchesCategory;
    });

    const grid = document.getElementById('books-grid');
    grid.innerHTML = '';

    filtered.forEach(book => {
        const available = book.availableCopies > 0;
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-cover">📖</div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>By ${book.author}</p>
                <p>Category: ${book.category}</p>
                <span class="book-availability ${available ? 'available' : 'unavailable'}">
                    ${available ? `${book.availableCopies} Available` : 'Unavailable'}
                </span>
                <div class="book-actions">
                    ${available ? `<button class="book-actions button btn-borrow" onclick="borrowBook(${book.id})">Borrow</button>` : ''}
                    <button class="book-actions button btn-reserve" onclick="reserveBook(${book.id})">Reserve</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No books found matching your criteria</p></div>';
    }
}

function borrowBook(bookId) {
    const book = appState.books.find(b => b.id === bookId);
    if (!book) return;

    if (book.availableCopies <= 0) {
        showNotification('This book is currently unavailable', 'error');
        return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const loan = {
        id: 'LOAN_' + Date.now(),
        memberId: appState.currentUser.id,
        bookId,
        bookTitle: book.title,
        borrowedDate: new Date(),
        dueDate,
        returnedDate: null,
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
        id: 'RES_' + Date.now(),
        memberId: appState.currentUser.id,
        bookId,
        bookTitle: book.title,
        reservedDate: new Date(),
        position: 1,
        status: 'pending'
    };

    appState.reservations.push(reservation);
    showNotification(`Successfully reserved "${book.title}"`, 'success');
}

function loadBorrowedBooks() {
    const tbody = document.getElementById('borrowed-list');
    tbody.innerHTML = '';

    const memberLoans = appState.loans.filter(loan => 
        loan.memberId === appState.currentUser.id && loan.status === 'active'
    );

    if (memberLoans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No books currently borrowed</td></tr>';
        return;
    }

    memberLoans.forEach(loan => {
        const today = new Date();
        const daysLeft = Math.ceil((loan.dueDate - today) / (1000 * 60 * 60 * 24));
        const isOverdue = daysLeft < 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.bookTitle}</td>
            <td>Author</td>
            <td>${loan.borrowedDate.toDateString()}</td>
            <td>${loan.dueDate.toDateString()}</td>
            <td>${isOverdue ? `<strong style="color: red;">Overdue by ${Math.abs(daysLeft)} days</strong>` : `${daysLeft} days`}</td>
            <td><button class="btn-return" onclick="returnBook('${loan.id}')">Return</button></td>
        `;
        tbody.appendChild(row);
    });
}

function returnBook(loanId) {
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan) return;

    const book = appState.books.find(b => b.id === loan.bookId);
    if (book) {
        book.availableCopies++;
    }

    loan.status = 'returned';
    loan.returnedDate = new Date();

    showNotification(`Successfully returned "${loan.bookTitle}"`, 'success');
    loadBorrowedBooks();
}

function loadReservations() {
    const tbody = document.getElementById('reservations-list');
    tbody.innerHTML = '';

    const memberReservations = appState.reservations.filter(res => 
        res.memberId === appState.currentUser.id
    );

    if (memberReservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No reservations</td></tr>';
        return;
    }

    memberReservations.forEach(res => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${res.bookTitle}</td>
            <td>Author</td>
            <td>${res.reservedDate.toDateString()}</td>
            <td>${res.position}</td>
            <td>${res.status}</td>
            <td><button class="btn-cancel" onclick="cancelReservation('${res.id}')">Cancel</button></td>
        `;
        tbody.appendChild(row);
    });
}

function cancelReservation(resId) {
    const index = appState.reservations.findIndex(r => r.id === resId);
    if (index > -1) {
        const res = appState.reservations[index];
        appState.reservations.splice(index, 1);
        showNotification(`Reservation for "${res.bookTitle}" cancelled`, 'success');
        loadReservations();
    }
}

function loadMemberFines() {
    const tbody = document.getElementById('fines-list');
    tbody.innerHTML = '';

    const memberFines = appState.fines.filter(fine => 
        fine.memberId === appState.currentUser.id
    );

    if (memberFines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No fines</td></tr>';
        return;
    }

    memberFines.forEach(fine => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fine.bookTitle}</td>
            <td>$${fine.amount.toFixed(2)}</td>
            <td>${fine.reason}</td>
            <td>${fine.date.toDateString()}</td>
            <td>${fine.status}</td>
            <td>${fine.status === 'pending' ? '<button class="btn-borrow" onclick="payFine(\'' + fine.id + '\')">Pay</button>' : 'Paid'}</td>
        `;
        tbody.appendChild(row);
    });
}

function payFine(fineId) {
    const fine = appState.fines.find(f => f.id === fineId);
    if (fine) {
        fine.status = 'paid';
        showNotification(`Fine of $${fine.amount} paid successfully`, 'success');
        loadMemberFines();
    }
}

// ===== Librarian Dashboard Functions =====
function loadLibrarianDashboard() {
    loadCirculation();
}

function loadCirculation() {
    const tbody = document.getElementById('circulation-list');
    tbody.innerHTML = '';

    appState.loans.forEach(loan => {
        if (loan.status === 'active') {
            const member = appState.members.find(m => m.id === loan.memberId) || { username: 'Unknown' };
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.username || 'Unknown'}</td>
                <td>${loan.bookTitle}</td>
                <td>${loan.borrowedDate.toDateString()}</td>
                <td>${loan.dueDate.toDateString()}</td>
                <td>Active</td>
                <td><button class="btn-return" onclick="processReturn('${loan.id}')">Process Return</button></td>
            `;
            tbody.appendChild(row);
        }
    });

    if (appState.loans.filter(l => l.status === 'active').length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No active loans</td></tr>';
    }
}

function processReturn(loanId) {
    returnBook(loanId);
    loadCirculation();
}

function loadInventory() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';

    appState.books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-cover">📖</div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>By ${book.author}</p>
                <p>ISBN: ${book.isbn}</p>
                <p>Total Copies: ${book.totalCopies}</p>
                <p>Available: ${book.availableCopies}</p>
                <div class="book-actions">
                    <button class="btn-borrow" onclick="editBook(${book.id})">Edit</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function editBook(bookId) {
    const book = appState.books.find(b => b.id === bookId);
    if (book) {
        const newTotal = prompt(`Edit total copies for "${book.title}":`, book.totalCopies);
        if (newTotal !== null) {
            book.totalCopies = parseInt(newTotal);
            showNotification(`Book inventory updated`, 'success');
            loadInventory();
        }
    }
}

function loadMembers() {
    const tbody = document.getElementById('members-list');
    tbody.innerHTML = '';

    appState.members.forEach(member => {
        const borrowedCount = appState.loans.filter(l => 
            l.memberId === member.id && l.status === 'active'
        ).length;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.username}</td>
            <td>${member.email}</td>
            <td>${borrowedCount}</td>
            <td>Active</td>
            <td><button class="btn-borrow" onclick="viewMemberDetails('${member.id}')">View</button></td>
        `;
        tbody.appendChild(row);
    });

    if (appState.members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No members</td></tr>';
    }
}

function viewMemberDetails(memberId) {
    const member = appState.members.find(m => m.id === memberId);
    if (member) {
        alert(`Member: ${member.username}\nEmail: ${member.email}\nJoined: ${member.joinDate?.toDateString() || 'N/A'}`);
    }
}

// ===== Admin Dashboard Functions =====
function loadAdminDashboard() {
    loadReports();
}

function loadReports() {
    const container = document.getElementById('reports-container');
    container.innerHTML = `
        <div class="data-table" style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3>Quick Statistics</h3>
            <p><strong>Total Books:</strong> ${appState.books.length}</p>
            <p><strong>Total Active Loans:</strong> ${appState.loans.filter(l => l.status === 'active').length}</p>
            <p><strong>Total Members:</strong> ${appState.members.length}</p>
            <p><strong>Pending Reservations:</strong> ${appState.reservations.filter(r => r.status === 'pending').length}</p>
            <p><strong>Outstanding Fines:</strong> $${appState.fines.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0).toFixed(2)}</p>
        </div>
    `;
}

function loadAnalytics() {
    const container = document.getElementById('analytics-container');
    
    const totalBorrowed = appState.loans.length;
    const totalReturned = appState.loans.filter(l => l.status === 'returned').length;
    const activeLoans = appState.loans.filter(l => l.status === 'active').length;

    container.innerHTML = `
        <div class="data-table" style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3>Library Analytics</h3>
            <p><strong>Total Books Borrowed (All Time):</strong> ${totalBorrowed}</p>
            <p><strong>Total Books Returned:</strong> ${totalReturned}</p>
            <p><strong>Currently Active Loans:</strong> ${activeLoans}</p>
            <p><strong>Category Distribution:</strong></p>
            <ul>
                ${Array.from(new Set(appState.books.map(b => b.category))).map(cat => {
                    const count = appState.books.filter(b => b.category === cat).length;
                    return `<li>${cat}: ${count} books</li>`;
                }).join('')}
            </ul>
        </div>
    `;
}

function loadUsers() {
    const tbody = document.getElementById('users-list');
    tbody.innerHTML = `
        <tr>
            <td>admin</td>
            <td>Administrator</td>
            <td>admin@library.local</td>
            <td>Active</td>
            <td><button class="btn-borrow" onclick="alert('User management options')">Manage</button></td>
        </tr>
        <tr>
            <td>librarian</td>
            <td>Librarian</td>
            <td>librarian@library.local</td>
            <td>Active</td>
            <td><button class="btn-borrow" onclick="alert('User management options')">Manage</button></td>
        </tr>
        <tr>
            <td>member</td>
            <td>Member</td>
            <td>member@library.local</td>
            <td>Active</td>
            <td><button class="btn-borrow" onclick="alert('User management options')">Manage</button></td>
        </tr>
    `;
}

// ===== Utilities =====
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateRoleDisplay() {
    const role = document.getElementById('role').value;
    if (role) {
        console.log('Selected role:', role);
    }
}

// ===== Demo Data =====
function loadDemoData() {
    // Demo books
    appState.books = [
        { id: 1, isbn: 'ISBN001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', totalCopies: 3, availableCopies: 1, publishedYear: 1925 },
        { id: 2, isbn: 'ISBN002', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', totalCopies: 2, availableCopies: 0, publishedYear: 1960 },
        { id: 3, isbn: 'ISBN003', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', totalCopies: 4, availableCopies: 2, publishedYear: 2011 },
        { id: 4, isbn: 'ISBN004', title: 'Cosmos', author: 'Carl Sagan', category: 'Science', totalCopies: 3, availableCopies: 3, publishedYear: 1980 },
        { id: 5, isbn: 'ISBN005', title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', totalCopies: 5, availableCopies: 2, publishedYear: 2008 },
        { id: 6, isbn: 'ISBN006', title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', totalCopies: 2, availableCopies: 1, publishedYear: 1951 },
        { id: 7, isbn: 'ISBN007', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', totalCopies: 3, availableCopies: 2, publishedYear: 1988 },
        { id: 8, isbn: 'ISBN008', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', category: 'Technology', totalCopies: 4, availableCopies: 3, publishedYear: 1999 }
    ];

    // Demo members
    appState.members = [
        { id: 'MEM001', username: 'john_doe', email: 'john@example.com', joinDate: new Date('2023-01-15') },
        { id: 'MEM002', username: 'jane_smith', email: 'jane@example.com', joinDate: new Date('2023-06-20') },
        { id: 'MEM003', username: 'bob_wilson', email: 'bob@example.com', joinDate: new Date('2024-01-10') }
    ];

    // Demo fines
    appState.fines = [
        { id: 'FINE001', memberId: 'MEM001', bookTitle: 'The Great Gatsby', amount: 5.00, reason: 'Late return', date: new Date('2024-01-20'), status: 'pending' }
    ];
}
