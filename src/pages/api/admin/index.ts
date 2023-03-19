import type { NextApiRequest, NextApiResponse } from 'next';
import type { Client } from '@/interfaces';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import {authOptions} from '../auth/[...nextauth]'


const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req,res,authOptions);
    if (!session) {
        res.status(401).json({message: 'Unauthorized'})
    }
    if (req.method === 'GET') {
        const clients = await prisma.client.findMany({
            where: {
                userId: session.user.id,
            },
        });
        res.status(200).json(clients);
    }
}




    export const config = {
        api: {
          bodyParser: {
            sizeLimit: "10mb",
          },
        },
      };
    