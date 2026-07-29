# LibraryPro Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│                    React 19 + TypeScript                        │
│          (Member | Librarian | Admin Dashboards)               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (REST API via Axios)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     API Layer (ASP.NET Core)                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              API Controllers                              │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ AuthController | BookController | BorrowController │ │  │
│  │  │ FineController | ReservationController | AdminCtrl  │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Business Logic Layer (Services)                  │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ AuthService | BookService | BorrowingService       │ │  │
│  │  │ FineService | ReservationService | NotifService    │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Data Access Layer (Repositories)               │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  Entity Framework Core + DbContext                   │ │  │
│  │  │  Generic Repository Pattern                          │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SQL Server Database                          │  │
│  │  (Users | Books | Members | BorrowTransactions | Fines)  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Cross-Cutting Concerns                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Authentication | Authorization | Logging | Auditing     │  │
│  │ Error Handling | Caching | Notification | Email         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── pages/           # Page components
│   │   ├── member/      # Member module pages
│   │   ├── librarian/   # Librarian module pages
│   │   └── admin/       # Admin module pages
│   ├── components/      # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── store/          # Zustand state management
│   │   └── authStore.ts
│   ├── services/       # API services
│   │   └── api.ts
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### State Management
- **Zustand**: Lightweight state management for authentication
- **React Context** (optional): For theme and global UI state
- **Local Component State**: For form inputs and UI interactions

### Component Hierarchy
```
<App>
  ├── <Router>
  │   ├── <Login>        (public)
  │   ├── <Register>     (public)
  │   └── <Layout>       (protected)
  │       ├── <Navigation>
  │       ├── <Sidebar>
  │       └── <Outlet>
  │           ├── <MemberDashboard>
  │           ├── <BrowseBooks>
  │           ├── <MyLoans>
  │           └── <Wishlist>
  │           ├── <LibrarianDashboard>
  │           └── <AdminDashboard>
```

---

## Backend Architecture

### Project Structure
```
backend/
├── Models/             # Entity models
├── Data/               # DbContext and migrations
├── Dtos/               # Data transfer objects
├── Controllers/        # API endpoints
├── Services/           # Business logic
├── Repositories/       # Data access (optional)
├── Middleware/         # Custom middleware
├── Utilities/          # Helper functions
├── Migrations/         # EF Core migrations
├── appsettings.json    # Configuration
└── Program.cs          # Application setup
```

### Design Patterns Used

#### 1. **Repository Pattern** (Optional)
```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}
```

#### 2. **Service/Business Logic Pattern**
Services handle business logic and coordinate between controllers and repositories:
```csharp
public interface IBookService
{
    Task<BookDto> AddBookAsync(CreateBookRequest request);
    Task<BookDto?> GetBookByIdAsync(Guid id);
    // ...
}
```

#### 3. **Dependency Injection**
All services are registered in the DI container:
```csharp
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBookService, BookService>();
```

#### 4. **DTO Pattern**
Data Transfer Objects separate domain models from API responses:
```csharp
public class BookDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    // ...
}
```

