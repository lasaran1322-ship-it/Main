# LibraryPro API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh_token_here",
  "expiresAt": "2024-12-31T10:00:00Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Member"
  }
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securePassword123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1-555-0123"
}

Response:
{
  "message": "Registration successful",
  "userId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}

Response:
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token",
  "expiresAt": "2024-12-31T11:00:00Z"
}
```

---

## Book Management Endpoints

### Get All Books
```http
GET /books?pageNumber=1&pageSize=20

Response:
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "The Great Gatsby",
      "isbn": "978-0-7432-7356-5",
      "author": "F. Scott Fitzgerald",
      "category": "Fiction",
      "availableCopies": 3,
      "totalCopies": 5,
      "publicationDate": "1925-04-10",
      "coverImageUrl": "https://..."
    }
  ],
  "pagination": {
    "pageNumber": 1,
    "pageSize": 20,
    "totalRecords": 150
  }
}
```

### Get Book by ID
```http
GET /books/{bookId}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "title": "The Great Gatsby",
  "isbn": "978-0-7432-7356-5",
  "author": "F. Scott Fitzgerald",
  "category": "Fiction",
  "description": "A novel of the Jazz Age...",
  "availableCopies": 3,
  "totalCopies": 5,
  "publicationDate": "1925-04-10"
}
```

### Search Books
```http
GET /books/search?query=gatsby

Response:
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "The Great Gatsby",
      ...
    }
  ]
}
```

### Add Book (Librarian/Admin only)
```http
POST /books
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "New Book Title",
  "isbn": "978-0-1234-5678-9",
  "authorId": "550e8400-e29b-41d4-a716-446655440003",
  "categoryId": "550e8400-e29b-41d4-a716-446655440004",
  "publisherId": "550e8400-e29b-41d4-a716-446655440005",
  "publicationDate": "2024-01-15",
  "pages": 320,
  "description": "Book description here"
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440006",
  "title": "New Book Title",
  ...
}
```

---

## Borrowing Endpoints

### Issue Book
```http
POST /borrowing/issue
Authorization: Bearer <librarian_token>
Content-Type: application/json

{
  "memberId": "550e8400-e29b-41d4-a716-446655440007",
  "bookId": "550e8400-e29b-41d4-a716-446655440002",
  "bookCopyId": "550e8400-e29b-41d4-a716-446655440008",
  "borrowDays": 14,
  "notes": "New acquisition"
}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440009",
  "memberId": "550e8400-e29b-41d4-a716-446655440007",
  "bookTitle": "The Great Gatsby",
  "issuedDate": "2024-01-15T10:30:00Z",
  "dueDate": "2024-01-29T10:30:00Z",
  "status": "Active"
}
```

### Return Book
```http
POST /borrowing/return
Authorization: Bearer <librarian_token>
Content-Type: application/json

{
  "borrowTransactionId": "550e8400-e29b-41d4-a716-446655440009",
  "notes": "Book returned in good condition"
}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440009",
  "status": "Returned",
  "returnedDate": "2024-01-20T14:30:00Z"
}
```

### Renew Book
```http
POST /borrowing/renew
Authorization: Bearer <member_token>
Content-Type: application/json

{
  "borrowTransactionId": "550e8400-e29b-41d4-a716-446655440009",
  "notes": "Request renewal"
}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440009",
  "renewCount": 1,
  "newDueDate": "2024-02-12T10:30:00Z",
  "status": "Renewed"
}
```

### Get Member's Loans
```http
GET /borrowing/member/{memberId}/loans
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "bookTitle": "The Great Gatsby",
      "issuedDate": "2024-01-15T10:30:00Z",
      "dueDate": "2024-01-29T10:30:00Z",
      "status": "Active",
      "isOverdue": false
    }
  ]
}
```

### Get Overdue Books
```http
GET /borrowing/overdue
Authorization: Bearer <librarian_token>

Response:
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "memberName": "John Doe",
      "bookTitle": "The Great Gatsby",
      "dueDate": "2024-01-25T10:30:00Z",
      "overdueDays": 5
    }
  ]
}
```

---

## Reservation Endpoints

### Create Reservation
```http
POST /reservations
Authorization: Bearer <member_token>
Content-Type: application/json

