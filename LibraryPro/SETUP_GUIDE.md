# LibraryPro - Setup & Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Setup](#database-setup)
5. [Running Locally](#running-locally)
6. [Configuration](#configuration)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server 2019+** (or SQL Server Express) - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Visual Studio Code** or **Visual Studio 2022**

### Optional Tools
- **Postman** - For API testing
- **SQL Server Management Studio (SSMS)** - For database management
- **Docker** - For containerized deployment

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd LibraryPro/backend
```

### 2. Restore NuGet Packages
```bash
dotnet restore
```

### 3. Add Initial Migration
```bash
dotnet ef migrations add Initial
```

### 4. Update Database
```bash
dotnet ef database update
```

Alternatively, run the SQL script manually:
```bash
sqlcmd -S .\SQLEXPRESS -i ../docs/DATABASE_SCHEMA.sql
```

### 5. Build the Backend
```bash
dotnet build
```

### 6. Verify Build
```bash
dotnet build --configuration Release
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Installation
```bash
npm list
```

---

## Database Setup

### Option 1: Automated Setup (Recommended)
The backend will automatically create and seed the database on first run using Entity Framework Core migrations.

### Option 2: Manual Setup
1. Open SQL Server Management Studio (SSMS)
2. Create a new database named `LibraryProDb`
3. Run the SQL script:
```sql
-- Execute the contents of docs/DATABASE_SCHEMA.sql
```

### Initial Data
Seed data will be created automatically:
- **Roles**: Administrator, Librarian, Member
- **Languages**: English, Spanish, French, German, Portuguese, Hindi, Chinese, Arabic
- **Sample Categories**: Fiction, Non-Fiction, Science, History, Technology, etc.

### Create Admin User (Manual)
Connect to the database and insert an admin user:
```sql
INSERT INTO [Users] ([Id], [Email], [PasswordHash], [FirstName], [LastName], [IsActive])
VALUES (NEWID(), 'admin@librarypro.com', 'hashed_password', 'Admin', 'User', 1);
```

---

## Running Locally

### Option 1: Development Mode with Separate Terminals

#### Terminal 1: Backend
```bash
cd LibraryPro/backend
dotnet run
```
Backend will run on `http://localhost:5000`

#### Terminal 2: Frontend
```bash
cd LibraryPro/frontend
npm run dev
```
Frontend will run on `http://localhost:3000` (or `http://localhost:5173`)

### Option 2: Using Visual Studio

1. Open `LibraryPro.sln` in Visual Studio 2022
2. Right-click solution → Set Startup Projects → Multiple startup projects
3. Set both LibraryPro.Api and Frontend to "Start"
4. Press F5 or Debug → Start Debugging

### Testing the Application

1. Open browser: `http://localhost:3000`
2. Use these test credentials:
   - **Admin**: admin@librarypro.com / Admin123!
   - **Librarian**: librarian@librarypro.com / Librarian123!
   - **Member**: member@librarypro.com / Member123!

---

## Configuration

### Backend Configuration (appsettings.json)

#### Database Connection
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=LibraryProDb;Trusted_Connection=true;Encrypt=false;"
  }
}
```

#### JWT Settings
```json
{
  "Jwt": {
    "SecretKey": "your-super-secret-key-at-least-32-characters-long",
    "Issuer": "LibraryPro",
    "Audience": "LibraryProUsers",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  }
}
```

#### Email Configuration (SendGrid)
```json
{
  "SendGrid": {
    "ApiKey": "your-sendgrid-api-key",
    "FromEmail": "noreply@librarypro.com",
    "FromName": "LibraryPro"
  }
}
```

#### Fine Settings
```json
{
  "FineSettings": {
    "DailyFineAmount": 10.0,
    "MaxFinePerBook": 100.0
  }
}
```

#### Borrowing Settings
```json
{
  "BorrowingSettings": {
    "DefaultBorrowDays": 14,
    "MaxBooksPerMember": 5,
    "MaxRenewals": 2,
    "RenewalExtensionDays": 14,
    "ReservationHoldDays": 7,
    "ReservationExpiryDays": 30
  }
}
```

### Frontend Configuration (.env.local)

Create a `.env.local` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=LibraryPro
VITE_APP_VERSION=1.0.0
```

---

## Deployment

### Azure Deployment

#### Prerequisites
- Azure account
- Azure CLI installed
- Service Principal or user with deployment permissions

