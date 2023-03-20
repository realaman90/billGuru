import { NextApiRequest, NextApiResponse } from 'next';
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
  // get invoice id
  const { id } = req.query;
  if (!id) return res.status(404).json({ message: 'Invalid form data' });
  //get an invoice
  if (req.method === 'GET' && session !== null) {
    //get one invoice
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: String(id),
      },
    });
    if (!invoice) return res.status(404).json({ message: 'Invalid form data' });
    res.status(200).json(invoice);
  }
    //update an invoice


}
