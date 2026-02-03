import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env.mjs";
import { pagesOptions } from "./pages-options";

export const authOptions: NextAuthOptions = {
  pages: {
    ...pagesOptions,
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.username = (user as any).username;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...(session.user ?? {}),
          id: token.id as string,
          name: token.username as string,
        },
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      } as any;
    },

    async redirect({ url, baseUrl }) {
      // If url is relative, prepend baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If url is on the same origin as baseUrl, allow it
      else if (new URL(url).origin === baseUrl) return url;
      // Otherwise redirect to baseUrl
      return baseUrl;
    },
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) return null;

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/login/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            }
          );

          const text = await res.text();
          console.log("backend status:", res.status);
          console.log("backend response:", text);

          if (!res.ok) return null;

          const json = JSON.parse(text) as any;

          const accessToken = json?.data?.access;
          const refreshToken = json?.data?.refresh;

          const userId = json?.data?.user?.id;
          const username = json?.data?.user?.username ?? credentials.username;

          if (!accessToken || !userId) return null;

          return {
            id: String(userId),
            username: String(username),
            accessToken,
            refreshToken,
          } as any;
        } catch (err) {
          console.log("authorize error:", err);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
