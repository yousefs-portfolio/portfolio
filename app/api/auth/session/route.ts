import {NextResponse} from 'next/server'
import {getSession} from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({authenticated: false})
  }
  return NextResponse.json({
    authenticated: true,
    mustChangePassword: session.user.mustChangePassword,
    username: session.user.username
  })
}
