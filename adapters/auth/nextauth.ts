import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { authenticateAdmin } from '@core/use-cases/authenticate-admin';

import { prismaAdminUserRepository } from '../db/prisma/admin-user.repository';
import { passwordHasher } from '../crypto/node/password-hasher';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const admin = await authenticateAdmin(
          {
            username: credentials.username,
            password: credentials.password,
          },
          {
            adminUserRepository: prismaAdminUserRepository,
            passwordHasher,
          },
        );

        if (!admin) {
          return null;
        }

        return {
          id: admin.id,
          name: admin.name ?? admin.username,
          email: admin.email ?? undefined,
          username: admin.username,
          isAdmin: admin.isAdmin,
          mustChangePassword: admin.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? token.id;
        token.username = (user as any).username ?? token.username;
        token.isAdmin = (user as any).isAdmin ?? token.isAdmin;
        token.mustChangePassword = (user as any).mustChangePassword ?? token.mustChangePassword;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
