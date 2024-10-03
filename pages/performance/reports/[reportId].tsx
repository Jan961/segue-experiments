import ReportForm from 'components/performance/reportForm';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import { getPerformanceReportById, transformPerformanceReport } from 'services/performanceReports';
import Layout from 'components/Layout';
import Link from 'next/link';

export default function Report({ report }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout title="Performance Reports | Report">
      <nav className="max-w-screen-xl m-auto flex gap-4 items-center py-4">
        <div>
          <Link href="/performance/reports" className="text-gray-900  font-bold hover:text-gray-600 ">
            Reports
          </Link>
        </div>
        <div>
          <Link href="/performance/reports/add" className="text-gray-900 hover:text-gray-600 font-bold">
            Add Report
          </Link>
        </div>
      </nav>
      <div className="p-4 max-w-screen-xl m-auto">
        <div className="flex flex-row gap-10 justify-between items-center">
          <h1 className="w-1/2 text-right text-3xl font-bold text-blue-700 mb-4">
            Report N° {report?.reportNumber ?? ''}
          </h1>
          <img
            src={report?.reportImageUrl ?? ''}
            alt="show logo"
            className="w-40 border border-gray-100"
            width={303}
            height={220}
          />
        </div>
        <div className="mt-8 pb-40">
          <ReportForm
            bookingId={report?.bookingId}
            performanceId={report?.performanceId}
            reportData={report}
            editable={false}
          />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { reportId } = ctx.params;
  const response = await getPerformanceReportById(parseInt(reportId as string, 10), ctx.req as NextApiRequest);
  return {
    props: {
      report: transformPerformanceReport(response),
    },
  };
};
