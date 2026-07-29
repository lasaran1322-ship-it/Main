using System.ComponentModel.DataAnnotations;

namespace LibraryPro.Api.Models;

/// <summary>
/// Represents a book author
/// </summary>
public class Author : BaseEntity
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Biography { get; set; }

    [MaxLength(100)]
    public string? Country { get; set; }

    public DateTime? BirthDate { get; set; }

    [MaxLength(500)]
    public string? PhotoUrl { get; set; }

    // Navigation properties
    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}

/// <summary>
/// Represents a book publisher
/// </summary>
public class Publisher : BaseEntity
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(100)]
    public string? Country { get; set; }

    [MaxLength(100)]
    public string? Website { get; set; }

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(100)]
    public string? Email { get; set; }

    // Navigation properties
    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}

/// <summary>
/// Represents a book category/genre
/// </summary>
public class Category : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public Guid? ParentCategoryId { get; set; }

    [MaxLength(50)]
    public string? IconUrl { get; set; }

    // Navigation properties
    public virtual Category? ParentCategory { get; set; }

    public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}

/// <summary>
/// Represents a tag for books (keywords, themes, etc.)
/// </summary>
public class Tag : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<BookTag> BookTags { get; set; } = new List<BookTag>();
}

/// <summary>
/// Junction table for Book and Tag many-to-many relationship
/// </summary>
public class BookTag : BaseEntity
{
    public Guid BookId { get; set; }

    public Guid TagId { get; set; }

    // Navigation properties
    public virtual Book? Book { get; set; }

    public virtual Tag? Tag { get; set; }
}