{
  "bookId": "550e8400-e29b-41d4-a716-446655440002",
  "notes": "Interested in reading this book"
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "bookId": "550e8400-e29b-41d4-a716-446655440002",
  "status": "Active",
  "queuePosition": 1,
  "expiryDate": "2024-02-15T00:00:00Z"
}
```

### Get Member Reservations
```http
GET /reservations/member/{memberId}
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "bookTitle": "The Great Gatsby",
      "status": "Active",
      "queuePosition": 1,
      "reservationDate": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Cancel Reservation
```http
DELETE /reservations/{reservationId}
Authorization: Bearer <member_token>

Response: 204 No Content
```

---

## Fine Management Endpoints

### Get Member Fines
```http
GET /fines/member/{memberId}
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "amount": 25.00,
      "paidAmount": 10.00,
      "remainingAmount": 15.00,
      "status": "PartiallyPaid",
      "reason": "Overdue: 5 days @ $5/day",
      "imposedDate": "2024-01-25T10:30:00Z"
    }
  ]
}
```

### Make Fine Payment
```http
POST /fines/payment
Authorization: Bearer <member_token>
Content-Type: application/json

{
  "fineId": "550e8400-e29b-41d4-a716-446655440011",
  "amount": 15.00,
  "paymentMethod": "Card",
  "transactionReference": "TXN-2024-001"
}

Response: 200 OK
{
  "message": "Payment processed successfully",
  "remainingBalance": 0
}
```

### Get Fine Report
```http
GET /fines/report/outstanding
Authorization: Bearer <librarian_token>

Response:
{
  "data": [
    {
      "memberId": "550e8400-e29b-41d4-a716-446655440007",
      "memberName": "John Doe",
      "totalFines": 100.00,
      "paidFines": 25.00,
      "outstandingFines": 75.00,
      "fineCount": 3
    }
  ]
}
```

---

## Reports & Analytics

### Get Borrowing Statistics
```http
GET /reports/borrowing/statistics?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>

Response:
{
  "totalBorrowTransactions": 1250,
  "totalReturnTransactions": 1180,
  "activeLoans": 70,
  "overdueBooks": 5
}
```

### Get Most Borrowed Books
```http
GET /reports/most-borrowed?limit=10
Authorization: Bearer <librarian_token>

Response:
{
  "data": [
    {
      "bookId": "550e8400-e29b-41d4-a716-446655440002",
      "title": "The Great Gatsby",
      "borrowCount": 45,
      "lastBorrowedDate": "2024-01-20T10:30:00Z"
    }
  ]
}
```

---

## Error Responses

### Unauthorized (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized access",
  "errors": ["Invalid or expired token"]
}
```

### Forbidden (403)
```json
{
  "statusCode": 403,
  "message": "Access denied",
  "errors": ["You don't have permission to access this resource"]
}
```

### Bad Request (400)
```json
{
  "statusCode": 400,
  "message": "Invalid request",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}
```

### Not Found (404)
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "errors": ["Book with ID 550e8400-e29b-41d4-a716-446655440099 not found"]
}
```

### Server Error (500)
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "errors": ["An unexpected error occurred. Please contact support."]
}
```

---

## Status Codes

- **200**: OK
- **201**: Created
- **204**: No Content
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **500**: Internal Server Error

---

## Rate Limiting

Rate limits are applied per user:
- **100 requests per minute** for authenticated users
- **20 requests per minute** for unauthenticated users

---

## Pagination

For endpoints that return lists, pagination is supported:
```
GET /books?pageNumber=1&pageSize=20&sortBy=title&sortOrder=asc
```

Query parameters:
- `pageNumber`: Page number (default: 1)
- `pageSize`: Number of records per page (default: 20, max: 100)
- `sortBy`: Field to sort by
- `sortOrder`: asc or desc

---

## Webhook Events (Future)

The following events will trigger webhooks:
- `book.reserved`
- `book.available_for_reservation`
- `loan.overdue`
- `fine.imposed`
- `fine.paid`

---

## Examples

### Complete Member Flow

1. **Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "password": "SecurePass123!"
  }'
```

3. **Browse Books**
```bash
curl -X GET http://localhost:5000/api/books?pageNumber=1&pageSize=10 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

4. **Reserve a Book**
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "550e8400-e29b-41d4-a716-446655440002",
    "notes": "Interested in this book"
  }'
```

---

## Version

Current API Version: **1.0.0**
Last Updated: January 2024
