import { NextApiRequest, NextApiResponse } from 'next';
import { getPersonById } from 'services/person';
import { transformPersonWithRoles } from 'transformers/person';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    const person = await getPersonById(Number(id), req);

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    const personDetails = transformPersonWithRoles(person);

    return res.status(200).json(personDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
