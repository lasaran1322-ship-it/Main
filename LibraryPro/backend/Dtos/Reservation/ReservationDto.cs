namespace LibraryPro.Api.Dtos.Reservation;

public class ReservationDto
{
    public Guid Id { get; set; }
    public Guid MemberId { get; set; }
    public Guid BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public DateTime ReservationDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public int QueuePosition { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public bool IsExpired { get; set; }
}

public class CreateReservationRequest
{
    public Guid BookId { get; set; }
    public string Notes { get; set; } = string.Empty;
}

public class CancelReservationRequest
{
    public Guid ReservationId { get; set; }
    public string Reason { get; set; } = string.Empty;
}
