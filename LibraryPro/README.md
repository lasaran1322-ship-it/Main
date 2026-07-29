# LibraryPro - Library Management System

A modern, comprehensive web-based Library Management System built with **React 19 + TypeScript + Vite** (frontend) and **ASP.NET Core 8 + Entity Framework Core** (backend).

## Overview

LibraryPro enables libraries to efficiently manage books, members, borrowing activities, reservations, fines, and administrative operations through a centralized digital platform.

### Key Features

- **Member Portal**: Browse books, borrow/return, view loans, manage wishlist
- **Librarian Dashboard**: Issue books, manage returns, track overdue items, collect fines
- **Administrator Panel**: User management, inventory tracking, system configuration, analytics
- **Notification System**: Automated reminders for due dates, overdue alerts, reservation notifications
- **Fine Management**: Automatic fine calculation, payment tracking, history reports
- **Search & Catalog**: Advanced book search by title, author, ISBN, category, publisher
- **Reporting & Analytics**: Borrowing statistics, inventory reports, fine collection analytics

---

## Project Structure

```
LibraryPro/
├── backend/                    # ASP.NET Core 8 API
│   ├── Models/                 # Database entities
│   ├── Data/                   # Entity Framework DbContext & migrations
│   ├── Controllers/            # API endpoints
│   ├── Services/               # Business logic
│   ├── Dtos/                   # Data transfer objects
│   ├── Middleware/             # Custom middleware
│   ├── LibraryPro.Api.csproj   # Project file
│   ├── Program.cs              # Startup configuration
│   └── appsettings.json        # Configuration settings
│
├── frontend/                   # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components (Member, Librarian, Admin)
│   │   ├── services/           # API client & business logic
│   │   ├── store/              # Zustand state management
│   │   ├── hooks/              # Custom React hooks
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Dependencies
│   ├── vite.config.ts          # Vite configuration
│   └── tsconfig.json           # TypeScript configuration
│
├── docs/                       # Documentation
│   ├── API.md                  # API specification
│   ├── DATABASE.md             # Database schema
│   ├── SETUP.md                # Setup instructions
│   └── ARCHITECTURE.md         # Architecture overview
│
└── README.md                   # This file
```

---

## Technology Stack

### Frontend
- **React 19.0** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool
- **React Router 6.20** - Client-side routing
- **Zustand 4.4** - State management
- **Axios 1.6** - HTTP client
- **Tailwind CSS 3.3** - Styling
- **Lucide React** - Icon library
- **Date-fns 2.30** - Date utilities

### Backend
- **ASP.NET Core 8.0** - Web API framework
- **Entity Framework Core 8.0** - ORM
- **SQL Server 2019+** - Database
- **ASP.NET Identity** - Authentication & authorization
- **JWT (JSON Web Tokens)** - Secure API authentication
- **SendGrid** - Email notifications
- **Swagger/OpenAPI** - API documentation
- **xUnit** - Unit testing
- **Moq** - Mocking framework

---

## Core Modules

### 1. Member Module
- **Registration & Login** - User authentication with role-based access
- **Profile Management** - Update personal information
- **Book Browsing** - Search and filter books by multiple criteria
- **Borrowing** - Borrow available books (with borrowing limits)
- **Returns** - Return borrowed books, view history
- **Renewals** - Renew active loans (configurable limits)
- **Wishlist** - Mark favorite books for future reference
- **Fine Tracking** - View outstanding and paid fines
- **Reservations** - Reserve unavailable books with queue tracking

### 2. Librarian Module
- **Book Issuance** - Issue books to verified members
- **Return Management** - Accept book returns with status updates
- **Overdue Tracking** - Monitor and manage overdue books
- **Fine Management** - Calculate and collect fines
- **Reservation Management** - Process and manage book reservations
- **Member Verification** - Approve/verify member registrations
- **Reports** - Generate borrowing, fine collection, and inventory reports
- **Inventory Management** - Track book copies and availability

### 3. Administrator Module
- **User Management** - Create, update, delete users and roles
- **Role Configuration** - Define and assign permissions
- **System Settings** - Configure library parameters (fine rates, loan periods, etc.)
- **Book Catalog** - Add/edit/delete books and manage inventory
- **Category Management** - Organize books by categories
- **Author & Publisher Management** - Maintain catalog metadata
- **Analytics Dashboard** - View key performance indicators
- **Audit Logs** - Track system activities and changes
- **Notifications** - Configure notification settings and templates

