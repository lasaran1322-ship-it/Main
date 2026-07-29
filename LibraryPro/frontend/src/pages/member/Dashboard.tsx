import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { BookOpen, Clock, AlertCircle, Heart } from 'lucide-react'
import { apiClient } from '../../services/api'

interface Stats {
  activeLoans: number
  dueThisWeek: number
  overdueBooks: number
  totalFines: number
}

export default function MemberDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats>({
    activeLoans: 0,
    dueThisWeek: 0,
    overdueBooks: 0,
    totalFines: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.id) {
          const [borrows, fines] = await Promise.all([
            apiClient.getMemberBorrows(user.id, 1, 1000),
            apiClient.getMemberFines(user.id),
          ])

          const now = new Date()
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

          const activeBorrows = borrows.data.items || []
          const dueSoon = activeBorrows.filter((b: any) => {
            const dueDate = new Date(b.dueDate)
            return dueDate <= weekFromNow && dueDate > now && !b.returnedDate
          })
          const overdue = activeBorrows.filter((b: any) => {
            const dueDate = new Date(b.dueDate)
            return dueDate <= now && !b.returnedDate
          })

          const totalOutstanding = (fines.data || [])
            .filter((f: any) => f.status === 'Outstanding' || f.status === 'PartiallyPaid')
            .reduce((sum: number, f: any) => sum + (f.amount - f.paidAmount), 0)

          setStats({
            activeLoans: activeBorrows.filter((b: any) => !b.returnedDate).length,
            dueThisWeek: dueSoon.length,
            overdueBooks: overdue.length,
            totalFines: totalOutstanding,
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user?.id])

  const statCards = [
    {
      label: 'Active Loans',
      value: stats.activeLoans,
      icon: BookOpen,
      color: 'blue',
    },
    {
      label: 'Due This Week',
      value: stats.dueThisWeek,
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'Overdue Books',
      value: stats.overdueBooks,
      icon: AlertCircle,
      color: 'red',
    },
    {
      label: 'Outstanding Fines',
      value: `$${stats.totalFines.toFixed(2)}`,
      icon: Heart,
      color: 'purple',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-2">Here's your library dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            yellow: 'bg-yellow-50 text-yellow-600',
            red: 'bg-red-50 text-red-600',
            purple: 'bg-purple-50 text-purple-600',
          }

          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className={`inline-flex p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <Icon size={24} />
              </div>
              <p className="text-gray-600 text-sm mt-4">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-center">
            <BookOpen className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Browse Books</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-center">
            <Clock className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">My Loans</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-center">
            <Heart className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Wishlist</span>
          </button>
          <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition text-center">
            <AlertCircle className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Pay Fines</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {stats.overdueBooks > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <div>
            <p className="font-semibold text-red-900">You have overdue books</p>
            <p className="text-sm text-red-700">{stats.overdueBooks} book(s) are overdue. Please return them to avoid fines.</p>
          </div>
        </div>
      )}
    </div>
  )
}
