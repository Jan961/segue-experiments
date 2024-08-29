import type { NextApiRequest, NextApiResponse } from 'next';
import ogs from 'open-graph-scraper';
import { isNullOrEmpty } from 'utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await ogs({ url, onlyGetOpenGraphInfo: true });
    const { result } = response;
    if (result.error) {
      res.status(200).json({ ogImage: null });
    }

    const { ogTitle, ogImage } = result;
    res.status(200).json({ ogTitle, ogImage: !isNullOrEmpty(ogImage) ? ogImage[0] : null });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to fetch Open Graph data' });
  }
}
