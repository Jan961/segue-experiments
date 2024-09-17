import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { location } = req.query;
    const response = axios.get(location as string);
    console.log(response);
    res.status(200);
  } catch (err) {
    console.error(err, 'Error - failed to fetch the file');
  }
}
