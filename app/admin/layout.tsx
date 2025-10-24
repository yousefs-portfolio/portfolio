import '../globals.css'
import AuthProvider from '@/components/AuthProvider'

export const dynamic = 'force-dynamic'
export const revalidate = false
export const runtime = 'nodejs'

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="font-inter bg-black text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
