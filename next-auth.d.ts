import NextAuth from "next-auth"
import {JWT} from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {      
      id: string
      role: string
     
    } & DefaultSession["user"]
  }
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
    role?: string
  }
  interface User {
    id?: string | unknown
    role?: string | unknown

  }
}
