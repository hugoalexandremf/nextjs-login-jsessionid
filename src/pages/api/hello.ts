// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    // Process a GET request
    res.status(200).json({ name: 'John Doe' });
  } else {
    // Handle any other HTTP method
    res.status(200).json({ name: 'John Doe' });
  }
}
