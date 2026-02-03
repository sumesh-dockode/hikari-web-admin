import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      role: string;
    } & DefaultSession['user'];
    accessToken: string; // Access token at root level
    refreshToken: string; // Refresh token at root level
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string;
    accessToken?: string; // Include access token
    refreshToken?: string; // Include refresh token
  }
}
