'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  displayOrder: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const categoryIcons: Record<string, string> = {
    'אוכל': '🍽️', 'תחבורה': '🚌', 'בילויים': '🎉', 'קניות': '🛍️',
    'חשבונות': '📄', 'בריאות': '💊', 'לימודים': '📚', 'אחר': '📦'
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.categories) {
        setCategories(data.categories)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return

    setIsSaving(true)
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() })
      })

      if (res.ok) {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, name: editName.trim() } : c))
        setEditingId(null)
        setEditName('')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-dim)', marginTop: '100px' }}>טוען קטגוריות...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>ניהול קטגוריות</h1>
        <p style={{ color: 'var(--text-dim)', margin: '4px 0 0', fontSize: '0.9rem' }}>לחץ על קטגוריה לעריכה</p>
      </div>

      {/* Categories List */}
      <div className="glass-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: editingId === cat.id ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{categoryIcons[cat.name] || '📦'}</span>

              {editingId === cat.id ? (
                <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.95rem' }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(cat.id)
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                  />
                  <button
                    onClick={() => handleSaveEdit(cat.id)}
                    disabled={isSaving}
                    style={{
                      background: 'var(--income)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'var(--bg)',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    {isSaving ? '...' : 'שמור'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  >
                    ביטול
                  </button>
                </div>
              ) : (
                <>
                  <span style={{ flex: 1, fontSize: '1rem', fontWeight: 500 }}>{cat.name}</span>
                  <button
                    onClick={() => handleStartEdit(cat)}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'var(--accent)',
                      fontSize: '0.85rem'
                    }}
                  >
                    עריכה
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
        יש לך 8 קטגוריות קבועות.<br />
        ניתן לשנות את שמות הקטגוריות בלבד.
      </p>
    </div>
  )
}
