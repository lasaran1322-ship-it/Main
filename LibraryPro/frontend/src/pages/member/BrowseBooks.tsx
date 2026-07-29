import { useEffect, useState } from 'react'
import { apiClient } from '../../services/api'
import { BookOpen, Search, Heart } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  coverImage?: string
  availableCopies: number
  totalCopies: number
}

export default function BrowseBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchBooks()
  }, [search, page])

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.getBooks(page, 12, search || undefined)
      setBooks(response.data.items || [])
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = async (bookId: string) => {
    try {
      if (wishlist.has(bookId)) {
        await apiClient.removeFromWishlist(bookId)
        setWishlist((prev) => {
          const newSet = new Set(prev)
          newSet.delete(bookId)
          return newSet
        })
      } else {
        await apiClient.addToWishlist(bookId)
        setWishlist((prev) => new Set(prev).add(bookId))
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Books</h1>
        <p className="text-gray-600 mt-2">Discover our library collection</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={32} />
            <p className="text-gray-600">No books found</p>
          </div>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {/* Book Cover */}
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={48} />
              </div>

              {/* Book Details */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <p className="text-xs text-gray-500 mb-3">ISBN: {book.isbn}</p>

                <div className="mt-auto space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Available:</span>
                    <span className={book.availableCopies > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {book.availableCopies}/{book.totalCopies}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={book.availableCopies === 0}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded font-medium text-sm transition"
                    >
                      Borrow
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(book.id)}
                      className={`p-2 rounded transition ${
                        wishlist.has(book.id)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart size={18} fill={wishlist.has(book.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && books.length > 0 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
