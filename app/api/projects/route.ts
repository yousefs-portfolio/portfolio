import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' }
    })
    
    // Parse JSON strings back to arrays for client
    const parsedProjects = projects.map(project => {
      let tech = []
      let techAr = []
      
      try {
        if (project.tech && project.tech !== '') {
          tech = typeof project.tech === 'string' ? JSON.parse(project.tech) : project.tech
        }
      } catch (e) {
        console.error('Failed to parse tech:', e)
        tech = []
      }
      
      try {
        if (project.techAr && project.techAr !== '') {
          techAr = typeof project.techAr === 'string' ? JSON.parse(project.techAr) : project.techAr
        }
      } catch (e) {
        console.error('Failed to parse techAr:', e)
        techAr = []
      }
      
      return {
        ...project,
        tech,
        techAr
      }
    })
    
    return NextResponse.json(parsedProjects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Convert arrays to JSON strings for SQLite storage
    const projectData = {
      ...body,
      tech: Array.isArray(body.tech) ? JSON.stringify(body.tech) : '[]',
      techAr: Array.isArray(body.techAr) ? JSON.stringify(body.techAr) : '[]',
      titleAr: body.titleAr || '',
      descriptionAr: body.descriptionAr || '',
      contentAr: body.contentAr || '',
      layerNameAr: body.layerNameAr || ''
    }
    
    const project = await prisma.project.create({
      data: projectData
    })
    
    // Parse JSON strings back to arrays for response
    const parsedProject = {
      ...project,
      tech: project.tech ? JSON.parse(project.tech) : [],
      techAr: project.techAr ? JSON.parse(project.techAr) : []
    }
    
    return NextResponse.json(parsedProject, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
