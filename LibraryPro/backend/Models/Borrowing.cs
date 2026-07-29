using System.ComponentModel.DataAnnotations;

namespace LibraryPro.Api.Models;

/// <summary>
/// Represents a borrowing transaction (issue and return of a book)
/// </summary>
public class BorrowTransaction : BaseEntity
{
    [Required]
    public Guid MemberId { get; set; }

    [Required]
    public Guid BookId { get; set; }

    [Required]
    public Guid BookCopyId { get; set; }

    public DateTime IssuedDate { get; set; } = DateTime.UtcNow;

    public DateTime DueDate { get; set; }

    public DateTime? ReturnedDate { get; set; }

    public int BorrowDays { get; set; } = 14;

    public int? RenewCount { get; set; } = 0;

    public int MaxRenewals { get; set; } = 2;

    public BorrowStatus Status { get; set; } = BorrowStatus.Active;

    [MaxLength(500)]
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Member? Member { get; set; }

    public virtual Book? Book { get; set; }

    public virtual BookCopy? BookCopy { get; set; }

    public virtual ICollection<Fine> Fines { get; set; } = new List<Fine>();
}

public enum BorrowStatus
{
    Active,
    Returned,
    Overdue,
    Lost,
    Renewed
}

/// <summary>
/// Represents a reservation for a book
/// </summary>
public class Reservation : BaseEntity
{
    [Required]
    public Guid MemberId { get; set; }

    [Required]
    public Guid BookId { get; set; }

    public DateTime ReservationDate { get; set; } = DateTime.UtcNow;

    public DateTime ExpiryDate { get; set; }

    public int QueuePosition { get; set; }

    public ReservationStatus Status { get; set; } = ReservationStatus.Active;

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime? NotificationSentDate { get; set; }

    // Navigation properties
    public virtual Member? Member { get; set; }

    public virtual Book? Book { get; set; }
}

public enum ReservationStatus
{
    Active,
    OnHold,
    Fulfilled,
    Expired,
    Cancelled
}
