import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig, isEmailAllowed } from '@/lib/auth-config';
import { usersDb } from '@/lib/users-db';

const providers: any[] = [];

if (authConfig.mode === 'public' || authConfig.mode === 'whitelist') {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  );
}

if (authConfig.mode === 'credentials') {
  providers.push(
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await usersDb.validatePassword(
          credentials.email,
          credentials.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }

        return null;
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      if (authConfig.mode === 'whitelist') {
        return isEmailAllowed(user.email);
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
