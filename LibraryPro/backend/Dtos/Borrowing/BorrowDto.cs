namespace LibraryPro.Api.Dtos.Borrowing;

public class BorrowTransactionDto
{
    public Guid Id { get; set; }
    public Guid MemberId { get; set; }
    public Guid BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public Guid BookCopyId { get; set; }
    public string BookBarcode { get; set; } = string.Empty;
    public DateTime IssuedDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnedDate { get; set; }
    public int BorrowDays { get; set; }
    public int RenewCount { get; set; }
    public int MaxRenewals { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public bool IsOverdue { get; set; }
    public int OverdueDays { get; set; }
}

public class IssueBorrowRequest
{
    public Guid MemberId { get; set; }
    public Guid BookId { get; set; }
    public Guid BookCopyId { get; set; }
    public int BorrowDays { get; set; } = 14;
    public string Notes { get; set; } = string.Empty;
}

public class ReturnBorrowRequest
{
    public Guid BorrowTransactionId { get; set; }
    public string Notes { get; set; } = string.Empty;
}

public class RenewBorrowRequest
{
    public Guid BorrowTransactionId { get; set; }
    public string Notes { get; set; } = string.Empty;
}
