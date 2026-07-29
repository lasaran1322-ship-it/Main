using System.ComponentModel.DataAnnotations;

namespace LibraryPro.Api.Models;

/// <summary>
/// Represents a fine imposed on a member for overdue books
/// </summary>
public class Fine : BaseEntity
{
    [Required]
    public Guid MemberId { get; set; }

    [Required]
    public Guid BorrowTransactionId { get; set; }

    public decimal Amount { get; set; }

    public decimal PaidAmount { get; set; }

    public FineType Type { get; set; } = FineType.Overdue;

    public FineStatus Status { get; set; } = FineStatus.Outstanding;

    public DateTime ImposedDate { get; set; } = DateTime.UtcNow;

    public DateTime? PaidDate { get; set; }

    [MaxLength(500)]
    public string? Reason { get; set; }

    // Navigation properties
    public virtual Member? Member { get; set; }

    public virtual BorrowTransaction? BorrowTransaction { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

public enum FineType
{
    Overdue,
    Damage,
    Loss,
    Other
}

public enum FineStatus
{
    Outstanding,
    PartiallyPaid,
    Paid,
    Waived,
    Cancelled
}

/// <summary>
/// Represents a fine payment record
/// </summary>
public class Payment : BaseEntity
{
    [Required]
    public Guid FineId { get; set; }

    public decimal Amount { get; set; }

    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string? PaymentMethod { get; set; }

    [MaxLength(100)]
    public string? TransactionReference { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Fine? Fine { get; set; }
}
