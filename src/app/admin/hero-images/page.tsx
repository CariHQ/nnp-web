'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// Session check removed - handled by middleware
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

type HeroImage = {
  id: number
  title: string
  imageUrl: string
  caption: string | null
  link: string | null
  order: number
  active: boolean
}

export default function HeroImagesPage() {
  const router = useRouter()
  const [images, setImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/hero-images')
      const data = await res.json()
      setImages(data.images || [])
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      await fetch(`/api/admin/hero-images/${id}`, {
        method: 'DELETE',
      })
      fetchImages()
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const toggleActive = async (id: number, active: boolean) => {
    try {
      await fetch(`/api/admin/hero-images/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      })
      fetchImages()
    } catch (error) {
      console.error('Error toggling image:', error)
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
            <h1 className="text-2xl font-bold">Hero Images</h1>
          </div>
          <Link href="/admin/hero-images/new">
            <Button>Add New Image</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div>Loading images...</div>
        ) : images.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No hero images found. Add your first image!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {images.map((image) => (
              <Card key={image.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{image.title}</span>
                    <div className="flex gap-2">
                      <Button
                        variant={image.active ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleActive(image.id, image.active)}
                      >
                        {image.active ? 'Active' : 'Inactive'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(image.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative h-48 bg-gray-100 rounded">
                      <Image
                        src={image.imageUrl}
                        alt={image.title}
                        fill
                        className="object-cover rounded"
                        onError={(e) => {
                          console.error('Image failed to load:', image.imageUrl)
                          e.currentTarget.src = '/placeholder.jpg'
                        }}
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      {image.caption && (
                        <p>
                          <strong>Caption:</strong> {image.caption}
                        </p>
                      )}
                      {image.link && (
                        <p>
                          <strong>Link:</strong> {image.link}
                        </p>
                      )}
                      <p>
                        <strong>Order:</strong> {image.order}
                      </p>
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
