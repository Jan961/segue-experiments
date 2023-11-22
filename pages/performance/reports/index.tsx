import Link from 'next/link';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { getReportsList } from 'services/performanceReports';
import Layout from 'components/Layout';

interface Report {
  id: string;
  reportNumber: string;
  venue: string;
  performanceId: string;
  performanceDate: string;
  performanceTime: string;
  createdAt: string;
  showName: string;
}

export default function Reports({ reports }: { reports: Report[] }) {
  return (
    <Layout title="Performance Reports | Segue">
      <div className="max-w-screen-xl m-auto">
        <nav className="flex gap-4 items-center py-4">
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
        <div className="p-6">
          <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Reports</h1>
          <div className="flex lg:justify-end items-center mb-4">
            <Link
              href="/performance/reports/add"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 "
            >
              Add Report
            </Link>
          </div>
          <table className="w-full border-collapse border shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border text-left">Report N°</th>
                <th className="px-4 py-2 border text-left">Report date</th>
                <th className="px-4 py-2 border text-left">Show</th>
                <th className="px-4 py-2 border text-left">Venue</th>
                <th className="px-4 py-2 border text-left">Performance N°</th>
                <th className="px-4 py-2 border text-left">Performance Date</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports?.map(
                ({ id, reportNumber, venue, performanceId, performanceDate, performanceTime, createdAt, showName }) => (
                  <tr key={id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="px-4 py-2 border">{reportNumber}</td>
                    <td className="px-4 py-2 border">{format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}</td>
                    <td className="px-4 py-2 border">{showName}</td>
                    <td className="px-4 py-2 border">{venue}</td>
                    <td className="px-4 py-2 border">{performanceId}</td>
                    <td className="px-4 py-2 border">
                      {format(new Date(performanceDate), 'eee dd/MM/yyyy')} at{' '}
                      {format(new Date(performanceTime), 'HH:mm')}
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex gap-1">
                        <Link href={`/performance/reports/${id}`} className="text-blue-600">
                          View
                        </Link>
                        <span>|</span>
                        <a
                          href={`/api/performance/reports/${id}/report-pdf`}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="text-blue-600"
                        >
                          Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await getReportsList();
    return {
      props: {
        reports:
          response?.map?.((report: any) => ({
            id: report?.Id,
            reportNumber: report?.Id,
            createdAt: report?.CreatedAt?.toISOString?.(),
            performanceId: report?.Performance?.Id,
            performanceDate: report?.Performance?.Date?.toISOString?.(),
            performanceTime: report?.Performance?.Time?.toISOString?.(),
            showName: report?.Performance?.Booking?.DateBlock?.Tour?.Show?.Name,
            venue: report?.Performance?.Booking?.Venue?.Name,
          })) || [],
      },
    };
  } catch (error) {
    console.log('Error', error);
    return {
      props: {
        reports: [],
      },
    };
  }
};
