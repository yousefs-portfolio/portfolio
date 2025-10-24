import { NextResponse } from 'next/server'
import config from '../../../keystatic.config'

export const runtime = 'nodejs'

// Keystatic reader is only available server-side
// We import dynamically to avoid issues in edge-like environments
export async function GET() {
  try {
    const mod = await import('@keystatic/core/reader')
    type ProjectItem = { slug: string; entry: Record<string, unknown> }
    const { createReader }: { createReader: (cwd: string, cfg: unknown) => { collections: { projects: { all: () => Promise<ProjectItem[]> } } } } = mod as unknown as {
      createReader: (cwd: string, cfg: unknown) => { collections: { projects: { all: () => Promise<ProjectItem[]> } } }
    }

    const reader = createReader(process.cwd(), config)

    const items = await reader.collections.projects.all()

    type ProjectEntry = {
      title?: string | { name?: string }
      description?: string
      layer?: string
      layerName?: string
      category?: string
      featured?: boolean
      order?: number
    }

    type ProjectDto = {
      id: string
      title: string
      description: string
      layer: string
      layerName: string
      category: string
      content: string
      featured: boolean
      order: number
    }

    const projects: ProjectDto[] = (items as ProjectItem[])
      .map((item) => {
        const e = (item.entry || {}) as ProjectEntry
        const rawTitle = typeof e.title === 'string' ? e.title : e.title?.name
        const title = rawTitle ?? item.slug
        const description = typeof e.description === 'string' ? e.description : ''
        const layer = e.layer ?? 'LAYER 1'
        const layerName = e.layerName ?? ''
        const category = e.category ?? 'web'
        const featured = Boolean(e.featured ?? true)
        const order = Number(e.order ?? 0)
        return {
          id: `${item.slug}-project`,
          title,
          description,
          layer,
          layerName,
          category,
          content: '',
          featured,
          order,
        }
      })
      .sort((a, b) => a.order - b.order)

    return NextResponse.json(projects, { status: 200 })
  } catch (error) {
    console.error('Error reading projects from Keystatic:', error)
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 })
  }
}
