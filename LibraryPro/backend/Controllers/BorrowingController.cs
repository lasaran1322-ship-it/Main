using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LibraryPro.Api.Data;
using LibraryPro.Api.Dtos.Borrowing;
using LibraryPro.Api.Models;

namespace LibraryPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class BorrowingController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BorrowingController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Issue a book to a member (Librarian only)
    /// </summary>
    [HttpPost("issue")]
    [Authorize(Roles = "Librarian,Administrator")]
    public async Task<ActionResult<BorrowTransactionDto>> IssueBorrow([FromBody] IssueBorrowRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Validate member exists
        var member = await _context.Members.FindAsync(request.MemberId);
        if (member == null)
            return BadRequest("Member not found");

        // Validate book copy exists and is available
        var bookCopy = await _context.BookCopies.FindAsync(request.BookCopyId);
        if (bookCopy == null || bookCopy.Status != "Available")
            return BadRequest("Book copy not available");

        var borrow = new BorrowTransaction
        {
            MemberId = request.MemberId,
            BookId = request.BookId,
            BookCopyId = request.BookCopyId,
            IssuedDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(request.BorrowDays),
            BorrowDays = request.BorrowDays,
            Status = BorrowStatus.Active,
            Notes = request.Notes
        };

        bookCopy.Status = "Issued";
        bookCopy.CurrentBorrowTransactionId = borrow.Id;

        _context.BorrowTransactions.Add(borrow);
        _context.BookCopies.Update(bookCopy);
        await _context.SaveChangesAsync();

        return Ok(MapToDto(borrow));
    }

    /// <summary>
    /// Return a book
    /// </summary>
    [HttpPost("return")]
    [Authorize(Roles = "Librarian,Administrator")]
    public async Task<ActionResult<BorrowTransactionDto>> ReturnBorrow([FromBody] ReturnBorrowRequest request)
    {
        var borrow = await _context.BorrowTransactions.FindAsync(request.BorrowTransactionId);
        if (borrow == null)
            return BadRequest("Borrow transaction not found");

        var bookCopy = await _context.BookCopies.FindAsync(borrow.BookCopyId);
        if (bookCopy == null)
            return BadRequest("Book copy not found");

        borrow.ReturnedDate = DateTime.UtcNow;
        borrow.Status = DateTime.UtcNow > borrow.DueDate ? BorrowStatus.Overdue : BorrowStatus.Returned;
        borrow.Notes = request.Notes;

        bookCopy.Status = "Available";
        bookCopy.CurrentBorrowTransactionId = null;

        // Calculate fine if overdue
        if (DateTime.UtcNow > borrow.DueDate)
        {
            var days = (int)(DateTime.UtcNow - borrow.DueDate).TotalDays;
            var fineAmount = days * 10; // 10 per day

            var fine = new Fine
            {
                MemberId = borrow.MemberId,
                BorrowTransactionId = borrow.Id,
                Amount = fineAmount,
                Type = FineType.Overdue,
                Status = FineStatus.Outstanding,
                Reason = $"Overdue by {days} days"
            };

            _context.Fines.Add(fine);
        }

        _context.BorrowTransactions.Update(borrow);
        _context.BookCopies.Update(bookCopy);
        await _context.SaveChangesAsync();

        return Ok(MapToDto(borrow));
    }

    /// <summary>
    /// Renew a book
    /// </summary>
    [HttpPost("renew/{id}")]
    [Authorize]
    public async Task<ActionResult<BorrowTransactionDto>> RenewBorrow(Guid id, [FromBody] RenewBorrowRequest request)
    {
        var borrow = await _context.BorrowTransactions.FindAsync(id);
        if (borrow == null)
            return BadRequest("Borrow transaction not found");

        if (borrow.RenewCount >= borrow.MaxRenewals)
            return BadRequest("Maximum renewals exceeded");

        if (borrow.Status != BorrowStatus.Active)
            return BadRequest("Only active borrows can be renewed");

        borrow.DueDate = borrow.DueDate.AddDays(borrow.BorrowDays);
        borrow.RenewCount = (borrow.RenewCount ?? 0) + 1;
        borrow.Status = BorrowStatus.Renewed;
        borrow.Notes = request.Notes;

        _context.BorrowTransactions.Update(borrow);
        await _context.SaveChangesAsync();

        return Ok(MapToDto(borrow));
    }

    /// <summary>
    /// Get borrowing history for a member
    /// </summary>
    [HttpGet("member/{memberId}")]
    [Authorize]
    public async Task<ActionResult<PagedResult<BorrowTransactionDto>>> GetMemberBorrows(
        Guid memberId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.BorrowTransactions
            .Include(bt => bt.Book)
            .Include(bt => bt.BookCopy)
            .Where(bt => bt.MemberId == memberId)
            .OrderByDescending(bt => bt.IssuedDate);

        var total = await query.CountAsync();
        var borrows = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = borrows.Select(MapToDto).ToList();

        return Ok(new PagedResult<BorrowTransactionDto>
        {
            Items = dtos,
            Total = total,
            Page = page,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Get active loans
    /// </summary>
    [HttpGet("active")]
    [Authorize]
    public async Task<ActionResult<PagedResult<BorrowTransactionDto>>> GetActiveBorrows([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var member = await _context.Members.FirstOrDefaultAsync(m => m.UserId.ToString() == userId);
        if (member == null)
            return Unauthorized();

        var query = _context.BorrowTransactions
            .Include(bt => bt.Book)
            .Include(bt => bt.BookCopy)
            .Where(bt => bt.MemberId == member.Id && bt.Status == BorrowStatus.Active);

        var total = await query.CountAsync();
        var borrows = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = borrows.Select(MapToDto).ToList();

        return Ok(new PagedResult<BorrowTransactionDto>
        {
            Items = dtos,
            Total = total,
            Page = page,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Get overdue books
    /// </summary>
    [HttpGet("overdue")]
    [Authorize(Roles = "Librarian,Administrator")]
    public async Task<ActionResult<List<BorrowTransactionDto>>> GetOverdueBorrows()
    {
        var borrows = await _context.BorrowTransactions
            .Include(bt => bt.Book)
            .Include(bt => bt.BookCopy)
            .Include(bt => bt.Member)
            .Where(bt => bt.Status == BorrowStatus.Active && bt.DueDate < DateTime.UtcNow)
            .ToListAsync();

        return Ok(borrows.Select(MapToDto).ToList());
    }

    private BorrowTransactionDto MapToDto(BorrowTransaction borrow)
    {
        var isOverdue = DateTime.UtcNow > borrow.DueDate && borrow.Status == BorrowStatus.Active;
        var overdueDays = isOverdue ? (int)(DateTime.UtcNow - borrow.DueDate).TotalDays : 0;

        return new BorrowTransactionDto
        {
            Id = borrow.Id,
            MemberId = borrow.MemberId,
            BookId = borrow.BookId,
            BookTitle = borrow.Book?.Title ?? "",
            BookCopyId = borrow.BookCopyId,
            BookBarcode = borrow.BookCopy?.Barcode ?? "",
            IssuedDate = borrow.IssuedDate,
            DueDate = borrow.DueDate,
            ReturnedDate = borrow.ReturnedDate,
            BorrowDays = borrow.BorrowDays,
            RenewCount = borrow.RenewCount ?? 0,
            MaxRenewals = borrow.MaxRenewals,
            Status = borrow.Status.ToString(),
            Notes = borrow.Notes ?? "",
            IsOverdue = isOverdue,
            OverdueDays = overdueDays
        };
    }
}
