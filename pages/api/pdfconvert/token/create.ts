import { UTCDate } from '@date-fns/utc';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const secretKey = process.env.FILE_CONVERSION_SECRET_KEY;

  const EXPIRE_IN = 300 * 60; // currently 5 hours untill token expires

  if (req.method === 'POST') {
    const payload = {
      iat: Math.floor(UTCDate.now() / 1000),
      exp: Math.floor(UTCDate.now() / 1000) + EXPIRE_IN,
    };

    const token = jwt.sign(payload, secretKey);

    res.status(200).json({ token });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
