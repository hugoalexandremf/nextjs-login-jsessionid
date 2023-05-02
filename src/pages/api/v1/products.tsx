// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Data = {
  name: string;
};

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      res.status(200).json({
        products: [
          {
            id: 1,
            name: 'test',
          },
        ],
      });
      break;
    default:
      break;
  }

  res.status(200).json({ text: 'Hello' });
}

/*
export default function handler(req, res) {
        switch (req.method) {
          case 'GET':
            //some code...
            res.status(200).json({//response object})
            break;

          case 'POST':
            //some code...
            res.status(201).json({//response object})
            break;

          case 'PATCH':
            //some code...
            res.status(200).json({//response object})
            break;

          default:
            res.status(405).end(`${method} Not Allowed`);
            break;
        }
      } 
      */
