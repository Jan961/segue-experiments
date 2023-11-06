import Image from 'next/image'
import ReportForm from 'components/performance/reportForm'
import axios from 'axios'
import { Report as ReportType } from 'types/report'
import { GetServerSideProps } from 'next'

interface ReportProps {
  report: ReportType
}

export default function Report ({ report }: ReportProps) {
  return (
    <div className='mt-16 p-4'>
      <h1 className='text-3xl font-bold text-blue-700 mb-4 text-center'>
        Report N° {report?.reportNumber ?? ''}
      </h1>
      <div className=' w-80 mb-8'>
        <Image
          src={report?.reportImageUrl ?? ''}
          alt='show logo'
          className='w-full min-h-[7rem] border border-gray-100'
          width={303}
          height={220}
          priority
        />
      </div>
      <div className='mt-16 pb-40'>
        <ReportForm
          bookingId={report?.bookingId}
          performanceId={report?.performanceId}
          reportData={report}
          editable={false}
        />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { reportId } = ctx.params
  const response = await axios(`/api/reports/${reportId}`)
  return {
    props: {
      report: response.data
    }
  }
}
