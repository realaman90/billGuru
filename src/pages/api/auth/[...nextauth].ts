import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
const bcrypt = require('bcrypt');
import prisma from '../../../lib/prismadb'
import { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default NextAuth( {
    adapter: PrismaAdapter(prisma),
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const {email, password} = credentials as any;
                const user = await prisma.user.findUnique({
                    where: {
                        email: email
                    }
                })
                if (user) {
                    const isValid = await bcrypt.compare(password, user.password)
                    if (isValid) {
                        return user
                    } else {
                        throw new Error('Invalid password')
                    }
                } else {
                    throw new Error('Invalid email')
                }
            }
        })
    
    ],
    // callbacks: {
    //     async jwt(token, user) {
    //         return {...token, user}
    //     },
    //     async session(session, token) {
    //         return {...session, user: token.user}
    //     }
    // }
    

})

