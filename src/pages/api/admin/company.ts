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
    if (req.method === 'GET' && session !== null) {
        const {email} = session.user;
        if(!email) return res.status(404).json({message:'Invalid form data'});
        // find user
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        });
        if(!user) return res.status(404).json({message:'Invalid form data'});

        const company = await prisma.company.findFirst({
            where: {
                userId: user.id

            },
        });
        res.status(200).json(company);
    }
    if(req.method === 'POST' && session !== null){
        const {email} = session.user;
        if(!email) return res.status(404).json({message:'Invalid form data'});
        const {name, companyEmail, vat, phone,pinCode, businessNumber, address}:{
            name: string,
            companyEmail: string,
            vat: string,
            phone: string,
            businessNumber: string,
            address: string,
            pinCode: string

        } = req.body;
        if(!name || !companyEmail || !vat || !phone || !businessNumber || !address){
            return res.status(404).json({message:'Please fill all fields'})
        }
        const company = await prisma.company.create({
            data: {
                name,
                email: companyEmail,
                vat,
                phone,
                pinCode,
                businessNumber,
                address,
                user: {
                    connect: {
                        email: email
                    }
                }
            }
        });

        res.status(200).json(company);
    }
}




    export const config = {
        api: {
          bodyParser: {
            sizeLimit: "10mb",
          },
        },
      };
    