import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/env.mjs';
import isEqual from 'lodash/isEqual';
import { pagesOptions } from './pages-options';

interface User {
  id: string;
  name: string;
  role: string;
  access_token: string;
  refresh_token: string;
}

interface AuthUser {
  id: string;
  username: string;
  role: string;
}

interface AuthResponse {
  status: 'success' | 'error';
  data: { access: string; refresh: string; user: AuthUser };
}

export const authOptions: NextAuthOptions = {
  // debug: true,
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          accessToken: token.accessToken as string, // Expose access token
          refreshToken: token.refreshToken as string, // Expose refresh token
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as User).id;
        token.accessToken = (user as User).access_token; // Store access token
        token.refreshToken = (user as User).refresh_token; // Store refresh token
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // const parsedUrl = new URL(url, baseUrl);
      // if (parsedUrl.searchParams.has('callbackUrl')) {
      //   return `${baseUrl}${parsedUrl.searchParams.get('callbackUrl')}`;
      // }
      // if (parsedUrl.origin === baseUrl) {
      //   return url;
      // }
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'Enter your username',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          let url = `${process.env.NEXT_PUBLIC_API_URL}/authentication/login/`;

          const requestBody = JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          });

          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
          });

          if (!res.ok) {
            throw new Error('Invalid credentials');
          }

          const responseData = (await res.json()) as AuthResponse;
          if (responseData.status === 'success') {
            const authResponse = responseData.data;

            return {
              id: authResponse.user.id,
              name: authResponse.user.username,
              role: authResponse.user.role,
              access_token: authResponse.access,
              refresh_token: authResponse.refresh,
            };
          } else {
            console.error('Authentication failed:', responseData);
            return null;
          }
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
    // GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID || '',
    //   clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    //   allowDangerousEmailAccountLinking: true,
    // }),
  ],
};
