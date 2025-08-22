import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import Home from './pages/public/Home'
import Menu from './pages/menu/Menu'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/profile/Profile'
import Orders from './pages/orders/Orders'
import Reservations from './pages/reservations/Reservations'
import Contact from './pages/contact/Contact'
import Dashboard from './pages/admin/Dashboard'
import MenuManagement from './pages/admin/MenuManagement'
import ProtectedRoute from './components/common/ProtectedRoute'
import { ROUTES } from './constants'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.MENU} element={<Menu />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          
          {/* Protected Routes */}
          <Route path={ROUTES.PROFILE} element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.ORDERS} element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.RESERVATIONS} element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
        </Route>
        
        {/* Routes sans layout (auth) */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        
        {/* Catch all route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
              <a href="/" className="text-primary-600 hover:text-primary-500 font-medium">
                Retourner à l'accueil
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App