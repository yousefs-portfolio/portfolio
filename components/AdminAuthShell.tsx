'use client'

import {FormEvent, useState} from 'react'
import {useRouter} from 'next/navigation'

type Stage = 'login' | 'change-password'

interface AdminAuthShellProps {
  initialStage: Stage
}

export default function AdminAuthShell({initialStage}: AdminAuthShellProps) {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>(initialStage)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [alert, setAlert] = useState<{text: string; tone: 'error' | 'info'} | null>(
    initialStage === 'change-password'
      ? {text: 'For security, please set a new password.', tone: 'info'}
      : null
  )

  const resetFields = () => {
    setPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setAlert(null)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Invalid credentials')
      }

      const body = await response.json()
      resetFields()

      if (body.mustChangePassword) {
        setStage('change-password')
        setAlert({text: 'For security, please set a new password.', tone: 'info'})
      } else {
        router.refresh()
      }
    } catch (error) {
      setAlert({
        text: error instanceof Error ? error.message : 'Unable to login',
        tone: 'error'
      })
    } finally {
      setPending(false)
    }
  }

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAlert(null)

    if (newPassword !== confirmPassword) {
      setAlert({text: 'Passwords do not match.', tone: 'error'})
      return
    }

    setPending(true)
    try {
      const response = await fetch('/api/auth/change-password', {
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

      resetFields()
      router.refresh()
    } catch (error) {
      setAlert({
        text: error instanceof Error ? error.message : 'Failed to update password',
        tone: 'error'
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-center mb-2">Admin Access</h1>
          <p className="text-center text-gray-400">
            {stage === 'login'
              ? 'Enter your credentials to access the CMS.'
              : 'Set a new password to finish securing your account.'}
          </p>
        </div>

        {alert && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              alert.tone === 'error'
                ? 'border border-red-500 bg-red-500/10 text-red-200'
                : 'border border-blue-500 bg-blue-500/10 text-blue-200'
            }`}
          >
            {alert.text}
          </div>
        )}

        {stage === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold mb-2">Username</label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
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
        )}
      </div>
    </div>
  )
}
