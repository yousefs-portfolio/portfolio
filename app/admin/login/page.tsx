import {redirect} from 'next/navigation'
import AdminLoginForm from '@/components/AdminLoginForm'
import {getAdminServerSession} from '@adapters/auth/session'

export const runtime = 'nodejs'

export default async function AdminLoginPage() {
  const session = await getAdminServerSession()

  if (session?.user?.isAdmin) {
    redirect('/keystatic')
  }

  return <AdminLoginForm />
}
