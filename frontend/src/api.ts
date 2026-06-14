export interface Media {
  id: number
  filename: string
  nas_path: string
  file_type: string
  taken_at: string
  age_months: number
  event_name: string | null
  tags: string | null
  memo: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string | null
}

export interface MediaCreate {
  filename: string
  nas_path: string
  file_type: string
  taken_at: string
  age_months: number
  event_name?: string
  tags?: string
  memo?: string
  is_favorite?: boolean
}

export interface AgeGroupCount {
  age_months: number
  count: number
}

export async function fetchMedia(filters?: {
  file_type?: string
  age_months?: number
  event_name?: string
  tag?: string
  q?: string
  is_favorite?: boolean
}): Promise<Media[]> {
  const params = new URLSearchParams()
  if (filters) {
    if (filters.file_type) params.append('file_type', filters.file_type)
    if (filters.age_months !== undefined) params.append('age_months', filters.age_months.toString())
    if (filters.event_name) params.append('event_name', filters.event_name)
    if (filters.tag) params.append('tag', filters.tag)
    if (filters.q) params.append('q', filters.q)
    if (filters.is_favorite !== undefined) params.append('is_favorite', filters.is_favorite.toString())
  }
  const response = await fetch(`/api/media?${params.toString()}`, {
    credentials: 'include'
  })
  if (!response.ok) throw new Error('Failed to fetch media')
  return response.json()
}

export async function createMedia(data: MediaCreate): Promise<Media> {
  const response = await fetch(`/api/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create media')
  return response.json()
}

export async function toggleFavorite(id: number): Promise<Media> {
  const response = await fetch(`/api/media/${id}/favorite`, {
    method: 'PATCH',
    credentials: 'include'
  })
  if (!response.ok) throw new Error('Failed to toggle favorite')
  return response.json()
}

export async function fetchTags(): Promise<string[]> {
  const response = await fetch(`/api/media/tags`, {
    credentials: 'include'
  })
  if (!response.ok) throw new Error('Failed to fetch tags')
  return response.json()
}

export async function fetchEvents(): Promise<string[]> {
  const response = await fetch(`/api/media/events`, {
    credentials: 'include'
  })
  if (!response.ok) throw new Error('Failed to fetch events')
  return response.json()
}

export async function fetchAgeGroups(): Promise<AgeGroupCount[]> {
  const response = await fetch(`/api/media/age-groups`, {
    credentials: 'include'
  })
  if (!response.ok) throw new Error('Failed to fetch age groups')
  return response.json()
}
