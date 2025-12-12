'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MarkdownEditor } from '@/components/markdown-editor'
import Link from 'next/link'

type PressRelease = {
  id: number
  title: string
  slug: string
  headerImage: string | null
  excerpt: string | null
  content: string
  author: string | null
  published: boolean
  publishedAt: number | null
}

export default function EditPressReleasePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<PressRelease | null>(null)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const res = await fetch('/api/admin/press')
      const data = await res.json()
      const post = data.posts.find((p: PressRelease) => p.id === parseInt(id))
      if (post) {
        setFormData(post)
      }
    } catch (error) {
      console.error('Error fetching press release:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)

    try {
      const res = await fetch(`/api/admin/press/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.published && !formData.publishedAt 
            ? new Date().getTime() / 1000 
            : formData.publishedAt,
        }),
      })

      if (res.ok) {
        router.push('/admin/press')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update press release')
      }
    } catch (error) {
      console.error('Error updating press release:', error)
      alert('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Post not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/press">
              <Button variant="outline">← Back</Button>
            </Link>
            <h1 className="text-2xl font-bold">Edit Press Release</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="headerImage">Header Image URL</Label>
            <Input
              id="headerImage"
              type="url"
              value={formData.headerImage || ''}
              onChange={(e) => setFormData({ ...formData, headerImage: e.target.value })}
              placeholder="/images/press-header.jpg"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your press release content here..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Use the toolbar buttons or markdown syntax to format your content. The content supports markdown formatting.
            </p>
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author || ''}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="published">Published</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href="/admin/press">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

