# LibraryPro Testing Guide

## Testing Strategy

LibraryPro uses a multi-layered testing approach to ensure code quality and reliability:

```
┌──────────────────────┐
│  End-to-End Tests    │  (Selenium/Playwright)
├──────────────────────┤
│  Integration Tests   │  (API + Database)
├──────────────────────┤
│  Unit Tests          │  (Individual functions)
├──────────────────────┤
│  Code Quality        │  (Lint, Format, Coverage)
└──────────────────────┘
```

---

## Unit Testing

### Backend Unit Tests (xUnit)

#### Test Project Setup
```bash
cd LibraryPro/backend
dotnet new xunit -n LibraryPro.Tests
dotnet add LibraryPro.Tests reference LibraryPro.Api
```

#### Example: AuthService Tests
```csharp
public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _mockUserRepo;
    private readonly IAuthService _authService;
    
    public AuthServiceTests()
    {
        _mockUserRepo = new Mock<IUserRepository>();
        _authService = new AuthService(_mockUserRepo.Object);
    }
    
    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsToken()
    {
        // Arrange
        var loginRequest = new LoginRequest 
        { 
            Email = "test@example.com", 
            Password = "Password123!" 
        };
        
        var user = new User 
        { 
            Id = Guid.NewGuid(), 
            Email = "test@example.com" 
        };
        
        _mockUserRepo.Setup(x => x.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync(user);
        
        // Act
        var result = await _authService.LoginAsync(loginRequest);
        
        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result.Token);
        Assert.Equal("test@example.com", result.User.Email);
    }
    
    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ThrowsException()
    {
        // Arrange
        var loginRequest = new LoginRequest 
        { 
            Email = "test@example.com", 
            Password = "WrongPassword" 
        };
        
        _mockUserRepo.Setup(x => x.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User)null);
        
        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _authService.LoginAsync(loginRequest)
        );
    }
}
```

#### Example: BookService Tests
```csharp
public class BookServiceTests
{
    private readonly Mock<IRepository<Book>> _mockBookRepo;
    private readonly IBookService _bookService;
    
    public BookServiceTests()
    {
        _mockBookRepo = new Mock<IRepository<Book>>();
        _bookService = new BookService(_mockBookRepo.Object);
    }
    
    [Fact]
    public async Task GetAvailableBooksAsync_ReturnsNonDeletedBooks()
    {
        // Arrange
        var books = new List<Book>
        {
            new Book { Id = Guid.NewGuid(), Title = "Book 1", IsDeleted = false },
            new Book { Id = Guid.NewGuid(), Title = "Book 2", IsDeleted = false },
            new Book { Id = Guid.NewGuid(), Title = "Book 3", IsDeleted = true }
        };
        
        _mockBookRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(books);
        
        // Act
        var result = await _bookService.GetAllBooksAsync();
        
        // Assert
        Assert.Equal(2, result.Count());
        Assert.All(result, book => Assert.False(book.IsDeleted));
    }
    
    [Fact]
    public async Task SearchBooksAsync_ByTitle_ReturnsMatchingBooks()
    {
        // Arrange
        var searchQuery = "gatsby";
        var books = new List<Book>
        {
            new Book { Id = Guid.NewGuid(), Title = "The Great Gatsby" },
            new Book { Id = Guid.NewGuid(), Title = "JavaScript Guide" }
        };
        
        _mockBookRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(books);
        
        // Act
        var result = await _bookService.SearchBooksAsync(searchQuery);
        
        // Assert
        Assert.Single(result);
        Assert.Contains("gatsby", result.First().Title, 
            StringComparison.OrdinalIgnoreCase);
    }
}
```

#### Running Unit Tests
```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test LibraryPro.Tests

# Run with verbosity
dotnet test --verbosity detailed

# Run with coverage
dotnet test /p:CollectCoverage=true /p:CoverageFormat=opencover

# Run specific test class
dotnet test --filter "FullyQualifiedName~AuthServiceTests"
```

### Frontend Unit Tests (Vitest + React Testing Library)

#### Test Setup
```bash
cd LibraryPro/frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

#### Example: Auth Store Tests
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../src/store/authStore'

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
    })
  })

  it('should set user and token on login', () => {
    const user = {
      id: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'Member',
    }
    const token = 'test-token'

    useAuthStore.getState().login(user, token)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(user)
    expect(state.token).toBe(token)
  })

  it('should clear user and token on logout', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '123', email: 'test@example.com' },
      token: 'test-token',
    })

    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })
})
```

#### Example: Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Login from '../src/pages/Login'

