import { BarChart3, Users, BookOpen, AlertCircle } from 'lucide-react'

export default function LibrarianDashboard() {
  const stats = [
    { label: 'Total Members', value: '2,543', icon: Users, color: 'blue' },
    { label: 'Books Issued Today', value: '47', icon: BookOpen, color: 'green' },
    { label: 'Overdue Books', value: '23', icon: AlertCircle, color: 'red' },
    { label: 'Pending Returns', value: '156', icon: BarChart3, color: 'yellow' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage library operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            red: 'bg-red-50 text-red-600',
            yellow: 'bg-yellow-50 text-yellow-600',
          }

          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className={`inline-flex p-3 rounded-lg ${colorClasses[stat.color]}`}>
                <Icon size={24} />
              </div>
              <p className="text-gray-600 text-sm mt-4">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-center">
            <BookOpen className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Issue Book</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-center">
            <BookOpen className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Accept Return</span>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition text-center">
            <AlertCircle className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">View Overdue</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-center">
            <BarChart3 className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}
