'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {format} from 'date-fns'
import {ar, enUS} from 'date-fns/locale'
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
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const locale = useLocale()
  const t = useTranslations()
  const isArabic = locale === 'ar'

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        if (!response.ok) {
          throw new Error('Failed to fetch')
        }
        const data = await response.json()
        setPosts(data)
      } catch {
        setError(isArabic ? 'فشل تحميل المقالات' : 'Failed to fetch blog posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [isArabic])

  const dateLocale = isArabic ? ar : enUS

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">
          {isArabic ? 'جاري تحميل المقالات...' : 'Loading blog posts...'}
        </div>
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
            <Link href={`/${locale}`} className="text-gray-400 hover:text-white transition-colors mb-4 inline-block">
              {isArabic ? '← العودة إلى الصفحة الرئيسية' : '← Back to Portfolio'}
            </Link>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
              {t('nav.blog')}
            </h1>
            <p className="text-xl text-gray-400">
              {isArabic
                ? 'أفكار حول الهندسة، تصميم الأنظمة، والبناء من المبادئ الأولى.'
                : 'Thoughts on engineering, systems design, and building from first principles.'}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <p className="text-xl">
                {isArabic ? 'لا توجد مقالات منشورة بعد.' : 'No blog posts published yet.'}
              </p>
              <p className="mt-4">
                {isArabic
                  ? 'تحقق لاحقاً للحصول على رؤى حول هندسة الأنظمة والبرمجة الإبداعية.'
                  : 'Check back soon for insights on systems engineering and creative coding.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => {
                const postTitle = isArabic && post.titleAr ? post.titleAr : post.title
                const postExcerpt = isArabic && post.excerptAr ? post.excerptAr : post.excerpt

                return (
                  <article key={post.id} className="bg-gray-900/50 p-8 rounded-lg border border-white/10">
                    <div className="mb-4">
                      <h2 className="text-3xl font-bold mb-2">
                        <Link
                          href={`/${locale}/blog/${post.slug}`}
                          className="hover:text-gray-300 transition-colors"
                        >
                          {postTitle}
                        </Link>
                      </h2>
                      <div className="text-sm text-gray-400 space-x-4 rtl:space-x-reverse">
                        <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy', {locale: dateLocale})}</span>
                        <span>•</span>
                        <span>{isArabic ? 'بواسطة' : 'By'} {post.author}</span>
                        {post.featured && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-400">★ {isArabic ? 'مميز' : 'Featured'}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg mb-4">{postExcerpt}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
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
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                    >
                      {isArabic ? 'اقرأ المزيد ←' : 'Read more →'}
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}