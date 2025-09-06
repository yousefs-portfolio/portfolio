import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    })
    
    // Parse JSON strings back to arrays for client
    const parsedServices = services.map(service => {
      let features = []
      let featuresAr = []
      
      try {
        if (service.features && service.features !== '') {
          features = typeof service.features === 'string' ? JSON.parse(service.features) : service.features
        }
      } catch (e) {
        console.error('Failed to parse features:', e)
        features = []
      }
      
      try {
        if (service.featuresAr && service.featuresAr !== '') {
          featuresAr = typeof service.featuresAr === 'string' ? JSON.parse(service.featuresAr) : service.featuresAr
        }
      } catch (e) {
        console.error('Failed to parse featuresAr:', e)
        featuresAr = []
      }
      
      return {
        ...service,
        features,
        featuresAr
      }
    })
    
    return NextResponse.json(parsedServices)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Convert arrays to JSON strings for SQLite storage
    const serviceData = {
      ...body,
      features: Array.isArray(body.features) ? JSON.stringify(body.features) : '[]',
      featuresAr: Array.isArray(body.featuresAr) ? JSON.stringify(body.featuresAr) : '[]',
      titleAr: body.titleAr || '',
      descriptionAr: body.descriptionAr || ''
    }
    
    const service = await prisma.service.create({
      data: serviceData
    })
    
    // Parse JSON strings back to arrays for response
    const parsedService = {
      ...service,
      features: service.features ? JSON.parse(service.features) : [],
      featuresAr: service.featuresAr ? JSON.parse(service.featuresAr) : []
    }
    
    return NextResponse.json(parsedService, { status: 201 })
  } catch (error) {
    console.error('Failed to create service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
