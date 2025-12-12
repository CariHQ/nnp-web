'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

// Required for static export
export function generateStaticParams() {
  return []
}

export default function EditPageContent() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    page: '',
    section: '',
    title: '',
    content: '{}',
    order: 0,
    active: true,
  })

  useEffect(() => {
    fetchContent()
  }, [id])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/pages')
      const data = await res.json()
      const item = data.content.find((c: any) => c.id === parseInt(id))
      if (item) {
        setFormData({
          page: item.page,
          section: item.section,
          title: item.title || '',
          content: JSON.stringify(item.content, null, 2),
          order: item.order,
          active: item.active,
        })
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content: JSON.parse(formData.content),
        }),
      })

      if (res.ok) {
        router.push('/admin/pages')
      } else {
        alert('Failed to update content')
      }
    } catch (error) {
      console.error('Error updating content:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/pages">
              <Button variant="outline">← Back</Button>
            </Link>
            <h1 className="text-2xl font-bold">Edit Page Content</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="page">Page</Label>
                <Input
                  id="page"
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (JSON)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={15}
                  className="font-mono text-xs"
                  required
                />
                <p className="text-sm text-gray-500">
                  Edit the JSON content. Make sure it's valid JSON format.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Content'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

