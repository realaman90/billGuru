import type { NextApiRequest, NextApiResponse } from 'next';
import type { Client } from '../../interfaces';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { name, email, address, pinCode, phone, businessNumber, vat } =
        req.body;
      const client: Client = await prisma.client.create({
        data: {
          name,
          email,
          address,
          pinCode,
          phone,
          businessNumber,
          vat,
        },
      });
      res.status(200).json(client);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
if (req.method === 'GET'){
    try {
        const clients: Client[] = await prisma.client.findMany();
        res.status(200).json(clients);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

}
}

// At the end of your file, you can add a Prisma client connection cleanup handler
export const config = {
    api: {
      bodyParser: {
        sizeLimit: '1mb',
      },
    },
  };
  
  export function cleanup() {
    prisma.$disconnect();
  }