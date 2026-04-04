import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null
      if (credentials.password.length < 4) return null

      const name = credentials.email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

      return {
        id: credentials.email,
        email: credentials.email,
        name,
      }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.name = profile.name
        token.picture = (profile as Record<string, string>).picture
      }
      if (user) {
        token.name = token.name || user.name
        token.email = token.email || user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const s = session as unknown as Record<string, unknown>
        s.accessToken = token.accessToken
        session.user.image = (token.picture as string) || null
        session.user.name = token.name || session.user.name
        session.user.email = token.email || session.user.email
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'salomo-partners-dev-secret-change-in-production',
}
