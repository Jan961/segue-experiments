import Image from 'next/image';
import ReportForm from 'components/performance/reportForm';
import { Report as ReportType } from 'types/report';
import { GetServerSideProps } from 'next';
import { getPerformanceReportById, transformPerformanceReport } from 'services/performanceReports';
import Layout from 'components/Layout';
import Link from 'next/link';

interface ReportProps {
  report: ReportType;
}

export default function Report({ report }: ReportProps) {
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
      <div className="mt-16 p-4 max-w-screen-xl m-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Report N° {report?.reportNumber ?? ''}</h1>
        <div className=" w-80 mb-8">
          <Image
            src={report?.reportImageUrl ?? ''}
            alt="show logo"
            className="w-full min-h-[7rem] border border-gray-100"
            width={303}
            height={220}
            priority
          />
        </div>
        <div className="mt-16 pb-40">
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
  const response = await getPerformanceReportById(parseInt(reportId as string, 10));
  return {
    props: {
      report: transformPerformanceReport(response),
    },
  };
};
