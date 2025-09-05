import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, whatsapp, requirements } = body

    // Validate that at least email or whatsapp is provided
    if (!email && !whatsapp) {
      return NextResponse.json(
        { error: 'Either email or WhatsApp number is required' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email: email || null,
        whatsapp: whatsapp || null,
        requirements
      }
    })

    return NextResponse.json({ success: true, contact }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}
