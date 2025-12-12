'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

type BlogPost = {
  id: number
  title: string
  slug: string
  headerImage: string | null
  excerpt: string | null
  author: string | null
  published: boolean
  publishedAt: number | null
  createdAt: number
}

export default function BlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const togglePublished = async (id: number, published: boolean) => {
    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          published: !published,
          publishedAt: !published ? new Date().getTime() / 1000 : null
        }),
      })
      fetchPosts()
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline">← Back</Button>
            </Link>
            <h1 className="text-2xl font-bold">Press Releases</h1>
          </div>
          <Link href="/admin/blog/new">
            <Button>Add New Release</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div>Loading posts...</div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No press releases found. Add your first release!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{post.title}</span>
                    <div className="flex gap-2">
                      <Button
                        variant={post.published ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => togglePublished(post.id, post.published)}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </Button>
                      <Link href={`/admin/blog/${post.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {post.headerImage && (
                      <div className="relative h-48 bg-gray-100 rounded">
                        <Image
                          src={post.headerImage}
                          alt={post.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="space-y-2 text-sm">
                      {post.excerpt && (
                        <p className="text-gray-600">{post.excerpt}</p>
                      )}
                      {post.author && (
                        <p>
                          <strong>Author:</strong> {post.author}
                        </p>
                      )}
                      <p>
                        <strong>Slug:</strong> {post.slug}
                      </p>
                      {post.publishedAt && (
                        <p>
                          <strong>Published:</strong>{' '}
                          {new Date(post.publishedAt * 1000).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

