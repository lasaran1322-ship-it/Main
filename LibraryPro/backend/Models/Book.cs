using System.ComponentModel.DataAnnotations;

namespace LibraryPro.Api.Models;

/// <summary>
/// Represents a book in the library catalog
/// </summary>
public class Book : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(13)]
    public string? ISBN { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public Guid AuthorId { get; set; }

    public Guid PublisherId { get; set; }

    public Guid CategoryId { get; set; }

    [MaxLength(50)]
    public string? Language { get; set; } = "English";

    public int PublicationYear { get; set; }

    [MaxLength(50)]
    public string? Edition { get; set; }

    public int PageCount { get; set; }

    [MaxLength(50)]
    public string? Format { get; set; } = "Hardcover";

    public decimal Price { get; set; }

    public int TotalCopies { get; set; }

    public int AvailableCopies { get; set; }

    [MaxLength(500)]
    public string? CoverImageUrl { get; set; }

    public BookStatus Status { get; set; } = BookStatus.Active;

    public DateTime PublishedDate { get; set; }

    // Navigation properties
    public virtual Author? Author { get; set; }

    public virtual Publisher? Publisher { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<BookCopy> BookCopies { get; set; } = new List<BookCopy>();

    public virtual ICollection<BorrowTransaction> BorrowTransactions { get; set; } = new List<BorrowTransaction>();

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    public virtual ICollection<Wishlist> WishlistItems { get; set; } = new List<Wishlist>();

    public virtual ICollection<BookTag> BookTags { get; set; } = new List<BookTag>();
}

public enum BookStatus
{
    Active,
    Inactive,
    OutOfPrint,
    Discontinued
}

/// <summary>
/// Represents a physical copy of a book
/// </summary>
public class BookCopy : BaseEntity
{
    [Required]
    public Guid BookId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Barcode { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? QRCode { get; set; }

    public BookCopyStatus Status { get; set; } = BookCopyStatus.Available;

    public int Condition { get; set; } = 100; // Percentage (0-100)

    public DateTime AcquisitionDate { get; set; }

    public DateTime? LastMaintenanceDate { get; set; }

    public Guid? CurrentBorrowTransactionId { get; set; }

    // Navigation properties
    public virtual Book? Book { get; set; }

    public virtual BorrowTransaction? CurrentBorrowTransaction { get; set; }
}

public enum BookCopyStatus
{
    Available,
    Issued,
    Reserved,
    UnderMaintenance,
    Lost,
    Damaged,
    Disposed
}
