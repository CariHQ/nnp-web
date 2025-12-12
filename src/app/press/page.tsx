import { db } from '@/lib/db'
import { blogPosts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

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
      // Handle both Date objects and Unix timestamps (numbers)
      const aTimestamp = aDate instanceof Date ? aDate.getTime() : (aDate || 0) * 1000
      const bTimestamp = bDate instanceof Date ? bDate.getTime() : (bDate || 0) * 1000
      return bTimestamp - aTimestamp
    })
  } catch (error) {
    console.error('Error fetching press releases:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    // Return empty array if query fails
    posts = []
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden -mt-24">
        <Image
          src="/hero/grenada-landscape.jpg"
          alt="Press Releases"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Press</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No press releases yet. Check back soon!</p>
            <p className="text-xs text-gray-400 mt-2">Debug: Found {posts.length} posts</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/press/${post.slug}`}
                className="group block"
              >
                <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex flex-col md:flex-row">
                    {post.headerImage && (
                      <div className="relative h-40 md:h-auto md:w-48 flex-shrink-0">
                        <Image
                          src={post.headerImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col min-w-0">
                      <h2 className="text-base font-medium mb-1.5 text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <div className="text-gray-600 text-xs mb-3 line-clamp-2 flex-grow leading-relaxed">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <span className="inline">{children}</span>,
                              strong: ({ children }) => <strong className="font-medium text-gray-700">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                            }}
                          >
                            {post.excerpt.replace(/\*\*/g, '').replace(/\n/g, ' ').trim()}
                          </ReactMarkdown>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-2">
                        {post.author && <span className="truncate">{post.author}</span>}
                        {(post.publishedAt || post.createdAt) && (
                          <span className="ml-2 flex-shrink-0">
                            {(() => {
                              const dateValue = post.publishedAt || post.createdAt
                              if (!dateValue) return null
                              const timestamp = dateValue instanceof Date ? dateValue.getTime() : dateValue * 1000
                              return new Date(timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            })()}
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

