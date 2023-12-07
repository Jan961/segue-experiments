import { GetServerSideProps } from 'next';
import { AllTourPageProps, getAllTourPageProps } from 'services/TourService';
import { TourSelector } from 'components/TourSelector';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import Link from 'next/link';

const ShowSelection = ({ tours }: AllTourPageProps) => (
  <div>
    <TourSelector
      ToolbarButtons={
        <div className='flex gap-2 my-4'>
          <Link href={`/tasks/all`}>
            <ToolbarButton>All Productions</ToolbarButton>
          </Link>
          <Link href={`/tasks/master`}>
            <ToolbarButton>View / Edit Master Task List</ToolbarButton>
          </Link>
          <ToolbarButton>Start Production Task List</ToolbarButton>
        </div>
      }
      tours={tours}
    />
  </div>
);

export const getServerSideProps: GetServerSideProps = (ctx) => getAllTourPageProps(ctx);

export default ShowSelection;
