import {makePage} from '@keystatic/next/ui/app'
import config from '../../../keystatic.config'
import {getSession} from '@/lib/auth'
import AdminAuthShell from '@/components/AdminAuthShell'

const KeystaticApp = makePage(config)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type AdminPageProps = {
  params: {
    params?: string[]
  }
}

export default async function AdminPage({params}: AdminPageProps) {
  const session = await getSession()

  if (!session.authenticated) {
    return <AdminAuthShell initialStage="login" />
  }

  if (session.user.mustChangePassword) {
    return <AdminAuthShell initialStage="change-password" />
  }

  const keystaticParams = { params: params.params ?? [] }
  return <KeystaticApp params={keystaticParams} />
}
