import type { NextApiRequest, NextApiResponse } from 'next';
import type { Client, Item, Details, Fee } from '@/interfaces';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
  }
  if (session) {
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
    //get all invoices
    if (req.method === 'GET' && company !== null) {
      //get all invoices
      const invoices = await prisma.invoice.findMany({
        where: {
          company: {
            id: company.id,
          },
        },
      });
      if (!invoices)
        return res.status(404).json({ message: 'No invoices found' });
      res.status(200).json(invoices);
    } else {
      res.status(404).json({ message: 'User not found' });
    }

    //create new invoice
    if (req.method === 'POST' && company !== null) {
      const {
        client,
        items,
        details,
        status,
        fees,
        subtotal,
        totalTax,
        totalDiscount,
        total,
        balanceDue,
        notes,
        terms,
        currency,
        attachments,
        locale,
        payments,
        companyId,
      }: {
        client: string;
        items: Item[];
        details: Details;
        status: string;
        fees?: Fee[];
        subtotal: number;
        totalTax: number;
        totalDiscount: number;
        total: number;
        balanceDue: number;
        notes?: string;
        terms?: string;
        currency: string;
        attachments?: string[];
        locale: string;
        payments: [];
        companyId: string;
      } = req.body;

        //create invoice
        const invoice = await prisma.invoice.create({
            data: {
                clientId: client,
                items,
                details,
                status,
                fees,
                subtotal,
                totalTax,
                totalDiscount,
                total: total,
                balanceDue,
                notes,
                terms,
                currency,
                attachments,
                locale,
                payments,
                companyId: company.id
            }
        });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.status(200).json(invoice);
        
    }
  }
}
