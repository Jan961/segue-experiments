import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { location } = req.query;
    const response = await axios.get(location as string);
    res.status(200).send(response?.data);
  } catch (err) {
    console.error(err, 'Error - failed to fetch the file');
  }
}
