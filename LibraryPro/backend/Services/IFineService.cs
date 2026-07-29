using LibraryPro.Api.Dtos.Fine;

namespace LibraryPro.Api.Services;

public interface IFineService
{
    Task<IEnumerable<FineDto>> GetMemberFinesAsync(Guid memberId);
    Task<FineDto?> GetFineAsync(Guid fineId);
    Task<decimal> CalculateOverdueFineAsync(Guid borrowTransactionId);
    Task GenerateOverdueFinesAsync();
    Task<bool> MakeFinePaymentAsync(MakeFinePaymentRequest request);
    Task<FineReportDto> GetMemberFineReportAsync(Guid memberId);
    Task<IEnumerable<FineReportDto>> GetOutstandingFinesReportAsync();
}
