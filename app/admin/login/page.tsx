import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth'
import AdminLoginForm from '@/components/AdminLoginForm'
import {authOptions} from '@adapters/auth/nextauth'

export const runtime = 'nodejs'

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.isAdmin) {
    redirect('/admin')
  }

  return <AdminLoginForm />
}
