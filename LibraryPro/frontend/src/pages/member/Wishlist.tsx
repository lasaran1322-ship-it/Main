import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { apiClient } from '../../services/api'
import { Heart, BookOpen } from 'lucide-react'

interface WishlistItem {
  id: string
  bookId: string
  bookTitle: string
  author: string
  availableCopies: number
  totalCopies: number
  addedDate: string
}

export default function Wishlist() {
  const { user } = useAuthStore()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [user?.id])

  const fetchWishlist = async () => {
    setIsLoading(true)
    try {
      if (user?.id) {
        const response = await apiClient.getMemberWishlist(user.id)
        setWishlistItems(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      await apiClient.removeFromWishlist(bookId)
      setWishlistItems((prev) => prev.filter((item) => item.bookId !== bookId))
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const handleReserveBook = async (bookId: string) => {
    try {
      await apiClient.createReservation(bookId)
      alert('Book reserved successfully!')
    } catch (error) {
      console.error('Failed to reserve book:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600 mt-2">Books you're interested in</p>
      </div>

      {/* Wishlist Items */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center">
            <Heart className="mx-auto mb-4 text-gray-400" size={32} />
            <p className="text-gray-600">Your wishlist is empty</p>
            <p className="text-sm text-gray-500 mt-2">Start adding books to your wishlist!</p>
          </div>
        ) : (
          wishlistItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{item.bookTitle}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.author}</p>

                  <div className="flex items-center gap-4 text-sm mt-3">
                    <span className={`px-3 py-1 rounded-full ${
                      item.availableCopies > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.availableCopies > 0 ? 'Available' : 'Unavailable'}
                    </span>
                    <span className="text-gray-600">
                      {item.availableCopies}/{item.totalCopies} copies available
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleReserveBook(item.bookId)}
                    disabled={item.availableCopies > 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded transition text-sm"
                  >
                    Reserve
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.bookId)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
