import {NextRequest, NextResponse} from 'next/server'
import config from '../../../keystatic.config'

export const runtime = 'nodejs'

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const mod = await import('@keystatic/core/reader')
    type PostItem = {
      slug: string;
      entry: {
        title?: string | { name?: string }
        titleAr?: string
        excerpt?: string
        excerptAr?: string
        publishedAt?: string
        featured?: boolean
        author?: string
        tags?: string[]
        content?: any
        contentAr?: any
      }
    }

    const {createReader}: {
      createReader: (cwd: string, cfg: unknown) => {
        collections: {
          posts: {
            all: () => Promise<PostItem[]>
            read: (slug: string) => Promise<PostItem['entry'] | null>
          }
        }
      }
    } = mod as any

    const reader = createReader(process.cwd(), config)
    const items = await reader.collections.posts.all()

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const tag = searchParams.get('tag')

    type PostDto = {
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

    let posts: PostDto[] = items
      .map((item) => {
        const e = item.entry || {}
        const rawTitle = typeof e.title === 'string' ? e.title : e.title?.name
        const title = rawTitle ?? item.slug
        const excerpt = e.excerpt ?? ''
        const excerptAr = e.excerptAr ?? undefined
        // Ensure ISO 8601 format for dates
        const rawDate = e.publishedAt ?? new Date().toISOString()
        const publishedAt = rawDate.includes('T') ? rawDate : `${rawDate}T00:00:00Z`
        const featured = Boolean(e.featured ?? false)
        const author = e.author ?? 'Yousef Baitalmal'
        const tags = Array.isArray(e.tags) ? e.tags : []

        return {
          id: item.slug,
          slug: item.slug,
          title,
          titleAr: e.titleAr,
          excerpt,
          excerptAr,
          publishedAt,
          featured,
          author,
          tags,
        }
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    // Apply filters
    if (featured === 'true') {
      posts = posts.filter(post => post.featured)
    }

    if (tag) {
      posts = posts.filter(post => post.tags.includes(tag))
    }

    if (limit) {
      const limitNum = parseInt(limit)
      if (!isNaN(limitNum)) {
        posts = posts.slice(0, limitNum)
      }
    }

    return NextResponse.json(posts, {status: 200})
  } catch (error) {
    console.error('Error reading blog posts from Keystatic:', error)
    return NextResponse.json({error: 'Failed to load blog posts'}, {status: 500})
  }
}