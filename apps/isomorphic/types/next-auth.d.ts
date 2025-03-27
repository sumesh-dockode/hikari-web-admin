import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      role: Role;
      access_token: string;
      refresh_token: string;
      // currentTeamId: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    id: string;
    name: string;
    role: Role;
    access_token: string;
    refresh_token: string;
    exp?: number;
  }
}
