import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import MediaList from './pages/MediaList'
import Register from './pages/Register'

function App() {
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
              
              {/* Desktop Nav */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/" className="hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium">ホーム</Link>
                  <Link to="/media" className="hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium">メディア一覧</Link>
                  <Link to="/register" className="hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium">登録</Link>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none"
                >
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

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div className="md:hidden bg-indigo-800 pb-3 pt-2 px-2 space-y-1 sm:px-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:bg-indigo-600 px-3 py-2 rounded-md text-base font-medium"
              >
                ホーム
              </Link>
              <Link
                to="/media"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:bg-indigo-600 px-3 py-2 rounded-md text-base font-medium"
              >
                メディア一覧
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:bg-indigo-600 px-3 py-2 rounded-md text-base font-medium"
              >
                登録
              </Link>
            </div>
          )}
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/media" element={<MediaList />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