#### 5. **Middleware Pattern**
Custom middleware for cross-cutting concerns:
```csharp
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<AuditLoggingMiddleware>();
```

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │◄──────────────┐
├─────────────────┤               │
│ Id (PK)         │               │
│ Email (Unique)  │               │
│ PasswordHash    │               │
│ FirstName       │               │
│ LastName        │               │
│ PhoneNumber     │               │
│ CreatedAt       │               │
│ IsDeleted       │               │
└─────────────────┘               │
        │                         │
        ├───────┬─────────┬───────┘
        │       │         │
    (1:1)   (1:N)     (1:N)
        │       │         │
        ▼       ▼         ▼
    ┌────────────────┐  ┌──────────────┐  ┌──────────────┐
    │   Members      │  │   Roles      │  │ AuditLogs    │
    ├────────────────┤  ├──────────────┤  ├──────────────┤
    │ UserId (FK)    │  │ Id (PK)      │  │ UserId (FK)  │
    │ JoinDate       │  │ Name         │  │ Action       │
    │ IsActive       │  └──────────────┘  │ EntityType   │
    │ Address        │         ▲          │ Timestamp    │
    └────────────────┘         │          └──────────────┘
            │                  │ (1:N)
            │                  │
        (1:N)             ┌──────────┐
            │             │UserRoles │
            │             ├──────────┤
            │             │ UserId   │
            │             │ RoleId   │
            │             └──────────┘
            │
        ┌───┴─────┬──────────┬──────────┐
        │         │          │          │
    (1:N)    (1:N)      (1:N)      (1:N)
        │         │          │          │
        ▼         ▼          ▼          ▼
    ┌──────────────┐  ┌─────────────┐  ┌────────────┐  ┌──────────────┐
    │BorrowTrans.  │  │Reservations │  │   Fines    │  │  Wishlists   │
    ├──────────────┤  ├─────────────┤  ├────────────┤  ├──────────────┤
    │MemberId (FK) │  │MemberId(FK) │  │MemberId(FK)│  │MemberId (FK) │
    │BookCopyId(FK)│  │BookId (FK)  │  │BorrowId(FK)│  │BookId (FK)   │
    │IssuedDate    │  │ReserveDate  │  │Amount      │  │AddedDate     │
    │DueDate       │  │ExpiryDate   │  │Status      │  └──────────────┘
    │Status        │  │Status       │  │PaidAmount  │
    └──────────────┘  └─────────────┘  └────────────┘
            │                                  │
        (1:N)                              (1:N)
            │                                  │
            ▼                                  ▼
    ┌──────────────┐                  ┌────────────┐
    │  BookCopies  │                  │  Payments  │
    ├──────────────┤                  ├────────────┤
    │BookId (FK)   │                  │FineId (FK) │
    │Barcode       │                  │Amount      │
    │Status        │                  │Date        │
    │Condition     │                  └────────────┘
    └──────────────┘
            │
        (1:N)
            │
            ▼
        ┌──────────────┐
        │   Books      │◄─┐
        ├──────────────┤  │
        │ISBN          │  │ (M:N)
        │Title         │  │
        │PublisherId   │  ├──────────┐
        │CategoryId    │  │BookAuthors
        │LanguageId    │  │          │
        │PublishDate   │  └──────────┘
        │TotalCopies   │
        └──────────────┘
                ▲         ▼
                │    ┌────────────┐
            (1:N)    │  Authors   │
                │    ├────────────┤
                │    │Name        │
                │    │Biography   │
                │    └────────────┘
                │
        ┌───────┴────────┐
        │                │
    (1:N)            (1:N)
        │                │
        ▼                ▼
    ┌────────────┐  ┌──────────────┐
    │ Publishers │  │ Categories   │
    ├────────────┤  ├──────────────┤
    │Name        │  │Name          │
    │Contact     │  │Description   │
    └────────────┘  └──────────────┘
```

### Key Relationships
- **Users:Members** = 1:1
- **Users:Roles** = M:N (via UserRoles)
- **Members:BorrowTransactions** = 1:N
- **Members:Reservations** = 1:N
- **Members:Fines** = 1:N
- **Books:Authors** = M:N (via BookAuthors)
- **Books:BookCopies** = 1:N
- **Books:Reservations** = 1:N
- **BorrowTransactions:Fines** = 1:N
- **Fines:Payments** = 1:N

---

## Authentication & Authorization

### JWT Token Flow
```
1. User Login
   ↓
2. Validate Credentials
   ↓
3. Generate JWT Token
   ├─ User ID
   ├─ Email
   ├─ Roles
   └─ Expiration
   ↓
4. Return Token to Client
   ↓
5. Client Stores Token
   ↓
6. Client Includes in API Requests
   (Authorization: Bearer <token>)
```

### Role-Based Access Control (RBAC)
```csharp
[Authorize(Roles = "Administrator")]
public async Task<IActionResult> DeleteBook(Guid id)
{
    // Only admins can delete books
}

[Authorize(Roles = "Librarian,Administrator")]
public async Task<IActionResult> IssueBook(Guid memberId)
{
    // Only librarians and admins can issue books
}

[Authorize]
public async Task<IActionResult> MyLoans()
{
    // All authenticated users can view their loans
}
```

---

## Data Flow Examples

### Book Borrowing Flow
```
1. Member selects book to borrow
   ↓
2. Frontend calls POST /borrowing/issue
   ↓
3. Backend validates:
   - Member can borrow (not suspended)
   - Member hasn't reached max books limit
   - Book copy is available
   ↓
4. If valid:
   - Create BorrowTransaction record
   - Update BookCopy status to "Issued"
   - Generate due date notification
   ↓
