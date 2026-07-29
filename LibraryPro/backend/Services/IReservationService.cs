using LibraryPro.Api.Dtos.Reservation;

namespace LibraryPro.Api.Services;

public interface IReservationService
{
    Task<ReservationDto> ReserveBookAsync(Guid memberId, CreateReservationRequest request);
    Task<bool> CancelReservationAsync(CancelReservationRequest request);
    Task<IEnumerable<ReservationDto>> GetMemberReservationsAsync(Guid memberId);
    Task<IEnumerable<ReservationDto>> GetBookReservationsAsync(Guid bookId);
    Task NotifyReservationAvailableAsync(Guid reservationId);
    Task ProcessExpiredReservationsAsync();
}
