'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { blogPostSchema } from '@/lib/validation'
import { ZodError } from 'zod'

interface BlogPost {
  id: string
  title: string
  titleAr?: string
  slug: string
  content: string
  contentAr?: string
  excerpt: string
  excerptAr?: string
  tags: string[]
  tagsAr: string[]
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    slug: '',
    excerpt: '',
    excerptAr: '',
    content: '',
    contentAr: '',
    tags: '',
    tagsAr: '',
    published: false,
    featured: false
  })

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('adminAuth')
    if (auth !== 'true') {
      window.location.href = '/admin'
      return
    }
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog')
      const data = await response.json()
      // Ensure data is an array
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    try {
      // Validate form data
      const validatedData = blogPostSchema.parse(formData)
      
      const postData = {
        ...validatedData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        tagsAr: formData.tagsAr.split(',').map(t => t.trim()).filter(Boolean)
      }
      
      const method = editingPost ? 'PUT' : 'POST'
      const url = editingPost ? `/api/blog?id=${editingPost.id}` : '/api/blog'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })
      
      if (response.ok) {
        fetchPosts()
        setShowForm(false)
        setEditingPost(null)
        setErrors({})
        setFormData({
          title: '',
          titleAr: '',
          slug: '',
          excerpt: '',
          excerptAr: '',
          content: '',
          contentAr: '',
          tags: '',
          tagsAr: '',
          published: false,
          featured: false
        })
      } else {
        const error = await response.json()
        alert(`Failed to save: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        console.error('Failed to save post:', error)
        alert('Failed to save post. Please try again.')
      }
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      titleAr: post.titleAr || '',
      slug: post.slug,
      excerpt: post.excerpt,
      excerptAr: post.excerptAr || '',
      content: post.content,
      contentAr: post.contentAr || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      tagsAr: Array.isArray(post.tagsAr) ? post.tagsAr.join(', ') : '',
      published: post.published,
      featured: post.featured
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const response = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <div className="flex gap-4 text-sm">
              <Link href="/admin" className="text-gray-400 hover:text-white">← Dashboard</Link>
              <Link href="/admin/services" className="text-gray-400 hover:text-white">Services</Link>
              <Link href="/admin/projects" className="text-gray-400 hover:text-white">Projects</Link>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingPost(null)
              setFormData({
                title: '',
                titleAr: '',
                slug: '',
                excerpt: '',
                excerptAr: '',
                content: '',
                contentAr: '',
                tags: '',
                tagsAr: '',
                published: false,
                featured: false
              })
              setShowForm(true)
            }}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
          >
            + New Post
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* English Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">English Content</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Title (English) *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        })
                        if (errors.title) setErrors({ ...errors, title: '' })
                      }}
                      className={`w-full p-3 bg-gray-800 rounded ${errors.title ? 'border border-red-500' : ''}`}
                      required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  
                  <div>
                    <label className="block mb-2">Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData({ ...formData, slug: e.target.value })
                        if (errors.slug) setErrors({ ...errors, slug: '' })
                      }}
                      className={`w-full p-3 bg-gray-800 rounded ${errors.slug ? 'border border-red-500' : ''}`}
                      required
                    />
                    {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2">Excerpt (English) *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded"
                    rows={2}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Content (English - Markdown supported) *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded font-mono text-sm"
                    rows={10}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Tags (English - comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded"
                    placeholder="technology, web development, react"
                  />
                </div>
              </div>
              
              {/* Arabic Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Arabic Content</h3>
                
                <div>
                  <label className="block mb-2">Title (Arabic)</label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded text-right"
                    dir="rtl"
                    placeholder="العنوان بالعربية"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Excerpt (Arabic)</label>
                  <textarea
                    value={formData.excerptAr}
                    onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded text-right"
                    dir="rtl"
                    rows={2}
                    placeholder="المقتطف بالعربية"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Content (Arabic - Markdown supported)</label>
                  <textarea
                    value={formData.contentAr}
                    onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded font-mono text-sm text-right"
                    dir="rtl"
                    rows={10}
                    placeholder="المحتوى بالعربية"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Tags (Arabic - comma separated)</label>
                  <input
                    type="text"
                    value={formData.tagsAr}
                    onChange={(e) => setFormData({ ...formData, tagsAr: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded text-right"
                    dir="rtl"
                    placeholder="تقنية، تطوير الويب، رياكت"
                  />
                </div>
              </div>
              
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Published
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Featured
                </label>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                >
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingPost(null)
                  }}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No blog posts yet. Create your first post!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-gray-900 p-6 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      {post.published && (
                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs">Published</span>
                      )}
                      {post.featured && (
                        <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded text-xs">Featured</span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-2">/{post.slug}</p>
                    <p className="text-gray-300">{post.excerpt}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-400 hover:text-blue-300 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
