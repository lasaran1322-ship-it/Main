using LibraryPro.Api.Dtos.Book;
using LibraryPro.Api.Models;

namespace LibraryPro.Api.Services;

public interface IBookService
{
    Task<IEnumerable<BookDto>> GetAllBooksAsync(int pageNumber = 1, int pageSize = 20);
    Task<BookDto?> GetBookByIdAsync(Guid id);
    Task<IEnumerable<BookDto>> SearchBooksAsync(string query);
    Task<BookDto> AddBookAsync(CreateBookRequest request);
    Task<BookDto> UpdateBookAsync(Guid id, UpdateBookRequest request);
    Task<bool> DeleteBookAsync(Guid id);
    Task<IEnumerable<BookDto>> GetBooksByCategoryAsync(Guid categoryId);
    Task<IEnumerable<BookDto>> GetBooksByAuthorAsync(Guid authorId);
    Task<int> GetAvailableCopiesCountAsync(Guid bookId);
}
