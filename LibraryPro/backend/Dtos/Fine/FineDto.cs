namespace LibraryPro.Api.Dtos.Fine;

public class FineDto
{
    public Guid Id { get; set; }
    public Guid MemberId { get; set; }
    public Guid BorrowTransactionId { get; set; }
    public decimal Amount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal RemainingAmount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime ImposedDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class MakeFinePaymentRequest
{
    public Guid FineId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "Cash";
    public string TransactionReference { get; set; } = string.Empty;
}

public class FineReportDto
{
    public Guid MemberId { get; set; }
    public string MemberName { get; set; } = string.Empty;
    public decimal TotalFines { get; set; }
    public decimal PaidFines { get; set; }
    public decimal OutstandingFines { get; set; }
    public int FineCount { get; set; }
}
