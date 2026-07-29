using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using LibraryPro.Api.Models;

namespace LibraryPro.Api.Data;

/// <summary>
/// Main database context for the LibraryPro application
/// </summary>
public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<Member> Members { get; set; } = null!;
    public DbSet<Book> Books { get; set; } = null!;
    public DbSet<BookCopy> BookCopies { get; set; } = null!;
    public DbSet<Author> Authors { get; set; } = null!;
    public DbSet<Publisher> Publishers { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Tag> Tags { get; set; } = null!;
    public DbSet<BookTag> BookTags { get; set; } = null!;
    public DbSet<BorrowTransaction> BorrowTransactions { get; set; } = null!;
    public DbSet<Reservation> Reservations { get; set; } = null!;
    public DbSet<Fine> Fines { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<Wishlist> Wishlists { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Member
        modelBuilder.Entity<Member>()
            .HasOne(m => m.User)
            .WithMany()
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Member>()
            .HasMany(m => m.BorrowTransactions)
            .WithOne(bt => bt.Member)
            .HasForeignKey(bt => bt.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Member>()
            .HasMany(m => m.Reservations)
            .WithOne(r => r.Member)
            .HasForeignKey(r => r.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Member>()
            .HasMany(m => m.Fines)
            .WithOne(f => f.Member)
            .HasForeignKey(f => f.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Book
        modelBuilder.Entity<Book>()
            .HasOne(b => b.Author)
            .WithMany(a => a.Books)
            .HasForeignKey(b => b.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Book>()
            .HasOne(b => b.Publisher)
            .WithMany(p => p.Books)
            .HasForeignKey(b => b.PublisherId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Book>()
            .HasOne(b => b.Category)
            .WithMany(c => c.Books)
            .HasForeignKey(b => b.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Book>()
            .HasMany(b => b.BookCopies)
            .WithOne(bc => bc.Book)
            .HasForeignKey(bc => bc.BookId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Book>()
            .HasMany(b => b.BorrowTransactions)
            .WithOne(bt => bt.Book)
            .HasForeignKey(bt => bt.BookId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Category
        modelBuilder.Entity<Category>()
            .HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure BorrowTransaction
        modelBuilder.Entity<BorrowTransaction>()
            .HasOne(bt => bt.BookCopy)
            .WithOne(bc => bc.CurrentBorrowTransaction)
            .HasForeignKey<BorrowTransaction>(bt => bt.BookCopyId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<BorrowTransaction>()
            .HasMany(bt => bt.Fines)
            .WithOne(f => f.BorrowTransaction)
            .HasForeignKey(f => f.BorrowTransactionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Fine
        modelBuilder.Entity<Fine>()
            .HasMany(f => f.Payments)
            .WithOne(p => p.Fine)
            .HasForeignKey(p => p.FineId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Wishlist
        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.Member)
            .WithMany(m => m.WishlistItems)
            .HasForeignKey(w => w.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.Book)
            .WithMany(b => b.WishlistItems)
            .HasForeignKey(w => w.BookId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure BookTag (junction table)
        modelBuilder.Entity<BookTag>()
            .HasOne(bt => bt.Book)
            .WithMany(b => b.BookTags)
            .HasForeignKey(bt => bt.BookId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BookTag>()
            .HasOne(bt => bt.Tag)
            .WithMany(t => t.BookTags)
            .HasForeignKey(bt => bt.TagId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure AuditLog
        modelBuilder.Entity<AuditLog>()
            .HasOne(al => al.User)
            .WithMany(u => u.AuditLogs)
            .HasForeignKey(al => al.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Notification
        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes for performance
        modelBuilder.Entity<Member>()
            .HasIndex(m => m.MembershipNumber)
            .IsUnique();

        modelBuilder.Entity<Book>()
            .HasIndex(b => b.ISBN)
            .IsUnique();

        modelBuilder.Entity<BookCopy>()
            .HasIndex(bc => bc.Barcode)
            .IsUnique();

        modelBuilder.Entity<BorrowTransaction>()
            .HasIndex(bt => new { bt.MemberId, bt.Status });

        modelBuilder.Entity<Reservation>()
            .HasIndex(r => new { r.BookId, r.Status });

        modelBuilder.Entity<Fine>()
            .HasIndex(f => new { f.MemberId, f.Status });

        modelBuilder.Entity<AuditLog>()
            .HasIndex(al => new { al.UserId, al.Timestamp });

        modelBuilder.Entity<Notification>()
            .HasIndex(n => new { n.UserId, n.IsRead });

        // Configure global query filters for soft deletes
        modelBuilder.Entity<Book>()
            .HasQueryFilter(b => !b.IsDeleted);

        modelBuilder.Entity<Member>()
            .HasQueryFilter(m => !m.IsDeleted);

        modelBuilder.Entity<Author>()
            .HasQueryFilter(a => !a.IsDeleted);

        modelBuilder.Entity<Publisher>()
            .HasQueryFilter(p => !p.IsDeleted);

        modelBuilder.Entity<Category>()
            .HasQueryFilter(c => !c.IsDeleted);

        modelBuilder.Entity<Tag>()
            .HasQueryFilter(t => !t.IsDeleted);
    }
}
