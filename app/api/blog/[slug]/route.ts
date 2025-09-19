import {NextRequest, NextResponse} from 'next/server'

export const runtime = 'nodejs'

// GET single blog post by slug
export async function GET(
  request: NextRequest,
  {params}: { params: Promise<{ slug: string }> }
) {
  try {
    const {slug} = await params

    // Read the markdown file directly
    const fs = await import('fs/promises')
    const path = await import('path')

    let title = ''
    let titleAr = ''
    let excerpt = ''
    let excerptAr = ''
    let publishedAt = ''
    let featured = false
    let author = 'Yousef Baitalmal'
    let tags: string[] = []
    let content = ''
    let contentAr = ''

    try {
      // Read the .mdoc file
      const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdoc`)
      const fileContent = await fs.readFile(filePath, 'utf-8')

      // Normalize line endings to Unix style
      const normalizedContent = fileContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

      // Parse front matter and content
      const frontMatterMatch = normalizedContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

      if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1]
        content = frontMatterMatch[2].trim()

        // Parse front matter fields
        const lines = frontMatter.split('\n')
        let inTags = false
        let inContentAr = false
        let contentArLines: string[] = []

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]

          // Handle contentAr multiline field
          if (line.trim() === 'contentAr: |') {
            inContentAr = true
            continue
          }

          if (inContentAr) {
            if (line.startsWith('  ')) {
              // Part of contentAr
              contentArLines.push(line.substring(2)) // Remove leading 2 spaces
              continue
            } else if (line.trim() && !line.startsWith(' ')) {
              // End of contentAr
              contentAr = contentArLines.join('\n').trim()
              inContentAr = false
            }
          }

          // Handle tags array specially
          if (line.trim() === 'tags:') {
            inTags = true
            continue
          }

          if (inTags) {
            if (line.startsWith('  - ') || line.startsWith('- ')) {
              const tag = line.replace(/^\s*-\s*/, '').trim()
              if (tag) tags.push(tag)
              continue
            } else if (line.trim() && !line.startsWith(' ')) {
              // End of tags array
              inTags = false
            } else if (!line.trim()) {
              // Empty line, continue
              continue
            }
          }

          if (!inTags && !inContentAr) {
            const colonIndex = line.indexOf(':')
            if (colonIndex === -1) continue

            const key = line.substring(0, colonIndex).trim()
            const value = line.substring(colonIndex + 1).trim()

            switch (key) {
              case 'title':
                title = value.replace(/^["']|["']$/g, '')
                break
              case 'titleAr':
                titleAr = value.replace(/^["']|["']$/g, '')
                break
              case 'excerpt':
                excerpt = value.replace(/^["']|["']$/g, '')
                break
              case 'excerptAr':
                excerptAr = value.replace(/^["']|["']$/g, '')
                break
              case 'publishedAt':
                const dateStr = value.replace(/^["']|["']$/g, '')
                // Ensure ISO 8601 format for dates
                publishedAt = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00Z`
                break
              case 'featured':
                featured = value === 'true'
                break
              case 'author':
                author = value.replace(/^["']|["']$/g, '')
                break
            }
          }
        }
      } else {
        // If no front matter, use the entire file as content
        console.error('No front matter found in file:', slug)
        content = normalizedContent
        title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }
    } catch (error) {
      console.error('Error reading blog post:', error)
      return NextResponse.json({error: 'Blog post not found'}, {status: 404})
    }

    const postDto = {
      id: slug,
      slug,
      title,
      titleAr,
      excerpt,
      excerptAr,
      publishedAt,
      featured,
      author,
      tags,
      content,
      contentAr,
    }

    return NextResponse.json(postDto, {status: 200})
  } catch (error) {
    console.error('Error in blog post API:', error)
    return NextResponse.json({error: 'Failed to load blog post'}, {status: 500})
  }
}