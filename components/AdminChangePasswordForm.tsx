'use client'

import {FormEvent, useState} from 'react'
import {useRouter} from 'next/navigation'
import {signIn, signOut, useSession} from 'next-auth/react'

interface AdminChangePasswordFormProps {
  username: string
}

export default function AdminChangePasswordForm({username}: AdminChangePasswordFormProps) {
  const router = useRouter()
  const {data: session} = useSession()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(
    'For security, please set a new password.'
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters.')
      return
    }

    setPending(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPassword})
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to update password')
      }

      const signInResult = await signIn('credentials', {
        username,
        password: newPassword,
        redirect: false,
        callbackUrl: '/admin'
      })

      if (signInResult?.error) {
        setMessage('Password updated, please sign in again.')
        await signOut({redirect: false})
        router.replace('/admin/login')
        router.refresh()
        return
      }

      setNewPassword('')
      setConfirmPassword('')
      setMessage('Password updated successfully.')
      router.refresh()
    } catch (error) {
      console.error('Failed to change password:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to update password.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-center mb-2">Update Password</h1>
          <p className="text-center text-gray-400">
            {(session?.user?.name ?? username) ? `Welcome, ${session?.user?.name ?? username}.` : 'Welcome.'}
          </p>
        </div>

        {message && (
          <div className="rounded-lg border border-blue-500 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold mb-2">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {pending ? 'Updating…' : 'Update password'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => signOut({callbackUrl: '/admin/login'})}
            className="text-sm text-gray-400 hover:text-white underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
