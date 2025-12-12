'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

type PageContent = {
  id: number
  page: string
  section: string
  title: string | null
  content: any
  order: number
  active: boolean
}

export default function PagesManagement() {
  const [content, setContent] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/pages')
      const data = await res.json()
      setContent(data.content || [])
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' })
      fetchContent()
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  const toggleActive = async (id: number, active: boolean) => {
    try {
      await fetch(`/api/admin/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      })
      fetchContent()
    } catch (error) {
      console.error('Error toggling content:', error)
    }
  }

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.page]) {
      acc[item.page] = []
    }
    acc[item.page].push(item)
    return acc
  }, {} as Record<string, PageContent[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline">← Back</Button>
            </Link>
            <h1 className="text-2xl font-bold">Page Content Management</h1>
          </div>
          <Link href="/admin/pages/new">
            <Button>Add New Content</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Tabs defaultValue={Object.keys(groupedContent)[0] || 'about'}>
            <TabsList>
              {Object.keys(groupedContent).map((page) => (
                <TabsTrigger key={page} value={page} className="capitalize">
                  {page}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(groupedContent).map(([page, items]) => (
              <TabsContent key={page} value={page}>
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span className="capitalize">
                            {item.section} {item.title && `- ${item.title}`}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant={item.active ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => toggleActive(item.id, item.active)}
                            >
                              {item.active ? 'Active' : 'Inactive'}
                            </Button>
                            <Link href={`/admin/pages/${item.id}`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          Order: {item.order} | Section: {item.section}
                        </p>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(item.content, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  )
}

