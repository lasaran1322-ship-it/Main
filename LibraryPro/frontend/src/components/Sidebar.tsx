import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  Home,
  BookOpen,
  Clock,
  Heart,
  Users,
  FileText,
  CreditCard,
  Settings,
  BarChart3,
} from 'lucide-react'
import clsx from 'clsx'

export default function Sidebar() {
  const { user } = useAuthStore()

  const getMemberMenuItems = () => [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Browse Books', path: '/browse-books', icon: BookOpen },
    { label: 'My Loans', path: '/my-loans', icon: Clock },
    { label: 'Wishlist', path: '/wishlist', icon: Heart },
  ]

  const getLibrarianMenuItems = () => [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Book Circulation', path: '/circulation', icon: BookOpen },
    { label: 'Members', path: '/members', icon: Users },
    { label: 'Reservations', path: '/reservations', icon: Clock },
    { label: 'Fines', path: '/fines', icon: CreditCard },
    { label: 'Reports', path: '/reports', icon: FileText },
  ]

  const getAdminMenuItems = () => [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Users', path: '/users', icon: Users },
    { label: 'Books', path: '/books', icon: BookOpen },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  const getMenuItems = () => {
    switch (user?.role) {
      case 'Member':
        return getMemberMenuItems()
      case 'Librarian':
        return getLibrarianMenuItems()
      case 'Administrator':
        return getAdminMenuItems()
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-400">LibraryPro</h2>
        <p className="text-sm text-gray-400 mt-1">Library Management System</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                )
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">© 2024 LibraryPro</p>
      </div>
    </aside>
  )
}
