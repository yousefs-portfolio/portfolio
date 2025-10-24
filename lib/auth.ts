'use server'

import {cookies} from 'next/headers'
import crypto from 'crypto'
import {prisma} from './prisma'

const SESSION_COOKIE = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const SESSION_SECRET = process.env.AUTH_SECRET ?? 'development-secret'

type SessionTokenPayload = {
  userId: string
  issuedAt: number
  expiresAt: number
}

export function hashPassword(password: string, salt?: string) {
  const resolvedSalt = salt ?? crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(password, resolvedSalt, 64).toString('hex')
  return {hash: derived, salt: resolvedSalt}
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const {hash: compareHash} = hashPassword(password, salt)
  const hashBuffer = Buffer.from(hash, 'hex')
  const compareBuffer = Buffer.from(compareHash, 'hex')
  if (hashBuffer.length !== compareBuffer.length) {
    return false
  }
  return crypto.timingSafeEqual(hashBuffer, compareBuffer)
}

function encodeToken(payload: SessionTokenPayload) {
  const raw = JSON.stringify(payload)
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(raw).digest('hex')
  const token = Buffer.from(raw).toString('base64url')
  return `${token}.${signature}`
}

function decodeToken(token: string): SessionTokenPayload | null {
  const [rawToken, signature] = token.split('.')
  if (!rawToken || !signature) return null
  let payload: SessionTokenPayload
  try {
    const json = Buffer.from(rawToken, 'base64url').toString()
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(json).digest('hex')
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
      return null
    }
    payload = JSON.parse(json) as SessionTokenPayload
  } catch {
    return null
  }
  if (Date.now() > payload.expiresAt) {
    return null
  }
  return payload
}

function createSessionToken(userId: string) {
  const issuedAt = Date.now()
  const expiresAt = issuedAt + SESSION_MAX_AGE * 1000
  return encodeToken({userId, issuedAt, expiresAt})
}

export function establishSession(userId: string) {
  const token = createSessionToken(userId)
  const store = cookies()
  store.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE
  })
}

export function clearSession() {
  const store = cookies()
  store.delete(SESSION_COOKIE)
}

export async function getSession() {
  const store = cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) {
    return {authenticated: false as const}
  }
  const payload = decodeToken(token)
  if (!payload) {
    store.delete(SESSION_COOKIE)
    return {authenticated: false as const}
  }
  const user = await prisma.user.findUnique({
    where: {id: payload.userId},
    select: {
      id: true,
      username: true,
      mustChangePassword: true,
      isAdmin: true
    }
  })
  if (!user || !user.isAdmin) {
    store.delete(SESSION_COOKIE)
    return {authenticated: false as const}
  }
  return {
    authenticated: true as const,
    user
  }
}

export const sessionConstants = {
  cookieName: SESSION_COOKIE,
  maxAge: SESSION_MAX_AGE
}
