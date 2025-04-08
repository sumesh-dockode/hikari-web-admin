import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      role: string;
      accessToken: string; // Include access token
      refreshToken: string; // Include refresh token
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string;
    accessToken?: string; // Include access token
    refreshToken?: string; // Include refresh token
  }
}
