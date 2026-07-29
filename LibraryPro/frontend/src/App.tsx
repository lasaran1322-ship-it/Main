import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import MemberDashboard from './pages/member/Dashboard'
import BrowseBooks from './pages/member/BrowseBooks'
import MyLoans from './pages/member/MyLoans'
import Wishlist from './pages/member/Wishlist'
import LibrarianDashboard from './pages/librarian/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          {/* Member Routes */}
          {user?.role === 'Member' && (
            <>
              <Route path="/" element={<MemberDashboard />} />
              <Route path="/browse-books" element={<BrowseBooks />} />
              <Route path="/my-loans" element={<MyLoans />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </>
          )}

          {/* Librarian Routes */}
          {user?.role === 'Librarian' && (
            <>
              <Route path="/" element={<LibrarianDashboard />} />
            </>
          )}

          {/* Admin Routes */}
          {user?.role === 'Administrator' && (
            <>
              <Route path="/" element={<AdminDashboard />} />
            </>
          )}
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
