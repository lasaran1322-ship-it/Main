import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const { token } = useAuthStore.getState()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout()
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password })
  }

  register(data: any) {
    return this.client.post('/auth/register', data)
  }

  // Book endpoints
  getBooks(page = 1, pageSize = 10, search?: string, categoryId?: string) {
    return this.client.get('/books', {
      params: { page, pageSize, search, categoryId },
    })
  }

  getBook(id: string) {
    return this.client.get(`/books/${id}`)
  }

  // Borrowing endpoints
  getMemberBorrows(memberId: string, page = 1, pageSize = 10) {
    return this.client.get(`/borrowing/member/${memberId}`, {
      params: { page, pageSize },
    })
  }

  getActiveBorrows(page = 1, pageSize = 10) {
    return this.client.get('/borrowing/active', {
      params: { page, pageSize },
    })
  }

  issueBorrow(data: any) {
    return this.client.post('/borrowing/issue', data)
  }

  returnBorrow(data: any) {
    return this.client.post('/borrowing/return', data)
  }

  renewBorrow(id: string, data: any) {
    return this.client.post(`/borrowing/renew/${id}`, data)
  }

  getOverdueBorrows() {
    return this.client.get('/borrowing/overdue')
  }

  // Reservation endpoints
  createReservation(bookId: string, notes?: string) {
    return this.client.post('/reservations', { bookId, notes })
  }

  getMemberReservations(memberId: string, page = 1, pageSize = 10) {
    return this.client.get(`/reservations/member/${memberId}`, {
      params: { page, pageSize },
    })
  }

  cancelReservation(id: string, reason?: string) {
    return this.client.post(`/reservations/${id}/cancel`, { reason })
  }

  // Fine endpoints
  getMemberFines(memberId: string) {
    return this.client.get(`/fines/member/${memberId}`)
  }

  payFine(fineId: string, amount: number, paymentMethod: string = 'Cash') {
    return this.client.post('/fines/payment', {
      fineId,
      amount,
      paymentMethod,
    })
  }

  // Wishlist endpoints
  addToWishlist(bookId: string) {
    return this.client.post('/wishlist', { bookId })
  }

  removeFromWishlist(bookId: string) {
    return this.client.delete(`/wishlist/${bookId}`)
  }

  getMemberWishlist(memberId: string) {
    return this.client.get(`/wishlist/member/${memberId}`)
  }
}

export const apiClient = new ApiClient()
