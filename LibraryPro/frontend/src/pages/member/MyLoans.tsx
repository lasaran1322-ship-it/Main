import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { apiClient } from '../../services/api'
import { Calendar, AlertCircle, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Loan {
  id: string
  bookTitle: string
  issuedDate: string
  dueDate: string
  returnedDate?: string
  status: string
  renewCount: number
  maxRenewals: number
  isOverdue: boolean
  overdueDays: number
}

export default function MyLoans() {
  const { user } = useAuthStore()
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')

  useEffect(() => {
    fetchLoans()
  }, [user?.id, activeTab])

  const fetchLoans = async () => {
    setIsLoading(true)
    try {
      if (user?.id) {
        const response = await apiClient.getMemberBorrows(user.id, 1, 100)
        const allLoans = response.data.items || []

        if (activeTab === 'active') {
          setLoans(allLoans.filter((l: any) => !l.returnedDate))
        } else {
          setLoans(allLoans.filter((l: any) => l.returnedDate))
        }
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRenew = async (loanId: string) => {
    try {
      await apiClient.renewBorrow(loanId, {})
      await fetchLoans()
    } catch (error) {
      console.error('Failed to renew loan:', error)
    }
  }

  const handleReturn = async (loanId: string) => {
    try {
      await apiClient.returnBorrow({ borrowTransactionId: loanId })
      await fetchLoans()
    } catch (error) {
      console.error('Failed to return book:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Loans</h1>
        <p className="text-gray-600 mt-2">Manage your borrowed books</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-6 py-4 font-medium text-center transition ${
              activeTab === 'active'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Loans
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 font-medium text-center transition ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-gray-600">Loading loans...</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-gray-600">
              {activeTab === 'active' ? 'You have no active loans' : 'Your loan history is empty'}
            </p>
          </div>
        ) : (
          loans.map((loan) => (
            <div
              key={loan.id}
              className={`bg-white p-4 rounded-lg shadow ${loan.isOverdue ? 'border-l-4 border-red-500' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{loan.bookTitle}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-gray-600">Issued</p>
                      <p className="font-medium text-gray-900">
                        {formatDistanceToNow(new Date(loan.issuedDate), { addSuffix: true })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Due</p>
                      <p className={`font-medium ${loan.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDistanceToNow(new Date(loan.dueDate), { addSuffix: true })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium text-gray-900">{loan.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Renewals</p>
                      <p className="font-medium text-gray-900">
                        {loan.renewCount}/{loan.maxRenewals}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {activeTab === 'active' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRenew(loan.id)}
                      disabled={loan.renewCount >= loan.maxRenewals}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded transition text-sm"
                    >
                      <RefreshCw size={16} />
                      Renew
                    </button>
                    <button
                      onClick={() => handleReturn(loan.id)}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition text-sm"
                    >
                      Return
                    </button>
                  </div>
                )}
              </div>

              {/* Overdue Alert */}
              {loan.isOverdue && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{loan.overdueDays} day(s) overdue</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
