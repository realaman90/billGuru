import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '../../../../lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
  }
  // get item id
  const { id } = req.query;
  if (!id) return res.status(404).json({ message: 'Invalid form data' });
  //get an item
  if (req.method === 'GET' && session !== null) {
    //get one item
    const item = await prisma.item.findFirst({
      where: {
        id: String(id),
      },
    });
    if (!item) return res.status(404).json({ message: 'Invalid form data' });
    res.status(200).json(item);
  }
  //update an item
  if (req.method === 'PUT' && session !== null) {
    //update one item with id
    const {
      name,
      price,
      description,
      companyId,
      hsnCodeId,
    }: {
      name: string;
      price: number;
      description: string;
      companyId: string;
      hsnCodeId: string;
    } = req.body;
    if (!name || !price || !description || !companyId || !hsnCodeId)
      return res.status(404).json({ message: 'Invalid form data' });
    const item = await prisma.item.update({
      where: {
        id: String(id),
      },
      data: {
        name,
        price,
        description,
        companyId,
        hsnCodeId,
      },
    });
    if (!item) return res.status(404).json({ message: 'Invalid form data' });
    res.status(200).json(item);
  }
  //delete an item
  if (req.method === 'DELETE' && session !== null) {
    //delete one item with id
    const item = await prisma.item.delete({
      where: {
        id: String(id),
      },
    });
    if (!item) return res.status(404).json({ message: 'Invalid form data' });
    res.status(200).json(item);
  }
}
