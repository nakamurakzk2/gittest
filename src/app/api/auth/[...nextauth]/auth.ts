import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from 'next-auth/providers/facebook'
import type { NextAuthOptions } from "next-auth"
import { cookies } from 'next/headers'

// Entity
import { LoginToken } from "@/entity/user/user"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as GoogleLoginServerLogic from "@/logic/server/user/google-login-server-logic"

// セッションの型を拡張
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      email?: string
      name?: string
      sessionKey?: string
    }
    loginToken?: LoginToken
  }

  interface User {
    id?: string
    email?: string
    name?: string
  }
}

// JWTの型を拡張
declare module "next-auth/jwt" {
  interface JWT {
    sessionKey?: string
    loginToken?: LoginToken
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          customSessionKey: ''
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',          // ログインページ
    error: '/auth/error',      // エラーページ
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account == null || user == null) return false
      const { id, email } = user
      if (id == null || email == null) return false

      const cookieStore = cookies()
      const key = cookieStore.get('custom_session_key')?.value || undefined
      const recaptchaToken = cookieStore.get('recaptcha_token')?.value || ''
      const a8Param = cookieStore.get('a8Param')?.value || undefined
      const token = await CommonLogic.generateSecureToken()

      // custom_session_keyクッキーを削除
      if (key) {
        cookieStore.delete('custom_session_key')
      }
      // recaptcha_tokenクッキーを削除
      if (recaptchaToken) {
        cookieStore.delete('recaptcha_token')
      }

      switch (account.provider) {
        // Google
        case 'google': {
          const { loginToken } = await GoogleLoginServerLogic.login(key, id, email, token, recaptchaToken, a8Param)
          if (loginToken) {
            (user as any).loginToken = loginToken
          }
          break
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        if ((user as any).loginToken) {
          token.loginToken = (user as any).loginToken
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.loginToken) {
        session.loginToken = token.loginToken
      }
      return session
    },
  },
}