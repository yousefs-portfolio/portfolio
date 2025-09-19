'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import Link from 'next/link'
import {format} from 'date-fns'
import {ar, enUS} from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {useLocale, useTranslations} from 'next-intl'

interface BlogPost {
  id: string
  slug: string
  title: string
  titleAr?: string
  excerpt: string
  excerptAr?: string
  publishedAt: string
  featured: boolean
  author: string
  tags: string[]
  content?: string
  contentAr?: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const locale = useLocale()
  const t = useTranslations()
  const isArabic = locale === 'ar'

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(isArabic ? 'المقال غير موجود' : 'Blog post not found')
          }
          throw new Error(isArabic ? 'فشل تحميل المقال' : 'Failed to fetch blog post')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err instanceof Error ? err.message : 'Failed to load blog post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug, isArabic])

  const dateLocale = isArabic ? ar : enUS

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">
          {isArabic ? 'جاري تحميل المقال...' : 'Loading post...'}
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">{error || 'Post not found'}</h1>
          <Link href={`/${locale}/blog`} className="text-blue-400 hover:text-blue-300 transition-colors">
            {isArabic ? '← العودة إلى المدونة' : '← Back to Blog'}
          </Link>
        </div>
      </div>
    )
  }

  // Get the appropriate content based on locale
  const postTitle = isArabic && post.titleAr ? post.titleAr : post.title
  const postContent = isArabic && post.contentAr ? post.contentAr : post.content

  // Convert Markdoc content to markdown string if needed
  const contentString = typeof postContent === 'string'
    ? postContent
    : postContent?.children?.[0]?.children || ''

  return (
    <div className="min-h-screen bg-black text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-16">
        <article className="max-w-4xl mx-auto">
          {/* Back to Blog Link */}
          <Link
            href={`/${locale}/blog`}
            className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
          >
            {isArabic ? '← العودة إلى المدونة' : '← Back to Blog'}
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              {postTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
              <time dateTime={post.publishedAt}>
                {format(new Date(post.publishedAt), 'MMMM d, yyyy', {locale: dateLocale})}
              </time>
              <span>•</span>
              <span>{isArabic ? 'بواسطة' : 'By'} {post.author}</span>
              {post.featured && (
                <>
                  <span>•</span>
                  <span className="text-yellow-400">★ {isArabic ? 'مميز' : 'Featured'}</span>
                </>
              )}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className={`prose prose-invert prose-lg max-w-none ${isArabic ? 'prose-ar' : ''}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom components for better styling
                h1: ({children}) => <h1 className="text-4xl font-bold mb-6 mt-10">{children}</h1>,
                h2: ({children}) => <h2 className="text-3xl font-bold mb-4 mt-8">{children}</h2>,
                h3: ({children}) => <h3 className="text-2xl font-bold mb-3 mt-6">{children}</h3>,
                h4: ({children}) => <h4 className="text-xl font-bold mb-2 mt-4">{children}</h4>,
                p: ({children}) => <p className="mb-4 text-gray-300 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul
                  className={`list-disc ${isArabic ? 'list-inside' : 'list-inside'} mb-4 text-gray-300`}>{children}</ul>,
                ol: ({children}) => <ol
                  className={`list-decimal ${isArabic ? 'list-inside' : 'list-inside'} mb-4 text-gray-300`}>{children}</ol>,
                li: ({children}) => <li className="mb-2">{children}</li>,
                blockquote: ({children}) => (
                  <blockquote
                    className={`border-${isArabic ? 'r' : 'l'}-4 border-gray-600 ${isArabic ? 'pr-4' : 'pl-4'} italic text-gray-400 mb-4`}>
                    {children}
                  </blockquote>
                ),
                code: ({className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !match

                  return isInline ? (
                    <code className="bg-gray-800 px-2 py-1 rounded text-sm text-gray-300" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code
                      className="block bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 mb-4" {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({children}) => <>{children}</>,
                a: ({href, children}) => (
                  <a
                    href={href}
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="border-gray-700 my-8"/>,
                strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                em: ({children}) => <em className="italic">{children}</em>,
              }}
            >
              {contentString}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <Link
                href={`/${locale}/blog`}
                className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
              >
                {isArabic ? '← جميع المقالات' : '← All Posts'}
              </Link>

              <div className="text-gray-400 text-sm">
                {isArabic ? 'نُشر في' : 'Published'} {format(new Date(post.publishedAt), 'MMMM d, yyyy', {locale: dateLocale})}
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}