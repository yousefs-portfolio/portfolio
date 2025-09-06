import { NextResponse } from 'next/server'
import config from '../../../keystatic.config'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const { createReader } = await import('@keystatic/core/reader') as any
    const reader = createReader(process.cwd(), config)

    const items = await reader.collections.services.all()

    const services = items
      .map((item: any) => {
        const e = item.entry || {}
        return {
          id: item.slug,
          title: e.title?.name ?? e.title ?? item.slug,
          description: typeof e.description === 'string' ? e.description : '',
          featured: Boolean(e.featured ?? true),
          order: Number(e.order ?? 0),
        }
      })
      .sort((a: any, b: any) => a.order - b.order)

    return NextResponse.json(services, { status: 200 })
  } catch (error: any) {
    console.error('Error reading services from Keystatic:', error)
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 })
  }
}
