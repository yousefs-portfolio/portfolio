import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth'
import {makePage} from '@keystatic/next/ui/app'

import config from '@/keystatic/keystatic.config'
import AdminChangePasswordForm from '@/components/AdminChangePasswordForm'
import {authOptions} from '@adapters/auth/nextauth'

const KeystaticApp = makePage(config)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type AdminPageProps = {
  params: {
    params?: string[]
  }
}

export default async function AdminPage({params}: AdminPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    redirect('/admin/login')
  }

  if (session.user.mustChangePassword) {
    return (
      <AdminChangePasswordForm
        username={session.user.username ?? session.user.email ?? 'admin'}
      />
    )
  }

  const keystaticParams = { params: params.params ?? [] }
  return <KeystaticApp params={keystaticParams} />
}
