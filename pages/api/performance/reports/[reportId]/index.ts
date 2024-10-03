import { NextApiRequest, NextApiResponse } from 'next';
import { getPerformanceReportById, transformPerformanceReport } from 'services/performanceReports';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const reportId = req.query.reportId as string;
    if (!reportId) return res.status(401).end();
    const result = await getPerformanceReportById(parseInt(reportId, 10), req);
    res.status(200).json(transformPerformanceReport(result));
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching report' });
  }
}
