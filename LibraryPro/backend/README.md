# LibraryPro Backend API

ASP.NET Core 8 Web API for the LibraryPro Library Management System.

## Prerequisites

- .NET 8.0 SDK or later
- SQL Server 2019 or later
- Visual Studio 2022 or Visual Studio Code

## Project Structure

```
LibraryPro.Api/
├── Controllers/           # API endpoints
├── Models/               # Entity models
├── DTOs/                 # Data Transfer Objects
├── Services/             # Business logic
├── Data/                 # DbContext and migrations
├── Middleware/           # Custom middleware
├── Configuration/        # Configuration classes
├── Exceptions/           # Custom exceptions
├── Utilities/            # Helper utilities
└── appsettings.json      # Configuration
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd LibraryPro.Api
   dotnet restore
   ```

2. **Configure Database**
   - Update `appsettings.json` with your SQL Server connection string
   - Ensure SQL Server is running

3. **Apply Migrations**
   ```bash
   dotnet ef database update
   ```

4. **Run the API**
   ```bash
   dotnet run
   ```

5. **Access Swagger UI**
   Navigate to `https://localhost:5001/swagger`

## Key Features

- ✅ ASP.NET Core 8 with dependency injection
- ✅ Entity Framework Core 8 with SQL Server
- ✅ JWT authentication
- ✅ ASP.NET Identity for user management
- ✅ Role-based authorization
- ✅ AutoMapper for DTO mapping
- ✅ Repository pattern implementation
- ✅ Comprehensive error handling
- ✅ Swagger/OpenAPI documentation
- ✅ Audit logging
- ✅ Soft delete support

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token

### Members
- `GET /api/members` - Get all members
- `GET /api/members/{id}` - Get member details
- `POST /api/members` - Create member
- `PUT /api/members/{id}` - Update member
- `DELETE /api/members/{id}` - Deactivate member

### Books
- `GET /api/books` - Get all books with pagination
- `GET /api/books/{id}` - Get book details
- `POST /api/books` - Add new book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book
- `GET /api/books/search` - Search books

### Borrowing
- `POST /api/borrow-transactions` - Issue book
- `POST /api/borrow-transactions/{id}/return` - Return book
- `GET /api/borrow-transactions` - Get transaction history
- `POST /api/borrow-transactions/{id}/renew` - Renew book

### Reservations
- `POST /api/reservations` - Create reservation
- `DELETE /api/reservations/{id}` - Cancel reservation
- `GET /api/reservations/member/{memberId}` - Get member reservations

### Fines
- `GET /api/fines` - Get fines
- `POST /api/fines/{id}/pay` - Pay fine
- `GET /api/fines/member/{memberId}` - Get member fines

### Reports (Admin only)
- `GET /api/reports/overdue-books` - Overdue books
- `GET /api/reports/most-borrowed` - Most borrowed books
- `GET /api/reports/member-statistics` - Member statistics
- `GET /api/reports/fine-collection` - Fine collection data

## Database Schema

See `Data/DbInitializer.cs` for the complete schema initialization.

## Authentication & Authorization

- JWT tokens issued upon login
- Tokens expire after 24 hours
- Refresh tokens for obtaining new access tokens
- Role-based authorization on sensitive endpoints

## Error Handling

All API responses follow a consistent error format:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "errors": {
    "field": ["error details"]
  }
}
```

## Logging

Comprehensive logging is implemented using Serilog:
- Request/response logging
- Exception logging
- Audit logging for critical operations

## Testing

Unit tests and integration tests are included in the `LibraryPro.Tests` project.

```bash
dotnet test
```

## Deployment

See `Deployment.md` for deployment instructions.

## License

Proprietary - LibraryPro Management System
