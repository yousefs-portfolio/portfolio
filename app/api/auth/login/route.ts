import {NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'
import {establishSession, verifyPassword} from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const {username, password} = await request.json()

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({error: 'Invalid request'}, {status: 400})
    }

    const user = await prisma.user.findUnique({
      where: {username},
      select: {
        id: true,
        isAdmin: true,
        passwordHash: true,
        passwordSalt: true,
        mustChangePassword: true
      }
    })

    if (!user || !user.isAdmin) {
      return NextResponse.json({error: 'Invalid credentials'}, {status: 401})
    }

    const valid = verifyPassword(password, user.passwordHash, user.passwordSalt)

    if (!valid) {
      return NextResponse.json({error: 'Invalid credentials'}, {status: 401})
    }

    establishSession(user.id)

    return NextResponse.json({
      success: true,
      mustChangePassword: user.mustChangePassword
    })
  } catch (error) {
    console.error('Login failed:', error)
    return NextResponse.json({error: 'Unable to login'}, {status: 500})
  }
}
