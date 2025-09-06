import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id }
    })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    // Parse JSON strings back to arrays for client
    const parsedService = {
      ...service,
      features: service.features ? JSON.parse(service.features) : [],
      featuresAr: service.featuresAr ? JSON.parse(service.featuresAr) : []
    }
    
    return NextResponse.json(parsedService)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Convert arrays to JSON strings for SQLite storage
    const serviceData = {
      ...body,
      features: Array.isArray(body.features) ? JSON.stringify(body.features) : '[]',
      featuresAr: Array.isArray(body.featuresAr) ? JSON.stringify(body.featuresAr) : '[]'
    }
    
    const service = await prisma.service.update({
      where: { id: params.id },
      data: serviceData
    })
    
    // Parse JSON strings back to arrays for response
    const parsedService = {
      ...service,
      features: service.features ? JSON.parse(service.features) : [],
      featuresAr: service.featuresAr ? JSON.parse(service.featuresAr) : []
    }
    
    return NextResponse.json(parsedService)
  } catch (error) {
    console.error('Failed to update service:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.service.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}
