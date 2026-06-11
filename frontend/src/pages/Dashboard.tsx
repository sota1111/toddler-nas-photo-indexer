import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAgeGroups, fetchMedia } from '../api'
import type { AgeGroupCount, Media } from '../api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [ageGroups, setAgeGroups] = useState<AgeGroupCount[]>([])
  const [favorites, setFavorites] = useState<Media[]>([])
  const [recentMedia, setRecentMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groups, favs, all] = await Promise.all([
          fetchAgeGroups(),
          fetchMedia({ is_favorite: true }),
          fetchMedia()
        ])
        setAgeGroups(groups)
        setFavorites(favs.slice(0, 6))
        
        // Sort all by created_at descending and take first 6
        const sortedAll = [...all].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setRecentMedia(sortedAll.slice(0, 6))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(loading => !loading) // This was a bit weird, should just be false
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-indigo-600">読み込み中...</div>
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Section 1 — 月ごとの思い出 */}
      <section>
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
          <span className="mr-2">👶</span> 月ごとの思い出
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ageGroups.map((group) => (
            <button
              key={group.age_months}
              onClick={() => navigate(`/media?age_months=${group.age_months}`)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-50 hover:border-indigo-200 hover:shadow-md transition-all text-left group"
            >
              <div className="text-3xl font-bold text-indigo-600 group-hover:scale-110 transition-transform">
                {group.age_months} <span className="text-sm font-normal text-gray-500">ヶ月</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">{group.count} 件の思い出</div>
            </button>
          ))}
          {ageGroups.length === 0 && (
            <p className="col-span-full text-gray-400 py-8 text-center bg-gray-50 rounded-xl">
              まだ月齢データがありません。
            </p>
          )}
        </div>
      </section>

      {/* Section 2 — お気に入り */}
      <section>
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
          <span className="mr-2">⭐</span> お気に入り
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {favorites.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
          {favorites.length === 0 && (
            <p className="col-span-full text-gray-400 py-8 text-center bg-gray-50 rounded-xl">
              お気に入りはまだありません。
            </p>
          )}
        </div>
      </section>

      {/* Section 3 — 最近の追加 */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
            <span className="mr-2">🕒</span> 最近の追加
          </h2>
          <button 
            onClick={() => navigate('/media')}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            すべて見る →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentMedia.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
          {recentMedia.length === 0 && (
            <p className="col-span-full text-gray-400 py-8 text-center bg-gray-50 rounded-xl">
              メディアが登録されていません。
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function MediaCard({ item }: { item: Media }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="aspect-square bg-indigo-50 flex items-center justify-center text-4xl relative">
        {item.file_type === 'video' ? '🎬' : '📷'}
        {item.is_favorite && (
          <span className="absolute top-1 right-1 text-xl">⭐</span>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs font-bold text-indigo-600 mb-1">
          {item.file_type === 'video' ? 'VIDEO' : 'PHOTO'}
        </div>
        <div className="text-sm font-medium text-gray-900 truncate" title={item.filename}>
          {item.filename}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {new Date(item.taken_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