---

## Database Schema

### Core Entities

```
Users (ASP.NET Identity Users)
├── Id (PK)
├── Email
├── FirstName, LastName
├── PhoneNumber
├── CreatedAt, UpdatedAt
└── Role (Foreign Key to Roles)

Members
├── Id (PK)
├── UserId (FK)
├── MembershipDate
├── ExpiryDate
├── IsActive
└── BorrowingLimit

Books
├── Id (PK)
├── Title
├── ISBN
├── AuthorId (FK)
├── PublisherId (FK)
├── CategoryId (FK)
├── Description
├── Language
├── Pages
├── PublishedYear
└── Status (Available, Issued, Reserved, Lost, Damaged)

BookCopies
├── Id (PK)
├── BookId (FK)
├── Barcode
├── SerialNumber
├── Status
└── AcquisitionDate

BorrowTransactions
├── Id (PK)
├── MemberId (FK)
├── BookId, BookCopyId (FK)
├── IssuedDate
├── DueDate
├── ReturnedDate
├── RenewCount, MaxRenewals
└── Status (Active, Returned, Overdue, Lost, Renewed)

Reservations
├── Id (PK)
├── MemberId, BookId (FK)
├── ReservationDate
├── ExpiryDate
├── QueuePosition
├── Status (Active, OnHold, Fulfilled, Expired, Cancelled)
└── NotificationSentDate

Fines
├── Id (PK)
├── MemberId, BorrowTransactionId (FK)
├── Amount, PaidAmount
├── Type (Overdue, Damage, Loss, Other)
├── Status (Outstanding, PartiallyPaid, Paid, Waived, Cancelled)
└── ImposedDate, PaidDate

Payments
├── Id (PK)
├── FineId (FK)
├── Amount
├── PaymentDate
├── PaymentMethod
├── TransactionReference
└── Notes

AuditLogs
├── Id (PK)
├── UserId (FK)
├── Action, EntityType, EntityId
├── OldValues, NewValues
├── Description
├── Timestamp, IpAddress, UserAgent
└── (Tracks all system changes)

Authors, Publishers, Categories
├── Id (PK)
├── Name
├── Description
└── CreatedAt

Notifications
├── Id (PK)
├── UserId (FK)
├── Type, Title, Message
├── Channel (InApp, Email, SMS)
├── SentDate, ReadDate
└── Reference (Link to related entity)
```

---

## Getting Started

### Prerequisites
- **.NET 8.0 SDK** (for backend)
- **Node.js 18+** (for frontend)
- **SQL Server 2019+** (or SQL Server LocalDB)
- **npm 9+**

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd LibraryPro/backend
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Configure database connection**
   - Update `appsettings.json` with your SQL Server connection string
   - Example: `"DefaultConnection": "Server=.;Database=LibraryProDb;Trusted_Connection=true;"`

4. **Apply migrations and create database**
   ```bash
   dotnet ef database update
   ```

5. **Run the API**
   ```bash
   dotnet run
   ```
   - API runs on `https://localhost:5001`
   - Swagger UI: `https://localhost:5001/swagger`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd LibraryPro/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Books
- `GET /api/books` - List all books (paginated, searchable)
- `GET /api/books/{id}` - Get book details
- `POST /api/books` - Add new book (Admin only)
- `PUT /api/books/{id}` - Update book details
- `DELETE /api/books/{id}` - Delete book

### Borrowing
- `GET /api/borrowing/my-loans` - Get member's active loans
- `POST /api/borrowing/issue` - Issue book to member (Librarian)
- `POST /api/borrowing/return` - Accept book return
- `POST /api/borrowing/renew` - Renew active loan
- `GET /api/borrowing/overdue` - Get overdue books (Librarian)

### Reservations
- `GET /api/reservations` - List member's reservations
- `POST /api/reservations` - Create new reservation
- `DELETE /api/reservations/{id}` - Cancel reservation

