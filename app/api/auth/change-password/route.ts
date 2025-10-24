import {NextResponse} from 'next/server'
import {hashPassword, establishSession, getSession} from '@/lib/auth'
import {prisma} from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session.authenticated) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const {newPassword} = await request.json()

    if (typeof newPassword !== 'string' || newPassword.trim().length < 8) {
      return NextResponse.json({error: 'Password must be at least 8 characters'}, {status: 400})
    }

    const {hash, salt} = hashPassword(newPassword.trim())

    await prisma.user.update({
      where: {id: session.user.id},
      data: {
        passwordHash: hash,
        passwordSalt: salt,
        mustChangePassword: false
      }
    })

    // Refresh session token
    establishSession(session.user.id)

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Failed to change password:', error)
    return NextResponse.json({error: 'Unable to change password'}, {status: 500})
  }
}
