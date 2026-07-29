import { Users, BookOpen, TrendingUp, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '3,542', icon: Users, color: 'blue' },
    { label: 'Total Books', value: '8,234', icon: BookOpen, color: 'green' },
    { label: 'Active Members', value: '2,891', icon: TrendingUp, color: 'purple' },
    { label: 'System Status', value: 'Healthy', icon: Settings, color: 'yellow' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Administrator Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage library system and configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Administration</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-center">
            <Users className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Manage Users</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-center">
            <BookOpen className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Manage Books</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-center">
            <TrendingUp className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">View Analytics</span>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition text-center">
            <Settings className="mx-auto mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
