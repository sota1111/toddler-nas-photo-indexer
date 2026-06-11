import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMedia } from '../api'
import type { MediaCreate } from '../api'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<MediaCreate>({
    filename: '',
    nas_path: '',
    file_type: 'photo',
    taken_at: '',
    age_months: 0,
    event_name: '',
    tags: '',
    memo: '',
    is_favorite: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age_months' ? parseInt(value) || 0 : val
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await createMedia(formData)
      navigate('/media')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録中にエラーが発生しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">メディア登録</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ファイル名 *</label>
            <input
              type="text"
              name="filename"
              required
              value={formData.filename}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* NAS Path */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NASパス *</label>
            <input
              type="text"
              name="nas_path"
              placeholder="/volume1/photos/..."
              required
              value={formData.nas_path}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* File Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ファイル種別 *</label>
            <select
              name="file_type"
              value={formData.file_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="photo">写真 📷</option>
              <option value="video">動画 🎬</option>
            </select>
          </div>

          {/* Taken At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">撮影日 *</label>
            <input
              type="date"
              name="taken_at"
              required
              value={formData.taken_at}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Age Months */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">月齢 *</label>
            <input
              type="number"
              name="age_months"
              min="0"
              max="36"
              required
              value={formData.age_months}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">イベント名</label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">タグ</label>
            <input
              type="text"
              name="tags"
              placeholder="タグ1, タグ2"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Memo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
            <textarea
              name="memo"
              rows={3}
              value={formData.memo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Is Favorite */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_favorite"
              id="is_favorite"
              checked={formData.is_favorite}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_favorite" className="ml-2 block text-sm text-gray-900">
              お気に入りに追加
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 rounded-md text-white font-medium shadow-sm transition-colors ${
              submitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {submitting ? '登録中...' : '登録する'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Register
