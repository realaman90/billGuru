import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
const bcrypt = require('bcrypt');
import prisma from '../../../lib/prismadb';
import { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import CredentialProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialProvider({
        name: 'Credentials',
        // get the credentials from the request
        credentials: {},
        authorize: async (credentials: any, req) => {
          // Add logic here to look up the user from the credentials supplied
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
          if (!user) {
            return null;
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            return null;
          }
          console.log(user);
          return user;
        },
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    jwt: {
      // Defaults to `session.maxAge`.
      maxAge: 60 * 60 * 24 * 30,
      
  
    },
  
    callbacks: {
      async jwt({ token, user, account, profile, isNewUser }) {
        if (user) {
            // token.idToken = user.id;
            token.role = user.role;
        
        }
             return token;
      },
  
      async session({ session,user,token }) {          
        // console.log("session: ", session, "user: ", user, "token: ", token);
        
        session.user.role = token.role;

        console.log(session);
         return session;
      },
    },
  
    pages: {
      signIn: '/auth/login',
      signOut: '/auth/signout',
    },
  }
export default NextAuth(authOptions);
