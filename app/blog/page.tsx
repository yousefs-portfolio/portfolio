'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  published: boolean
  featured: boolean
  slug: string
  createdAt: string
  updatedAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        const data = await response.json()
        setPosts(data.filter((post: BlogPost) => post.published))
      } catch (error) {
        setError('Failed to fetch blog posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading blog posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors mb-4 inline-block">
              ← Back to Portfolio
            </Link>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Blog</h1>
            <p className="text-xl text-gray-400">
              Thoughts on engineering, systems design, and building from first principles.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <p className="text-xl">No blog posts published yet.</p>
              <p className="mt-4">Check back soon for insights on systems engineering and creative coding.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-gray-900/50 p-8 rounded-lg border border-white/10">
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold mb-2">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="hover:text-gray-300 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <div className="text-sm text-gray-400">
                      {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg mb-4">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