### Fines
- `GET /api/fines/my-fines` - Get member's fines
- `POST /api/fines/pay` - Make fine payment
- `GET /api/fines/reports` - Generate fine collection report (Admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/settings` - Update system settings

### Notifications
- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read

---

## Seeding Initial Data

The system includes seed data for testing:

**Demo Credentials:**
- **Member**: member@library.com / password123
- **Librarian**: librarian@library.com / password123
- **Administrator**: admin@library.com / password123

Sample books, authors, publishers, and categories are created during database initialization.

---

## Security Features

- **JWT Authentication** - Secure API authentication with token-based access
- **Role-Based Authorization** - Three-tier access control (Member, Librarian, Admin)
- **Password Hashing** - ASP.NET Identity with bcrypt hashing
- **HTTPS/TLS** - Encrypted data transmission
- **CORS Configuration** - Controlled cross-origin requests
- **Input Validation** - Server-side validation on all endpoints
- **SQL Injection Prevention** - Parameterized queries via Entity Framework
- **XSS Protection** - React's built-in escaping
- **Audit Logging** - All user actions tracked for compliance
- **Rate Limiting** - Prevent abuse (configurable per endpoint)

---

## Testing

### Run Unit Tests (Backend)
```bash
cd backend
dotnet test
```

### Run Integration Tests
```bash
dotnet test --filter "Category=Integration"
```

### Frontend Testing (ESLint)
```bash
cd frontend
npm run lint
```

---

## Deployment

### Backend Deployment
1. Publish the API:
   ```bash
   dotnet publish -c Release -o ./publish
   ```
2. Deploy to Azure App Service, AWS EC2, or your hosting provider
3. Configure environment variables for production (connection strings, JWT keys, etc.)

### Frontend Deployment
1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to:
   - **Netlify**, **Vercel**, **GitHub Pages**, or
   - Static hosting on **Azure Blob Storage**, **AWS S3**, etc.

---

## Configuration

### Backend (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=LibraryProDb;Trusted_Connection=true;"
  },
  "Jwt": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "LibraryPro",
    "Audience": "LibraryProUsers",
    "ExpiryMinutes": 60
  },
  "SendGrid": {
    "ApiKey": "your-sendgrid-api-key"
  },
  "FineSettings": {
    "DailyFineAmount": 10.0,
    "MaxFinePerBook": 50.0
  },
  "BorrowingSettings": {
    "DefaultBorrowDays": 14,
    "MaxRenewals": 2,
    "ReservationHoldDays": 7
  }
}
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_TITLE=LibraryPro
```

---

## Performance Optimization

- **Pagination** - Large result sets are paginated (default: 20 items/page)
- **Caching** - Frequently accessed data cached on frontend and backend
- **Lazy Loading** - Components and images loaded on-demand
- **Code Splitting** - Route-based code splitting with React Router
- **Database Indexing** - Indexes on frequently queried columns
- **API Response Compression** - gzip compression enabled

---

## Monitoring & Logging

- **Application Insights** - Monitor backend performance (Azure)
- **Serilog** - Structured logging for backend
- **Browser DevTools** - Frontend debugging and performance profiling
- **Error Tracking** - Sentry integration (optional)
- **Audit Trail** - Complete audit log of all user actions

---

## Common Issues & Troubleshooting

### Database Connection Issues
```
- Verify SQL Server is running
- Check connection string in appsettings.json
- Ensure database user has proper permissions
```

### CORS Errors
```
- Configure CORS in Program.cs
- Ensure frontend URL is whitelisted
```

### JWT Token Expired
```
- Implement token refresh mechanism
- Check token expiry in Jwt configuration
```

### Frontend API Calls Failing
```
- Verify backend is running
- Check vite.config.ts proxy settings
- Inspect network tab in browser DevTools
```

---

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feat/your-feature`
4. Open a Pull Request

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

## Support & Documentation

- **API Documentation**: [Swagger UI](https://localhost:5001/swagger)
- **Architecture Guide**: See `docs/ARCHITECTURE.md`
- **Database Schema**: See `docs/DATABASE.md`
- **Setup Instructions**: See `docs/SETUP.md`

---

## Roadmap (Future Enhancements)

- [ ] Mobile applications (iOS/Android)
- [ ] E-book reader functionality
- [ ] AI-powered book recommendations
- [ ] Online book purchases integration
- [ ] Inter-library loan management
- [ ] RFID hardware integration
- [ ] Multi-language support
- [ ] Real-time chat support

---

**Built with ❤️ for efficient library management**
