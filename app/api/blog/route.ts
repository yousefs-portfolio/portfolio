import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    // Parse JSON strings back to arrays for client
    const parsedPosts = posts.map(post => {
      let tags = []
      let tagsAr = []
      
      try {
        if (post.tags) {
          if (typeof post.tags === 'string' && post.tags.trim() !== '') {
            tags = JSON.parse(post.tags)
          } else if (Array.isArray(post.tags)) {
            tags = post.tags
          }
        }
      } catch (e) {
        console.error('Failed to parse tags:', e)
        tags = []
      }
      
      try {
        if (post.tagsAr) {
          if (typeof post.tagsAr === 'string' && post.tagsAr.trim() !== '') {
            tagsAr = JSON.parse(post.tagsAr)
          } else if (Array.isArray(post.tagsAr)) {
            tagsAr = post.tagsAr
          }
        }
      } catch (e) {
        console.error('Failed to parse tagsAr:', e)
        tagsAr = []
      }
      
      return {
        ...post,
        tags,
        tagsAr
      }
    })
    
    return NextResponse.json(parsedPosts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate slug from title if not provided
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    // Convert arrays to JSON strings for SQLite storage
    const postData = {
      ...body,
      slug,
      tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : '[]',
      tagsAr: Array.isArray(body.tagsAr) ? JSON.stringify(body.tagsAr) : '[]',
      titleAr: body.titleAr || '',
      contentAr: body.contentAr || '',
      excerptAr: body.excerptAr || '',
      excerpt: body.excerpt || body.content.substring(0, 150)
    }
    
    const post = await prisma.blogPost.create({
      data: postData
    })
    
    // Parse JSON strings back to arrays for response
    const parsedPost = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      tagsAr: post.tagsAr ? JSON.parse(post.tagsAr) : []
    }
    
    return NextResponse.json(parsedPost, { status: 201 })
  } catch (error) {
    console.error('Failed to create blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }
    
    const body = await request.json()
    
    // Convert arrays to JSON strings for SQLite storage
    const postData = {
      ...body,
      tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : '[]',
      tagsAr: Array.isArray(body.tagsAr) ? JSON.stringify(body.tagsAr) : '[]'
    }
    
    const post = await prisma.blogPost.update({
      where: { id },
      data: postData
    })
    
    // Parse JSON strings back to arrays for response
    const parsedPost = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      tagsAr: post.tagsAr ? JSON.parse(post.tagsAr) : []
    }
    
    return NextResponse.json(parsedPost)
  } catch (error) {
    console.error('Failed to update blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }
    
    await prisma.blogPost.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
