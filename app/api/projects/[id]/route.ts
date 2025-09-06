import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Parse JSON strings back to arrays for client
    const parsedProject = {
      ...project,
      tech: project.tech ? JSON.parse(project.tech) : [],
      techAr: project.techAr ? JSON.parse(project.techAr) : []
    }
    
    return NextResponse.json(parsedProject)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Convert arrays to JSON strings for SQLite storage
    const projectData = {
      ...body,
      tech: Array.isArray(body.tech) ? JSON.stringify(body.tech) : '[]',
      techAr: Array.isArray(body.techAr) ? JSON.stringify(body.techAr) : '[]'
    }
    
    const project = await prisma.project.update({
      where: { id: params.id },
      data: projectData
    })
    
    // Parse JSON strings back to arrays for response
    const parsedProject = {
      ...project,
      tech: project.tech ? JSON.parse(project.tech) : [],
      techAr: project.techAr ? JSON.parse(project.techAr) : []
    }
    
    return NextResponse.json(parsedProject)
  } catch (error) {
    console.error('Failed to update project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.project.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
