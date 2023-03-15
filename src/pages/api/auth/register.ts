import prisma from '../../../lib/prismadb'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcrypt"
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //only post method is accepted
    if (req.method === 'POST') {
        if(!req.body)return res.status(404).json({error:'Invalid form data'});
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (user)return res.status(404).json({message:'User already exists'})
        const salt = await bcrypt.genSalt(10);
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: await bcrypt.hash(password, salt)
            }
        })
        res.status(200).json({message:'User created successfully'})


    }else{
        res.status(500).json({message: 'HTTP method not valid'})
    }
}
