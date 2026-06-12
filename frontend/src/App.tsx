import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MediaList from './pages/MediaList'
import Register from './pages/Register'

function AppLayout() {
  const { isAuthenticated, username, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-50 bg-indigo-700 text-white shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold flex items-center gap-2">
                  <span>👶</span>
                  <span>おもいでインデックス</span>
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated && (
                  <>
                    <Link to="/" className="hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium">ホーム</Link>
                    <Link to="/media" className="hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium">メディア一覧</Link>
                    <Link to="/register" className="hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium">登録</Link>
                    <span className="text-sm text-indigo-200">{username}</span>
                    <button onClick={logout} className="hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium">ログアウト</button>
                  </>
                )}
              </div>
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </nav>
          {isMenuOpen && isAuthenticated && (
            <div className="md:hidden bg-indigo-800 pb-3 pt-2 px-2 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block hover:bg-indigo-600 px-3 py-2 rounded-md text-base font-medium">ホーム</Link>
              <Link to="/media" onClick={() => setIsMenuOpen(false)} className="block hover:bg-indigo-600 px-3 py-2 rounded-md text-base font-medium">メディア一覧</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block hover:bg-indigo-600 px-3 py-2 rounded-md text-base font-medium">登録</Link>
              <button onClick={() => { logout(); setIsMenuOpen(false) }} className="block w-full text-left hover:bg-indigo-600 px-3 py-2 rounded-md text-base font-medium">ログアウト</button>
            </div>
          )}
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/media" element={<ProtectedRoute><MediaList /></ProtectedRoute>} />
            <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}

export default App
