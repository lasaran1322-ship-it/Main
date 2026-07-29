namespace LibraryPro.Api.Dtos.Book;

public class BookDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public Guid PublisherId { get; set; }
    public string PublisherName { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Language { get; set; } = "English";
    public int PublicationYear { get; set; }
    public string Edition { get; set; } = string.Empty;
    public int PageCount { get; set; }
    public string Format { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int TotalCopies { get; set; }
    public int AvailableCopies { get; set; }
    public string CoverImageUrl { get; set; } = string.Empty;
    public DateTime PublishedDate { get; set; }
    public string Status { get; set; } = "Active";
}

public class CreateBookRequest
{
    public string Title { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public Guid PublisherId { get; set; }
    public Guid CategoryId { get; set; }
    public string Language { get; set; } = "English";
    public int PublicationYear { get; set; }
    public string Edition { get; set; } = string.Empty;
    public int PageCount { get; set; }
    public string Format { get; set; } = "Hardcover";
    public decimal Price { get; set; }
    public int TotalCopies { get; set; }
    public string CoverImageUrl { get; set; } = string.Empty;
}

public class UpdateBookRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public Guid PublisherId { get; set; }
    public Guid CategoryId { get; set; }
    public decimal Price { get; set; }
    public string Edition { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
}
