import { db } from '@/lib/db'
import { blogPosts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import Image from 'next/image'

export default async function PressPage() {
  let posts = []
  
  try {
    // Fetch all published posts, then sort in JavaScript to handle nulls
    const allPosts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
    
    // Sort by publishedAt desc, fallback to createdAt if publishedAt is null
    posts = allPosts.sort((a, b) => {
      const aDate = a.publishedAt || a.createdAt
      const bDate = b.publishedAt || b.createdAt
      return (bDate || 0) - (aDate || 0)
    })
  } catch (error) {
    console.error('Error fetching press releases:', error)
    // Return empty array if query fails
    posts = []
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Press</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No press releases yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/press/${post.slug}`}
                className="group block"
              >
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {post.headerImage && (
                      <div className="relative h-64 md:h-auto md:w-80 flex-shrink-0">
                        <Image
                          src={post.headerImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1">
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        {post.author && <span>By {post.author}</span>}
                        {post.publishedAt && (
                          <span>
                            {new Date(post.publishedAt * 1000).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

