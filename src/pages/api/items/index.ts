import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
  }
  if (session !== null) {
    const { email } = session.user;
    if (!email) return res.status(404).json({ message: 'Invalid form data' });
    // find user
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    //find user's copmany
    if (!user) return res.status(404).json({ message: 'Invalid form data' });
    const company = await prisma.company.findFirst({
      where: {
        userId: user.id,
      },
    });

    //get all items
    if (req.method === 'GET' && company !== null) {
      const items = await prisma.item.findMany({
        where: {
          company: {
            id: company.id,
          },
        },
      });
      res.status(200).json(items);
    } else {
      res.status(404).json({ message: 'User not found' });
    }

    //create new item
    if (req.method === 'POST' && company !== null) {
      const {
        name,
        price,
        description,
        tax,
        hsnCodeId,
      }: {
        name: string;
        price: number;
        description: string;
        tax: number;
        hsnCodeId: string;
      } = req.body;
      //create new item
      const item = await prisma.item.create({
        data: {
          name,
          price,
          description,
          tax,
          hsnCodeId,
          companyId: company.id,
        },
      });
      if (!item) return res.status(404).json({ message: 'Invalid form data' });
      res.status(200).json(item);
    }
  }
}