#### Steps

1. **Build Release Version**
```bash
dotnet publish -c Release -o ./publish
```

2. **Create Azure App Service**
```bash
az appservice plan create --name LibraryProPlan --resource-group LibraryProRG --sku B1
az webapp create --resource-group LibraryProRG --plan LibraryProPlan --name librarypro-api --runtime "DOTNETCORE|8.0"
```

3. **Deploy**
```bash
az webapp up --resource-group LibraryProRG --name librarypro-api
```

### Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["LibraryPro.Api.csproj", "."]
RUN dotnet restore "LibraryPro.Api.csproj"
COPY . .
RUN dotnet build "LibraryPro.Api.csproj" -c Release -o /app/build

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "LibraryPro.Api.dll"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  sql-server:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      SA_PASSWORD: "YourStrongPassword123!"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
    volumes:
      - mssql-data:/var/opt/mssql

  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      ConnectionStrings__DefaultConnection: "Server=sql-server;Database=LibraryProDb;User Id=sa;Password=YourStrongPassword123!;"
    depends_on:
      - sql-server

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  mssql-data:
```

### Running with Docker Compose
```bash
docker-compose up -d
```

---

## Troubleshooting

### Backend Issues

#### 1. Database Connection Error
**Error**: "Cannot open database 'LibraryProDb' requested by the login"
**Solution**:
```bash
# Ensure SQL Server is running
sqlcmd -S localhost -U sa -P YourPassword -Q "SELECT @@VERSION"

# Run migrations
dotnet ef database update
```

#### 2. JWT Configuration Error
**Error**: "Unable to validate the token"
**Solution**: Ensure JWT secret key in `appsettings.json` is at least 32 characters long

#### 3. Port Already in Use
**Error**: "Address already in use 0.0.0.0:5000"
**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in Program.cs
.UseUrls("http://localhost:5001")
```

### Frontend Issues

#### 1. Node Modules Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port 3000 Already in Use
```bash
npm run dev -- --port 3001
```

#### 3. CORS Error
Ensure backend has correct CORS configuration in `Startup.cs`:
```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
```

### Database Issues

#### 1. Migration Conflict
```bash
# Remove latest migration
dotnet ef migrations remove

# Apply migrations fresh
dotnet ef database update 0
dotnet ef database update
```

#### 2. SQL Server Connection Issues
```sql
-- Test connection
sqlcmd -S .\SQLEXPRESS -U sa -P YourPassword
```

---

## Performance Optimization

### Backend
- Enable caching for frequently accessed data
- Implement pagination for large datasets
- Use async/await for I/O operations
- Add database indexes on frequently queried columns

### Frontend
- Enable code splitting with React.lazy()
- Optimize images and assets
- Use React.memo for expensive components
- Implement virtual scrolling for large lists

### Database
- Regular index maintenance
- Archive old audit logs
- Monitor query performance
- Use appropriate column data types

---

## Security Checklist

- [ ] Change default JWT secret key
- [ ] Set strong SQL Server password
- [ ] Enable HTTPS in production
- [ ] Configure CORS for specific origins
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting
- [ ] Enable SQL injection prevention
- [ ] Validate all user inputs
- [ ] Implement proper authorization checks
- [ ] Enable HTTPS redirects
- [ ] Set secure cookie flags
- [ ] Implement CSRF protection

---

## Monitoring & Logging

### Backend Logging
Logs are stored in `/backend/Logs/` directory
Configure log levels in `appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Frontend Logging
Browser console logs are available in development mode
Implement error tracking with services like Sentry

---

## Next Steps

1. Configure email notifications (SendGrid API key)
2. Set up automated fine calculation job (background service)
3. Implement notification system
4. Configure backup strategy
5. Set up CI/CD pipeline
6. Implement monitoring and alerting
7. Performance testing and optimization
8. User acceptance testing (UAT)
9. Production deployment

---

## Support

For issues or questions:
- Check documentation in `/docs` folder
- Review API documentation in `API_DOCUMENTATION.md`
- Check application logs in `/backend/Logs/`
- Open an issue on GitHub

---

## Version Information

- **LibraryPro Version**: 1.0.0
- **.NET Version**: 8.0
- **React Version**: 19.0.0
- **Node Version**: 18+
- **SQL Server Version**: 2019+

Last Updated: January 2024
