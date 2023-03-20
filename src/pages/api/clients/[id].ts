import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
  }
  // get id from url
  const { id } = req.query;
  if (!id) return res.status(404).json({ message: 'Invalid form data' });
  //get one client
  if (req.method === 'GET' && session !== null) {
    // find client
    const client = await prisma.client.findUnique({
      where: {
        id: String(id),
      },
    });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json(client);
  }
  //update a client
  if (req.method === 'PUT' && session !== null) {
    const {
      name,
      email: clientEmail,
      phone,
      address,
      vat,
      businessNumber,
      pinCode,
    }: {
      name: string;
      email: string;
      phone: string;
      address: string;
      pinCode: string;
      vat: string;
      businessNumber: string;
    } = req.body;
    if (
      !name ||
      !clientEmail ||
      !phone ||
      !address ||
      !vat ||
      !businessNumber ||
      !pinCode
    ) {
      return res.status(404).json({ message: 'Please fill all fields' });
    }
    const client = await prisma.client.update({
      where: {
        id: String(id),
      },
      data: {
        name,
        email: clientEmail,
        phone,
        address,
        vat,
        businessNumber,
        pinCode,
      },
    });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json(client);
  }
  //delete a client
  if (req.method === 'DELETE' && session !== null) {
    const client = await prisma.client.delete({
      where: {
        id: String(id),
      },
    });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json(client);
  }
  
}