5. Return confirmation to frontend
   ↓
6. Member sees book in "My Loans" section
```

### Fine Calculation Flow
```
1. Scheduled job runs daily (e.g., 2 AM)
   ↓
2. Query all overdue borrow transactions
   ↓
3. For each overdue transaction:
   - Calculate days overdue
   - Calculate fine amount
   - Check if fine already exists
   ↓
4. Create new Fine records if needed
   ↓
5. Send notification to member
   ↓
6. Update member's outstanding fines
```

---

## API Layers

### Request/Response Flow
```
Request
  ↓
HttpRequest Middleware
  ↓
Route Matching
  ↓
Controller Action
  ↓
Authorization Check
  ↓
Parameter Binding & Validation
  ↓
Service Method Call
  ↓
Repository/DbContext Call
  ↓
Database Query/Command
  ↓
Return to Service
  ↓
Transform to DTO
  ↓
Return Response
  ↓
Response Middleware
  ↓
HttpResponse
```

---

## Caching Strategy

### Implemented Caching
1. **Database Query Cache**: Frequently accessed data (books, categories)
2. **Authentication Cache**: User roles and permissions
3. **Session Cache**: Member borrowing limits

### Cache Invalidation
- On CRUD operations, clear relevant cache
- TTL (Time-To-Live) for automatic expiration
- Manual invalidation through admin interface

---

## Error Handling

### Exception Handling Strategy
```csharp
try
{
    // Business logic
}
catch (ValidationException ex)
{
    // Return 400 Bad Request
}
catch (UnauthorizedException ex)
{
    // Return 401 Unauthorized
}
catch (ForbiddenException ex)
{
    // Return 403 Forbidden
}
catch (NotFoundException ex)
{
    // Return 404 Not Found
}
catch (Exception ex)
{
    // Log error
    // Return 500 Internal Server Error
}
```

### Custom Error Response
```json
{
  "statusCode": 400,
  "message": "Invalid request",
  "errors": [
    "Email is already registered",
    "Password must be at least 8 characters"
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Scalability Considerations

### Short-term (Current)
- Single database server
- In-process caching
- Synchronous API calls

### Medium-term
- Database read replicas
- Distributed caching (Redis)
- Message queues (RabbitMQ) for notifications
- Background job scheduler (Hangfire)

### Long-term
- Microservices architecture
- Event-driven architecture
- CQRS pattern for complex queries
- Load balancing and CDN

---

## Security Architecture

### Layers of Security
1. **Network Layer**: HTTPS, firewall
2. **Application Layer**: Authentication, authorization
3. **Data Layer**: Encryption, parameterized queries
4. **Business Layer**: Input validation, rate limiting

### Security Practices
- ✓ Parameterized queries (prevent SQL injection)
- ✓ Password hashing (bcrypt/Argon2)
- ✓ JWT tokens for stateless authentication
- ✓ Role-based authorization
- ✓ Audit logging for sensitive operations
- ✓ Input validation on all endpoints
- ✓ CORS configuration for frontend access

---

## Performance Optimization

### Database Optimization
- Indexed frequently queried columns
- Denormalized views for complex reports
- Pagination for large result sets
- Async/await for I/O operations

### API Optimization
- Response compression
- Caching HTTP responses
- Lazy loading of related entities
- DTO mapping optimization

### Frontend Optimization
- Code splitting by route
- Lazy loading components
- Image optimization
- Virtual scrolling for large lists

---

## Deployment Architecture

### Development
- Local machine with SQL Server Express
- Visual Studio or VS Code
- npm dev server (3000)
- Dotnet run (5000)

### Staging
- Azure App Service (Web App)
- Azure SQL Database
- CI/CD Pipeline (GitHub Actions)
- Custom domain with SSL

### Production
- Azure Container Instances or Kubernetes
- Azure SQL Database with replicas
- Redis for caching
- Application Insights for monitoring
- CDN for static assets

---

## Monitoring & Observability

### Logging
- Application logs: `/backend/Logs/`
- Structured logging with Serilog
- Log aggregation (optional: ELK stack)

### Metrics
- Request count and response time
- Database query performance
- Error rates by endpoint
- Resource utilization

### Tracing
- Correlation IDs for request tracking
- APM integration (optional: Application Insights)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2024 | Initial release with core features |

---

Last Updated: January 2024
