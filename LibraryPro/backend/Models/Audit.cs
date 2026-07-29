using System.ComponentModel.DataAnnotations;

namespace LibraryPro.Api.Models;

/// <summary>
/// Represents an audit log entry for tracking system activities
/// </summary>
public class AuditLog : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string EntityType { get; set; } = string.Empty;

    public Guid EntityId { get; set; }

    [MaxLength(1000)]
    public string? OldValues { get; set; }

    [MaxLength(1000)]
    public string? NewValues { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [MaxLength(45)]
    public string? IpAddress { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    // Navigation properties
    public virtual User? User { get; set; }
}

/// <summary>
/// Represents a notification to a user
/// </summary>
public class Notification : BaseEntity
{
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Type { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Message { get; set; }

    public DateTime SentDate { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; } = false;

    public DateTime? ReadDate { get; set; }

    [MaxLength(100)]
    public string? Channel { get; set; } = "InApp"; // InApp, Email, SMS

    [MaxLength(500)]
    public string? Reference { get; set; }

    // Navigation properties
    public virtual User? User { get; set; }
}
