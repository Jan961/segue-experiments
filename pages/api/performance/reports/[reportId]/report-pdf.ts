import { NextApiRequest, NextApiResponse } from 'next';
import { generateReport } from 'services/performanceReport';
import { getPerformanceReportById, transformPerformanceReport } from 'services/performanceReports';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const reportId = req.query.reportId as string;
    if (!reportId) return res.status(401).end();
    const report = await getPerformanceReportById(parseInt(reportId, 10), req);
    const pdfStream = await generateReport(transformPerformanceReport(report));
    res.setHeader('Content-Type', 'application/pdf');
    pdfStream.pipe(res);
    pdfStream.on('end', () => console.log('Done streaming, response sent.'));
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching reports' });
  }
}
