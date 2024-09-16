import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const secretKey = process.env.FILE_CONVERSION_SECRET_KEY;

  if (req.method === 'POST') {
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 300 * 60,
    };

    const token = jwt.sign(payload, secretKey);

    res.status(200).json({ token });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
