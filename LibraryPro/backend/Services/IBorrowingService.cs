using LibraryPro.Api.Dtos.Borrowing;

namespace LibraryPro.Api.Services;

public interface IBorrowingService
{
    Task<BorrowTransactionDto> IssueBorrowAsync(IssueBorrowRequest request);
    Task<BorrowTransactionDto> ReturnBorrowAsync(ReturnBorrowRequest request);
    Task<BorrowTransactionDto> RenewBorrowAsync(RenewBorrowRequest request);
    Task<IEnumerable<BorrowTransactionDto>> GetMemberLoansAsync(Guid memberId);
    Task<IEnumerable<BorrowTransactionDto>> GetOverdueBooksAsync();
    Task<BorrowTransactionDto?> GetBorrowTransactionAsync(Guid id);
    Task<bool> ValidateMemberCanBorrowAsync(Guid memberId);
}
