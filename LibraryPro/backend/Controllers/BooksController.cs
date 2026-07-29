using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryPro.Api.Data;
using LibraryPro.Api.Dtos.Book;
using LibraryPro.Api.Models;

namespace LibraryPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all books with pagination and filtering
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<BookDto>>> GetBooks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] Guid? authorId = null)
    {
        var query = _context.Books
            .Include(b => b.Author)
            .Include(b => b.Publisher)
            .Include(b => b.Category)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(b =>
                b.Title.Contains(search) ||
                b.ISBN.Contains(search) ||
                b.Author!.Name.Contains(search));
        }

        if (categoryId.HasValue)
            query = query.Where(b => b.CategoryId == categoryId);

        if (authorId.HasValue)
            query = query.Where(b => b.AuthorId == authorId);

        var total = await query.CountAsync();
        var books = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = books.Select(MapToDto).ToList();

        return Ok(new PagedResult<BookDto>
        {
            Items = dtos,
            Total = total,
            Page = page,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Get book by ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookDto>> GetBook(Guid id)
    {
        var book = await _context.Books
            .Include(b => b.Author)
            .Include(b => b.Publisher)
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (book == null)
            return NotFound();

        return Ok(MapToDto(book));
    }

    /// <summary>
    /// Create a new book (Librarian/Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Librarian,Administrator")]
    public async Task<ActionResult<BookDto>> CreateBook([FromBody] CreateBookRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var book = new Book
        {
            Title = request.Title,
            ISBN = request.ISBN,
            Description = request.Description,
            AuthorId = request.AuthorId,
            PublisherId = request.PublisherId,
            CategoryId = request.CategoryId,
            Language = request.Language,
            PublicationYear = request.PublicationYear,
            Edition = request.Edition,
            PageCount = request.PageCount,
            Format = request.Format,
            Price = request.Price,
            CoverImageUrl = request.CoverImageUrl,
            PublishedDate = DateTime.UtcNow,
            Status = "Active"
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        // Create book copies
        for (int i = 0; i < request.TotalCopies; i++)
        {
            var copy = new BookCopy
            {
                BookId = book.Id,
                Barcode = GenerateBarcode(),
                Status = "Available"
            };
            _context.BookCopies.Add(copy);
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, MapToDto(book));
    }

    /// <summary>
    /// Update book
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Librarian,Administrator")]
    public async Task<IActionResult> UpdateBook(Guid id, [FromBody] UpdateBookRequest request)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
            return NotFound();

        book.Title = request.Title;
        book.Description = request.Description;
        book.AuthorId = request.AuthorId;
        book.PublisherId = request.PublisherId;
        book.CategoryId = request.CategoryId;
        book.Price = request.Price;
        book.Edition = request.Edition;
        book.CoverImageUrl = request.CoverImageUrl;
        book.UpdatedAt = DateTime.UtcNow;

        _context.Books.Update(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Delete book
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteBook(Guid id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
            return NotFound();

        book.IsDeleted = true;
        book.DeletedAt = DateTime.UtcNow;

        _context.Books.Update(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Search books by various criteria
    /// </summary>
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<BookDto>>> SearchBooks(
        [FromQuery] string? title = null,
        [FromQuery] string? author = null,
        [FromQuery] string? isbn = null,
        [FromQuery] string? publisher = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Books
            .Include(b => b.Author)
            .Include(b => b.Publisher)
            .Include(b => b.Category)
            .AsQueryable();

        if (!string.IsNullOrEmpty(title))
            query = query.Where(b => b.Title.Contains(title));

        if (!string.IsNullOrEmpty(author))
            query = query.Where(b => b.Author!.Name.Contains(author));

        if (!string.IsNullOrEmpty(isbn))
            query = query.Where(b => b.ISBN.Contains(isbn));

        if (!string.IsNullOrEmpty(publisher))
            query = query.Where(b => b.Publisher!.Name.Contains(publisher));

        var total = await query.CountAsync();
        var books = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = books.Select(MapToDto).ToList();

        return Ok(new PagedResult<BookDto>
        {
            Items = dtos,
            Total = total,
            Page = page,
            PageSize = pageSize
        });
    }

    private BookDto MapToDto(Book book)
    {
        var availableCopies = _context.BookCopies
            .Where(bc => bc.BookId == book.Id && bc.Status == "Available")
            .Count();

        var totalCopies = _context.BookCopies
            .Where(bc => bc.BookId == book.Id)
            .Count();

        return new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            ISBN = book.ISBN,
            Description = book.Description,
            AuthorId = book.AuthorId,
            AuthorName = book.Author?.Name ?? "",
            PublisherId = book.PublisherId,
            PublisherName = book.Publisher?.Name ?? "",
            CategoryId = book.CategoryId,
            CategoryName = book.Category?.Name ?? "",
            Language = book.Language,
            PublicationYear = book.PublicationYear,
            Edition = book.Edition,
            PageCount = book.PageCount,
            Format = book.Format,
            Price = book.Price,
            TotalCopies = totalCopies,
            AvailableCopies = availableCopies,
            CoverImageUrl = book.CoverImageUrl,
            PublishedDate = book.PublishedDate,
            Status = book.Status
        };
    }

    private string GenerateBarcode()
    {
        return $"BC{DateTime.UtcNow.Ticks:x}";
    }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
