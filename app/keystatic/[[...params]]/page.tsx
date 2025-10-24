import { redirect } from 'next/navigation'

import { makePage } from '@keystatic/next/ui/app'
import config from '@/keystatic/keystatic.config'
import AdminChangePasswordForm from '@/components/AdminChangePasswordForm'
import { getAdminServerSession } from '@adapters/auth/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const KeystaticApp = makePage(config)

type KeystaticPageProps = {
  params: {
    params?: string[]
  }
}

export default async function KeystaticPage({ params }: KeystaticPageProps) {
  const session = await getAdminServerSession()

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

  return <KeystaticApp params={params.params ?? []} />
}