describe('Login Component', () => {
  it('should render login form', () => {
    render(<Login />)

    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('should validate empty email', async () => {
    render(<Login />)

    const loginButton = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(loginButton)

    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('should call login API on form submit', async () => {
    render(<Login />)

    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: 'Sign In' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } })
    fireEvent.click(loginButton)

    // Assert API call was made
    // (depends on mocking strategy)
  })
})
```

#### Running Frontend Tests
```bash
# Run all tests
npm run test

# Run in watch mode
npm run test -- --watch

# Run with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- Login.test.tsx
```

---

## Integration Tests

### Backend Integration Tests

#### Database Integration Tests
```csharp
public class BookRepositoryIntegrationTests : IAsyncLifetime
{
    private readonly ApplicationDbContext _context;
    private readonly IRepository<Book> _repository;
    
    public BookRepositoryIntegrationTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        
        _context = new ApplicationDbContext(options);
        _repository = new Repository<Book>(_context);
    }
    
    public async Task InitializeAsync()
    {
        await _context.Database.EnsureCreatedAsync();
    }
    
    public async Task DisposeAsync()
    {
        await _context.Database.EnsureDeletedAsync();
        await _context.DisposeAsync();
    }
    
    [Fact]
    public async Task AddBook_WithValidData_SavesSuccessfully()
    {
        // Arrange
        var book = new Book
        {
            Id = Guid.NewGuid(),
            Title = "Test Book",
            ISBN = "978-0-1234-5678-9",
            TotalCopies = 5,
            AvailableCopies = 5
        };
        
        // Act
        await _repository.AddAsync(book);
        await _context.SaveChangesAsync();
        
        // Assert
        var savedBook = await _context.Books.FirstOrDefaultAsync(b => b.Id == book.Id);
        Assert.NotNull(savedBook);
        Assert.Equal("Test Book", savedBook.Title);
    }
    
    [Fact]
    public async Task GetBookByISBN_ReturnsCorrectBook()
    {
        // Arrange
        var isbn = "978-0-1234-5678-9";
        var book = new Book
        {
            Id = Guid.NewGuid(),
            Title = "Test Book",
            ISBN = isbn
        };
        
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        
        // Act
        var result = await _context.Books.FirstOrDefaultAsync(b => b.ISBN == isbn);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal(book.Id, result.Id);
    }
}
```

#### API Integration Tests
```csharp
public class BooksControllerIntegrationTests
{
    private readonly HttpClient _httpClient;
    private readonly WebApplicationFactory<Program> _factory;
    
    public BooksControllerIntegrationTests()
    {
        _factory = new WebApplicationFactory<Program>();
        _httpClient = _factory.CreateClient();
    }
    
    [Fact]
    public async Task GetBooks_ReturnsOkStatus()
    {
        // Act
        var response = await _httpClient.GetAsync("/api/books");
        
        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotEmpty(content);
    }
    
    [Fact]
    public async Task CreateBook_WithValidData_ReturnsCreated()
    {
        // Arrange
        var createRequest = new CreateBookRequest
        {
            Title = "New Book",
            ISBN = "978-0-1234-5678-9",
            AuthorId = Guid.NewGuid(),
            CategoryId = Guid.NewGuid()
        };
        
        var content = new StringContent(
            JsonSerializer.Serialize(createRequest),
            Encoding.UTF8,
            "application/json"
        );
        
        // Act
        var response = await _httpClient.PostAsync("/api/books", content);
        
        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }
}
```

---

## End-to-End Testing

### Playwright E2E Tests
```typescript
import { test, expect } from '@playwright/test'

test.describe('Member Borrowing Flow', () => {
  test('should borrow a book successfully', async ({ page }) => {
    // 1. Login
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'member@example.com')
    await page.fill('input[type="password"]', 'Member123!')
    await page.click('button:has-text("Sign In")')

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard')

    // 2. Navigate to browse books
    await page.click('a:has-text("Browse Books")')
    await page.waitForLoadState('networkidle')

    // 3. Search for a book
    await page.fill('input[placeholder="Search..."]', 'Great Gatsby')
    await page.waitForTimeout(500)

    // 4. Select a book
    await page.click('button:has-text("View Details")')
    await page.waitForURL('**/book/**')

    // 5. Borrow the book
    await page.click('button:has-text("Borrow")')

    // 6. Confirm in My Loans
    await page.click('a:has-text("My Loans")')
    await expect(page.locator('text=Great Gatsby')).toBeVisible()
  })

  test('should handle borrowing errors', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    // ... login steps ...

    // Try to borrow when member has reached limit
    await page.click('a:has-text("Browse Books")')
    await page.click('button:has-text("Borrow")')

    // Should see error message
    await expect(page.locator('text=You have reached your borrowing limit')).toBeVisible()
  })

  test('should renew a book', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    // ... login steps ...

    await page.click('a:has-text("My Loans")')
    await page.click('button:has-text("Renew")')

    await expect(page.locator('text=Book renewed successfully')).toBeVisible()
  })
})

