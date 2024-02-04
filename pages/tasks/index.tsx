import { GetServerSideProps } from 'next';
import { AllProductionPageProps, getAllProductionPageProps } from 'services/productionService';
import { ProductionSelector } from 'components/ProductionSelector';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import Link from 'next/link';

const ShowSelection = ({ productions }: AllProductionPageProps) => (
  <div>
    <ProductionSelector
      ToolbarButtons={
        <div className="flex gap-6 my-6 justify-center">
          <Link href={`/tasks/all`}>
            <ToolbarButton className="text-purple-900">All Productions</ToolbarButton>
          </Link>
          <Link href={`/tasks/master`}>
            <ToolbarButton className="text-purple-900">View / Edit Master Task List</ToolbarButton>
          </Link>
          <ToolbarButton className="text-purple-900">Start Production Task List</ToolbarButton>
        </div>
      }
      productions={productions}
    />
  </div>
);

export const getServerSideProps: GetServerSideProps = (ctx) => getAllProductionPageProps(ctx);

export default ShowSelection;
