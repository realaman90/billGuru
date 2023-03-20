
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import {authOptions} from '../auth/[...nextauth]'
import prisma from '../../../lib/prismadb'
const csv = require('csv-parser');
const fs = require('fs');


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req,res,authOptions);
    if (!session) {
        res.status(401).json({message: 'Unauthorized'})
    }
    if(req.method === 'POST' && session !== null){
      const {email} = session.user;
        if(!email) return res.status(404).json({message:'Invalid form data'});
        //upload CSV file
        const {file} = req.body;
        if(!file) return res.status(404).json({message:'Invalid form data'});
        //parse CSV file
        const results:any[] = [];
        fs.createReadStream(file).pipe(csv()).on('data', (data:unknown) => results.push(data)).on('end', async () => {
            //save data to db
            const data = results.map((item) => {
                return {
                    schedules: item['Schedules'],
                    sno: item['S. No.'],
                    chapter: item['Chapter'],
                    description: item['Description'],      
                    cgst: item['CGST'],
                    sgst: item['SGST'],
                    igst: item['IGST'],
                    cess: item['CESS'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            })
            //check if hsncodes table is empty
            const hsnCodesCount = await prisma.hsnCodes.count();
            //if not empty delete all data
            if(hsnCodesCount > 0) {
                await prisma.hsnCodes.deleteMany();
            }
            //save to the database using prisma model hsnCodes
            const hsnCodes = await prisma.hsnCodes.createMany({
                data,
            })
            if(!hsnCodes) return res.status(500).json({message: 'Something went wrong'});

            res.status(200).json({message: 'HSN Codes uploaded successfully', data: hsnCodes});

            

        });
        


    }
}