test.describe('Admin Dashboard', () => {
  test('should display library statistics', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'Admin123!')
    await page.click('button:has-text("Sign In")')

    // Verify admin dashboard elements
    await expect(page.locator('text=Total Books')).toBeVisible()
    await expect(page.locator('text=Active Members')).toBeVisible()
    await expect(page.locator('text=Overdue Books')).toBeVisible()
    await expect(page.locator('text=Outstanding Fines')).toBeVisible()
  })
})
```

#### Running E2E Tests
```bash
# Run all E2E tests
npx playwright test

# Run in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test e2e/borrowing.spec.ts

# Run with UI mode
npx playwright test --ui

# View test report
npx playwright show-report
```

---

## Performance Testing

### Load Testing with k6
```javascript
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 10,
  duration: '30s',
}

export default function () {
  // Test: Get Books
  let response = http.get('http://localhost:5000/api/books')
  check(response, {
    'get books status is 200': (r) => r.status === 200,
    'get books response time < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1)

  // Test: Search Books
  response = http.get('http://localhost:5000/api/books/search?query=gatsby')
  check(response, {
    'search books status is 200': (r) => r.status === 200,
    'search books response time < 1000ms': (r) => r.timings.duration < 1000,
  })

  sleep(1)
}
```

#### Running Load Tests
```bash
k6 run performance-test.js
```

---

## Security Testing

### OWASP Top 10 Checks
- ✓ SQL Injection prevention (parameterized queries)
- ✓ XSS prevention (input sanitization)
- ✓ CSRF protection
- ✓ Broken Authentication (JWT validation)
- ✓ Sensitive Data Exposure (HTTPS, encryption)
- ✓ XML External Entities (N/A)
- ✓ Broken Access Control (RBAC)
- ✓ Security Misconfiguration
- ✓ Insecure Deserialization
- ✓ Using Components with Known Vulnerabilities

### Manual Security Tests
```csharp
[Fact]
public async Task CreateBook_WithoutAuthorization_ReturnsForbidden()
{
    var response = await _httpClient.PostAsync("/api/books", content);
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
}

[Fact]
public async Task AdminEndpoint_WithMemberRole_ReturnsForbidden()
{
    var memberToken = await GetMemberToken();
    _httpClient.DefaultRequestHeaders.Authorization = 
        new AuthenticationHeaderValue("Bearer", memberToken);
    
    var response = await _httpClient.PostAsync("/api/admin/users", content);
    Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
}
```

---

## Test Coverage

### Coverage Goals
- **Unit Tests**: 80%+ code coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: All user workflows

### Measuring Coverage
```bash
# Backend coverage
dotnet test /p:CollectCoverage=true /p:CoverageFormat=opencover

# Frontend coverage
npm run test -- --coverage

# Generate HTML report
dotnet test /p:CollectCoverage=true /p:CoverageFormat=html
```

---

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      sql-server:
        image: mcr.microsoft.com/mssql/server:2019-latest
        env:
          SA_PASSWORD: TestPassword123!
          ACCEPT_EULA: Y
        options: >-
          --health-cmd "/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P TestPassword123! -Q 'SELECT 1'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: '8.0.x'
      
      - name: Restore dependencies
        run: dotnet restore
      
      - name: Build
        run: dotnet build --no-restore
      
      - name: Run tests
        run: dotnet test --no-build --verbosity normal
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## Test Data Management

### Seed Test Data
```csharp
public class TestDataSeeder
{
    public static void SeedTestData(ApplicationDbContext context)
    {
        // Create test users
        var user1 = new User
        {
            Email = "member@test.com",
            FirstName = "John",
            LastName = "Doe"
        };
        
        context.Users.Add(user1);
        
        // Create test books
        var book1 = new Book
        {
            Title = "Test Book",
            ISBN = "978-0-1234-5678-9"
        };
        
        context.Books.Add(book1);
        context.SaveChanges();
    }
}
```

---

## Troubleshooting Tests

### Common Issues

| Issue | Solution |
|-------|----------|
| Database locked | Use InMemoryDatabase for unit tests |
| Async timeout | Increase timeout in test configuration |
| API port in use | Change port in test configuration |
| Mock setup incorrect | Verify mock setup matches actual behavior |
| Flaky tests | Add waits/retries for async operations |

---

## Best Practices

- ✓ Write tests for critical business logic
- ✓ Use meaningful test names
- ✓ Follow AAA pattern (Arrange, Act, Assert)
- ✓ Keep tests independent and isolated
- ✓ Mock external dependencies
- ✓ Use test fixtures for common setup
- ✓ Maintain test data consistency
- ✓ Run tests locally before committing
- ✓ Integrate tests into CI/CD pipeline
- ✓ Monitor test coverage trends

---

## Test Checklist

- [ ] Unit tests cover core business logic
- [ ] Integration tests verify database operations
- [ ] API tests verify endpoint behavior
- [ ] Authentication/Authorization tests
- [ ] Error handling tests
- [ ] Input validation tests
- [ ] E2E tests for critical workflows
- [ ] Performance tests for key operations
- [ ] Security tests for vulnerabilities
- [ ] Coverage >= 80% for new code

---

Last Updated: January 2024
