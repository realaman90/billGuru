import "next-auth/jwt"

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    role?: "admin"

  }
  interface User {

    /** The user's role. */
    role?: sring
  }

}