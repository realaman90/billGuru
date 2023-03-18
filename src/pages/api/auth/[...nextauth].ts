import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
const bcrypt = require('bcrypt');
import prisma from '../../../lib/prismadb'
import { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import CredentialProvider from "next-auth/providers/credentials"

export default NextAuth( {
    adapter: PrismaAdapter(prisma),
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialProvider({
            name: 'Credentials',
            // get the credentials from the request
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: {  label: "Password", type: "password" }
            },
            
            
            authorize: async (credentials:any,req) => {
                // Add logic here to look up the user from the credentials supplied
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })
                if(!user){
                    return null
                }
                const isValid = await bcrypt.compare(credentials.password, user.password)
                if(!isValid){
                    return null
                }
                return user
            }
        })
    
    ],
   

    

})

