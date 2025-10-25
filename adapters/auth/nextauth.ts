import type {AuthOptions, Session, User} from 'next-auth';
import type {JWT} from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

import { authenticateAdmin } from '@core/use-cases/authenticate-admin';

import {drizzleAdminUserRepository} from '../db/drizzle/admin-user.repository';
import { passwordHasher } from '../crypto/node/password-hasher';

export const authOptions: AuthOptions = {
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
              adminUserRepository: drizzleAdminUserRepository,
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
      async jwt({token, user}: { token: JWT; user?: User | null }) {
      if (user) {
          const admin = user as User;
          token.id = admin.id ?? token.id;
          token.username = admin.username ?? token.username;
          token.isAdmin = admin.isAdmin ?? token.isAdmin;
          token.mustChangePassword = admin.mustChangePassword ?? token.mustChangePassword;
      }
      return token;
    },
      async session({session, token}: { session: Session; token: JWT }) {
      session.user = {
          id: (token.id as string) ?? session.user?.id ?? '',
          name: token.name ?? session.user?.name ?? null,
          email: token.email ?? session.user?.email ?? null,
          username: (token.username as string | undefined) ?? session.user?.username,
          isAdmin: Boolean(token.isAdmin),
          mustChangePassword: Boolean(token.mustChangePassword),
      };
          return session;
      },
  },
};
