import type { NextApiRequest, NextApiResponse } from 'next';
import type { Client } from '@/interfaces';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();