import {NextResponse} from 'next/server'
import config from '../../../../keystatic.config'

export const runtime = 'nodejs'

// GET all unique tags from blog posts
export async function GET() {
  try {
    const mod = await import('@keystatic/core/reader')
    const {createReader} = mod as any

    const reader = createReader(process.cwd(), config)
    const items = await reader.collections.posts.all()

    // Collect all unique tags
    const tagsSet = new Set<string>()

    items.forEach((item: any) => {
      const tags = item.entry?.tags
      if (Array.isArray(tags)) {
        tags.forEach(tag => tagsSet.add(tag))
      }
    })

    const tags = Array.from(tagsSet).sort()

    return NextResponse.json(tags, {status: 200})
  } catch (error) {
    console.error('Error reading tags from Keystatic:', error)
    return NextResponse.json({error: 'Failed to load tags'}, {status: 500})
  }
}