import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/public/Home'
import Menu from './pages/menu/Menu'
import Login from './pages/auth/Login'
import { ROUTES } from './constants'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.MENU} element={<Menu />} />
        </Route>
        
        {/* Routes sans layout (auth) */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        
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