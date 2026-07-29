using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace LibraryPro.Api.Models;

/// <summary>
/// Represents a system user (base class for all user types)
/// </summary>
public class User : IdentityUser<Guid>
{
    [MaxLength(100)]
    public string? FirstName { get; set; }

    [MaxLength(100)]
    public string? LastName { get; set; }

    [MaxLength(500)]
    public string? Address { get; set; }

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? DeletedAt { get; set; }

    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}

/// <summary>
/// Represents a library member (student/reader)
/// </summary>
public class Member : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [MaxLength(50)]
    public string? MembershipNumber { get; set; }

    public DateTime? MembershipStartDate { get; set; } = DateTime.UtcNow;

    public DateTime? MembershipExpiryDate { get; set; } = DateTime.UtcNow.AddYears(1);

    [MaxLength(50)]
    public string? MembershipType { get; set; } = "Standard";

    public MemberStatus Status { get; set; } = MemberStatus.Active;

    public int BorrowLimit { get; set; } = 5;

    public int CurrentBorrowCount { get; set; } = 0;

    public decimal OutstandingFines { get; set; } = 0;

    // Navigation properties
    public virtual User? User { get; set; }

    public virtual ICollection<BorrowTransaction> BorrowTransactions { get; set; } = new List<BorrowTransaction>();

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    public virtual ICollection<Fine> Fines { get; set; } = new List<Fine>();

    public virtual ICollection<Wishlist> WishlistItems { get; set; } = new List<Wishlist>();
}

public enum MemberStatus
{
    Active,
    Inactive,
    Suspended,
    Expired
}
