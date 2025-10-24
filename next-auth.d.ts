import NextAuth, { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username?: string
      isAdmin?: boolean
      mustChangePassword?: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: string
    username: string
    isAdmin: boolean
    mustChangePassword: boolean
    email?: string | null
    name?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    username?: string
    isAdmin?: boolean
    mustChangePassword?: boolean
  }
}

export {}
