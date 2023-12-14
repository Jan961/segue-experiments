import { GetServerSideProps } from 'next';
import { AllTourPageProps, getAllTourPageProps } from 'services/TourService';
import { TourSelector } from 'components/TourSelector';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import Link from 'next/link';

const ShowSelection = ({ tours }: AllTourPageProps) => (
  <div>
    <TourSelector
      ToolbarButtons={
        <div className='flex gap-6 my-6 justify-center'>
          <Link href={`/tasks/all`}>
            <ToolbarButton className="text-purple-900">All Productions</ToolbarButton>
          </Link>
          <Link href={`/tasks/master`}>
            <ToolbarButton className="text-purple-900">View / Edit Master Task List</ToolbarButton>
          </Link>
          <ToolbarButton className="text-purple-900">Start Production Task List</ToolbarButton>
        </div>
      }
      tours={tours}
    />
  </div>
);

export const getServerSideProps: GetServerSideProps = (ctx) => getAllTourPageProps(ctx);

export default ShowSelection;
