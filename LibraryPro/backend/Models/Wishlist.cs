namespace LibraryPro.Api.Models;

/// <summary>
/// Represents a member's wishlist or favorites
/// </summary>
public class Wishlist : BaseEntity
{
    public Guid MemberId { get; set; }

    public Guid BookId { get; set; }

    public DateTime AddedDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Member? Member { get; set; }

    public virtual Book? Book { get; set; }
}
