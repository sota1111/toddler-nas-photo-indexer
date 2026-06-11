import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchMedia, fetchAgeGroups, fetchEvents, fetchTags, toggleFavorite } from '../api'
import type { Media, AgeGroupCount } from '../api'

export default function MediaList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [media, setMedia] = useState<Media[]>([])
  const [ageGroups, setAgeGroups] = useState<AgeGroupCount[]>([])
  const [events, setEvents] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  // Filter states
  const fileType = searchParams.get('file_type') || ''
  const ageMonths = searchParams.get('age_months') ? Number(searchParams.get('age_months')) : undefined
  const eventName = searchParams.get('event_name') || ''
  const tag = searchParams.get('tag') || ''
  const query = searchParams.get('q') || ''
  const isFavorite = searchParams.get('is_favorite') === 'true'

  const updateSearchParams = useCallback((updates: Record<string, string | number | boolean | undefined>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === false) {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })
    setLoading(true)
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  useEffect(() => {
    let ignore = false

    const loadFilters = async () => {
      try {
        const [groups, evs, ts] = await Promise.all([
          fetchAgeGroups(),
          fetchEvents(),
          fetchTags()
        ])
        if (!ignore) {
          setAgeGroups(groups)
          setEvents(evs)
          setTags(ts)
        }
      } catch (error) {
        console.error('Error loading filters:', error)
      }
    }

    void loadFilters()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    const loadMedia = async () => {
      try {
        const data = await fetchMedia({
          file_type: fileType || undefined,
          age_months: ageMonths,
          event_name: eventName || undefined,
          tag: tag || undefined,
          q: query || undefined,
          is_favorite: isFavorite || undefined
        })
        if (!ignore) {
          setMedia(data)
        }
      } catch (error) {
        console.error('Error loading media:', error)
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void loadMedia()
    return () => {
      ignore = true
    }
  }, [fileType, ageMonths, eventName, tag, query, isFavorite])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') || ''
      if (searchQuery !== currentQ) {
        updateSearchParams({ q: searchQuery })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchParams, updateSearchParams])

  const handleToggleFavorite = async (id: number) => {
    // Optimistic update
    setMedia(prev => prev.map(m => m.id === id ? { ...m, is_favorite: !m.is_favorite } : m))
    try {
      await toggleFavorite(id)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      // Rollback
      setMedia(prev => prev.map(m => m.id === id ? { ...m, is_favorite: !m.is_favorite } : m))
    }
  }

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">メディア一覧</h1>
          <p className="text-gray-500 mt-1">{media.length} 件のアイテム</p>
        </div>
        
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center"
        >
          {isFilterOpen ? 'フィルタを閉じる' : 'フィルタを開く'}
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block bg-white p-6 rounded-2xl shadow-sm border border-indigo-50 mb-8`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Keyword */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">キーワード</label>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索..."
              className="border-gray-200 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Age Months */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">月齢</label>
            <select 
              value={ageMonths || ''} 
              onChange={(e) => updateSearchParams({ age_months: e.target.value })}
              className="border-gray-200 border rounded-lg px-3 py-2 bg-white"
            >
              <option value="">すべて</option>
              {ageGroups.map(g => (
                <option key={g.age_months} value={g.age_months}>{g.age_months} ヶ月</option>
              ))}
            </select>
          </div>

          {/* Event */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">イベント</label>
            <select 
              value={eventName} 
              onChange={(e) => updateSearchParams({ event_name: e.target.value })}
              className="border-gray-200 border rounded-lg px-3 py-2 bg-white"
            >
              <option value="">すべて</option>
              {events.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">タグ</label>
            <select 
              value={tag} 
              onChange={(e) => updateSearchParams({ tag: e.target.value })}
              className="border-gray-200 border rounded-lg px-3 py-2 bg-white"
            >
              <option value="">すべて</option>
              {tags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* File Type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">種類</label>
            <select 
              value={fileType} 
              onChange={(e) => updateSearchParams({ file_type: e.target.value })}
              className="border-gray-200 border rounded-lg px-3 py-2 bg-white"
            >
              <option value="">すべて</option>
              <option value="photo">写真 📷</option>
              <option value="video">動画 🎬</option>
            </select>
          </div>

          {/* Favorite */}
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => updateSearchParams({ is_favorite: e.target.checked })}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">⭐ お気に入りのみ</span>
            </label>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-12 text-center text-indigo-600">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-lg transition-all">
              <div className="aspect-video bg-indigo-50 flex items-center justify-center text-5xl relative">
                {item.file_type === 'video' ? '🎬' : '📷'}
                <button 
                  onClick={() => handleToggleFavorite(item.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${item.is_favorite ? 'bg-amber-100 text-amber-500' : 'bg-white/80 text-gray-400 hover:text-amber-500'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={item.is_favorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    {item.file_type === 'video' ? 'VIDEO' : 'PHOTO'}
                  </span>
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    {item.age_months} ヶ月
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 truncate flex-1" title={item.filename}>
                    {item.filename}
                  </h3>
                </div>
                
                <div className="space-y-2 mt-auto">
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="truncate" title={item.nas_path}>
                      📂 {item.nas_path.length > 40 ? item.nas_path.substring(0, 37) + '...' : item.nas_path}
                    </span>
                  </div>
                  
                  {(item.event_name || item.tags) && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {item.event_name && (
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full border border-indigo-100">
                          📍 {item.event_name}
                        </span>
                      )}
                      {item.tags?.split(',').map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-[10px] text-gray-400 pt-2 flex justify-between">
                    <span>📅 {new Date(item.taken_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {media.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">見つかりませんでした 🔍</p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-4 text-indigo-600 font-bold hover:underline"
              >
                フィルタをリセット
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
