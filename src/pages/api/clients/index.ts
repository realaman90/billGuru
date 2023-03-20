import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import {authOptions} from '../auth/[...nextauth]'
import prisma from '../../../lib/prismadb'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req,res,authOptions);
    if (!session) {
        res.status(401).json({message: 'Unauthorized'})
    }
    //get all clients
    if (req.method === 'GET' && session !== null) {
        const {email} = session.user;
        if(!email) return res.status(404).json({message:'Invalid form data'});

       

        // find user
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        });
         //find user's copmany
        if(!user) return res.status(404).json({message:'Invalid form data'});
        const company = await prisma.company.findFirst({
            where: {
                userId: user.id

            },
        });
        if (company) {
            const clients = await prisma.client.findMany({
                where: {
                    company:{
                        id: company.id
                    }
                },
            });
            res.status(200).json(clients);

        }else{
            res.status(404).json({message: 'User not found'})
        }

    }

    //create a client
    if(req.method === 'POST' && session !== null){
        const {email} = session.user;
        if(!email) return res.status(404).json({message:'Invalid form data'});
        const {name, email: clientEmail, phone, address,vat,
            businessNumber, pinCode}:{
            name: string,
            email: string,
            phone: string,
            address: string,
            pinCode: string,
            vat: string,
            businessNumber: string
            
        } = req.body;
        if(!name || !clientEmail ){
            return res.status(404).json({message:'Please fill all fields'})
        }
        // find user
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        });
            //find user's copmany
        if(!user) return res.status(404).json({message:'Invalid form data'});

        const company = await prisma.company.findFirst({
            where: {
               userId: user.id
            },
        });

        if (company) {
            const client = await prisma.client.create({
                data: {
                    name,
                    email: clientEmail,
                    phone,
                    vat,
                    businessNumber,
                    pinCode,
                    address,
                    company:{
                        connect: {
                            id: company.id
                        }
                    }
                }
            });
            res.status(200).json(client);
        }else{
            res.status(404).json({message: 'User not found'})
        }
    }
    
    
}
