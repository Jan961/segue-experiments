import { NextApiRequest, NextApiResponse } from 'next'
import { generateReport } from 'services/performanceReport';
import { Report } from 'types/report';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const report = req.body as Report;
    const pdfStream = await generateReport(report)
    res.setHeader('Content-Type', 'application/pdf')
    pdfStream.pipe(res)
    pdfStream.on('end', () => console.log('Done streaming, response sent.'))
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error fetching reports' })
  }
}