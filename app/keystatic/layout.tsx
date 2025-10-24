import AuthProvider from '@/components/AuthProvider'

export const dynamic = 'force-dynamic'
export const revalidate = false
export const runtime = 'nodejs'

export default function KeystaticLayout({children}: {children: React.ReactNode}) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
